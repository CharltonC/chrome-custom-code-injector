import React, { Component, memo, ReactElement } from "react";

import { IRawRowConfig, IItemCtx } from '../../../service/handle/collapse/type';
import { ClpsHandle } from '../../../service/handle/collapse';
import { SortHandle } from '../../../service/handle/sort';

import { IPageState } from '../../../service/handle/paginate/type';
import { PgnHandle } from '../../../service/handle/paginate';

import { IProps, IRow, TCmpCls, TFn, TNestState, IClpsProps, IState } from './type';

export class _DataGrid extends Component<IProps, IState> {
    readonly clpsHandle = new ClpsHandle();
    readonly sortHandle = new SortHandle();
    readonly pgnHandle = new PgnHandle();

    constructor(props: IProps) {
        super(props);

        this.state = {
            nestState: {},
            sortState: {
                ...this.props.sort
            },
            pgnState: this.pgnHandle.getPgnState({
                ...this.props.paginate,
                list: this.props.data
            })
        };
    }

    UNSAFE_componentWillReceiveProps({data, sort, paginate}: IProps): void {
        const { rows, data: currData, sort: currSort, paginate: currPaginate } = this.props;

        const hsDataChagned: boolean = rows.length > 1 && data !== currData;
        const hsPgnChanged: boolean = rows.length > 1 && paginate !== currPaginate;

        // When there are nested rows and when data changes, reset the nesting state
        if (hsDataChagned || hsPgnChanged) this.setState({
            ...this.state,
            pgnState: this.pgnHandle.getPgnState({...paginate, list: data}),
            nestState: {}
        });

        // When sort option changes from outside the component
        if (sort !== currSort) this.setState({
            ...this.state,
            sortState: {...sort}
        });
    }

    render() {
        const { data: rawData, rows: rowsConfig, nesting, type } = this.props;
        const { showInitial: visiblePath } = nesting;
        const rows: IRawRowConfig[] = this.getMappedConfig(rowsConfig);

        // TODO: Check if sort option exist
        // Sort the data (if needed)
        const { sortState, pgnState } = this.state;
        const sortedData: any[] = this.sortHandle.objList(rawData, sortState.key, sortState.isAsc);

        // Paginate (if any)
        let pgnData: any[];
        if (pgnState) {
            const { startIdx, endIdx } = pgnState;
            pgnData = sortedData.slice(startIdx, endIdx);
        }

        const data: any[] = pgnState ? pgnData : sortedData;

        // Render the rows
        const rowElems: ReactElement[] = this.clpsHandle.getClpsState({data, rows, visiblePath});
        return (type === 'table') ? this.renderTable(rowElems) : this.renderList(rowElems);
    }

    renderList(items: ReactElement[]): ReactElement {
        const pgnElem: ReactElement = this.getPgnElem();

        return <>
            <ul>
                {items}
            </ul>
            <div>
                {pgnElem}
            </div>
        </>;
    }

    renderTable(items: ReactElement[]): ReactElement {
        return (
            <table>
                <tbody>
                    {items}
                </tbody>
            </table>
        );
    }

    getMappedConfig(rows: IRow[]): IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as IRawRowConfig;
        });
    }

    getCmpTransformFn(Cmp: TCmpCls): TFn {
        return (itemCtx: IItemCtx) => {
            const { nestState } = this.state;
            const { nesting } = this.props;
            const { itemPath, nestedItems } = itemCtx;
            const hsClpsProps: boolean = nestedItems && nesting;
            const clpsProps: IClpsProps = hsClpsProps ? this.getItemClpsProps(itemCtx, nestState) : {};
            return <Cmp key={itemPath} {...itemCtx} {...clpsProps} />;
        };
    }

    //// Collapse Relevant
    getItemClpsProps(itemCtx: IItemCtx, nestState: TNestState): IClpsProps {
        const { itemPath, isDefNestedOpen } = itemCtx;

        // Only Set the state for each Item during Initialization, if not use the existing one
        const isInClpsState: boolean = typeof nestState[itemPath] !== 'undefined';
        if (!isInClpsState) this.setItemInitialClpsState(nestState, itemCtx);

        const isNestedOpen: boolean = isInClpsState ? nestState[itemPath] : isDefNestedOpen;
        const onCollapseChanged = this.getItemOnClpsChangedFn(itemCtx, isNestedOpen);

        return { isNestedOpen, onCollapseChanged };
    }

    setItemInitialClpsState(nestState: TNestState, {itemPath, isDefNestedOpen}: IItemCtx): void {
        nestState[itemPath] = isDefNestedOpen;
    }

    getItemOnClpsChangedFn(itemCtx: IItemCtx, isNestedOpen: boolean): TFn {
        const { nestState } = this.state;
        const { showOnePerLvl } = this.props.nesting;

        return (() => {
            // Find the items that are at the same level and if they are open (true), close them (set them to false)
            const impactedItemsState: TNestState = showOnePerLvl && !isNestedOpen ? this.getImpactedItemsClpsState(nestState, itemCtx) : {};
            const itemState: TNestState = {[itemCtx.itemPath]: !isNestedOpen};
            this.setState({
                ...this.state,
                nestState: {
                    ...nestState,
                    ...impactedItemsState,
                    ...itemState
                }
            });
        }).bind(this);
    }

    getImpactedItemsClpsState(nestState: TNestState, {itemLvl, itemKey, parentPath}: IItemCtx): TNestState {
        const itemPaths: string[] = Object.getOwnPropertyNames(nestState);
        const isRootLvlItem: boolean = itemLvl === 0;
        const relCtx: string = isRootLvlItem ? '' : `${parentPath}/${itemKey}:`;
        const relCtxPattern: RegExp = new RegExp(relCtx + '\\d+$');

        const impactedItemPaths: string[] = itemPaths.filter((ctx: string) => {
            return isRootLvlItem ?
                Number.isInteger(Number(ctx)) :
                relCtxPattern.test(ctx);
        });

        return impactedItemPaths.reduce((impactedState: TNestState, ctx: string) => {
            const isImpactedItemOpen: boolean = nestState[ctx];
            return isImpactedItemOpen ? {...impactedState, [ctx]: false} : impactedState;
        }, {});
    }

    //// Pagination Related
    getPgnElem() {
        const { pgnState } = this.state;
        const { data, paginate } = this.props;
        const { increment, incrementIdx } = paginate;

        const onChange = ({target}) => {
            this.setState({
                ...this.state,
                pgnState: this.pgnHandle.getPgnState({
                    ...this.props.paginate,
                    list: data,
                    incrementIdx: target.value
                }),
            });
        };

        if (!pgnState) return <>
            <p>Current Page : 1</p>
            <p>Total Pages: 1</p>
            <p>Showing: <select name="" id="" value={incrementIdx} onChange={onChange}>
                {increment.map((_perPage: number, idx: number) => (
                    <option
                        key={`perpage-${idx}`}
                        value={idx}
                        >
                        {_perPage}
                    </option>
                ))}
            </select>/page</p>
            <p>
                <input type="button" disabled={!pgnState} value="first" />
                <input type="button" disabled={!pgnState} value="prev" />
                <input type="button" disabled={!pgnState} value="next" />
                <input type="button" disabled={!pgnState} value="last" />
            </p>
        </>;

        const { first, prev, next, last, pageNo, totalPage } = pgnState;
        return <>
            <p>Current Page : {pageNo}</p>
            <p>Total Pages: {totalPage}</p>
            <p>Showing: <select name="" id="" value={incrementIdx} onChange={onChange}>
                {increment.map((_perPage: number, idx: number) => (
                    <option
                        key={`perpage-${idx}`}
                        value={idx}
                        >
                        {_perPage}
                    </option>
                ))}
            </select>/page</p>
            <p>
                <input type="button" disabled={first === null} onClick={this.getPageNavFn(first)} value="first" />
                <input type="button" disabled={prev === null} onClick={this.getPageNavFn(prev)} value="prev" />
                <input type="button" disabled={next === null} onClick={this.getPageNavFn(next)} value="next" />
                <input type="button" disabled={last === null} onClick={this.getPageNavFn(last)} value="last" />
            </p>
        </>;
    }

    getPageNavFn(pageIdx: number) {
        return ((page: number) => {
            const pgnState: IPageState = this.pgnHandle.getPgnState({
                ...this.props.paginate,
                list: this.props.data,
                page
            });
            this.setState({...this.state, pgnState});
        }).bind(this, pageIdx);
    }
}

export const DataGrid = memo(_DataGrid);