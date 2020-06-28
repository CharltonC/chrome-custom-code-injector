import React, { Component, memo, ReactElement } from "react";

import { IRawRowConfig, IItemCtx } from '../../../service/handle/collapse/type';
import { ClpsHandle } from '../../../service/handle/collapse';
import { SortHandle } from '../../../service/handle/sort';
import { PgnHandle } from '../../../service/handle/paginate';

import { IProps, IRow, TCmpCls, TFn, TNestState, IClpsProps, IState, ISortState, IPgnState, ISortOption, IPgnOption } from './type';

export class _DataGrid extends Component<IProps, IState> {
    readonly clpsHandle = new ClpsHandle();
    readonly sortHandle = new SortHandle();
    readonly pgnHandle = new PgnHandle();

    constructor(props: IProps) {
        super(props);

        const { data, sort, paginate } = props;

        this.state = {
            nestState: {},
            sortState: this.getSortState(sort, data),
            pgnState: this.getPgnState(paginate, data)
        };
    }

    // Update the source of truth when passing new data or config from outside the components
    UNSAFE_componentWillReceiveProps({data, sort, paginate}: IProps): void {
        const { data: currData, sort: currSort, paginate: currPaginate } = this.props;

        const hsDataChanged: boolean = this.isDataDiff(data, currData) || this.isPgnDiff(paginate, currPaginate);
        const hsSortChanged: boolean = this.isSortDiff(sort, currSort);
        const pgnState = hsDataChanged ? {pgnState: this.getPgnState(paginate, data)} : {};
        const nestState = hsDataChanged ? {nestState: {}} : {};

        // TODO: Check if sort, pgn, nesting option exist
        if (hsDataChanged || hsSortChanged) this.setState({
            ...this.state,
            ...pgnState,
            ...nestState,
            sortState: this.getSortState(sort, data)
        });
    }

    render() {
        const { data, rows, nesting, type } = this.props;
        const { sortState, pgnState } = this.state;

        const rowsElem: ReactElement[] = this.clpsHandle.getClpsState({
            data: this.getProcessedData(data, sortState, pgnState),
            rows: this.getMappedConfig(rows),
            visiblePath: nesting.showInitial
        });
        const gridElem: ReactElement = (type === 'table') ? this.getDefTbWrapperElem(rowsElem) : this.getDefListWrapperElem(rowsElem);
        const pgnElem: ReactElement = pgnState ? <div>{this.getDefPgnElem()}</div> : null;

        return <>
            {gridElem}
            {pgnElem}
        </>;
    }

    //// Core
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
            const hsClpsProps: boolean = !!nestedItems && !!nesting;
            const clpsProps: IClpsProps = hsClpsProps ? this.getItemClpsProps(itemCtx, nestState) : {};
            return <Cmp key={itemPath} {...itemCtx} {...clpsProps} />;
        };
    }

    //// State Initialization
    getSortState(sortOption: ISortOption, data: any[]): ISortState {
        if (!sortOption) return;

        const { key, isAsc } = sortOption;
        return {
            option: {...sortOption},
            data: this.sortHandle.objList(data, key, isAsc)
        };
    }

    getPgnState(pgnOption: IPgnOption, data: any[]): IPgnState {
        if (!pgnOption) return;

        return {
            option: {...pgnOption},
            status: this.pgnHandle.getPgnState({...pgnOption, list: data})
        };
    }

    getProcessedData(rawData: any[], sortState: ISortState, pgnState: IPgnState): any[] {
        if (pgnState) {
            const { startIdx, endIdx } = pgnState.status;
            const data = sortState ? sortState.data : rawData;
            return data.slice(startIdx, endIdx);

        } else if (sortState) {
            return sortState.data;
        }
    }

    //// Props Changes Detection
    isDataDiff(data: any[], currData: any[]): boolean {
        return data !== currData || data.length !== currData.length;
    }

    isPgnDiff(paginate: IPgnOption, currPaginate: IPgnOption): boolean {
        return paginate && Object.getOwnPropertyNames(paginate).some((key: string) => {
            const val = paginate[key];
            const currVal = currPaginate[key];
            return Array.isArray(val) ?
                val.some((item, idx: number) => item !== currVal[idx]) :
                val !== currVal;
        });
    }

    isSortDiff(sort: ISortOption, currSort: ISortOption): boolean {
        return sort && Object.getOwnPropertyNames(sort).some((key: string) => {
            return sort[key] !== currSort[key];
        });
    }

    //// Builtin Default Component Template
    getDefListWrapperElem(items: ReactElement[]): ReactElement {
        return <ul>{items}</ul>;
    }

    getDefTbWrapperElem(items: ReactElement[]): ReactElement {
        return <table>
            <tbody>
                {items}
            </tbody>
        </table>;
    }

    getDefPgnElem(): ReactElement {
        const { option, status } =  this.state.pgnState;
        const {
            firstProps, prevProps, nextProps, lastProps, selectProps,
            pageNo, totalPage, startRecord, endRecord, totalRecord
        } = this.getPgnProps(option as any, status);
        // TODO: fix type & create default option

        return <>
            <p>Current Page : {pageNo}</p>
            <p>Total Pages: {totalPage}</p>
            <p>Showing: <select name="" id="" {...selectProps}></select> records/page</p>
            <p>Showing records from: {startRecord} to {endRecord} of total {totalRecord} records</p>
            <p>
                <input type="button" value="first" {...firstProps} />
                <input type="button" value="prev" {...prevProps} />
                <input type="button" value="next" {...nextProps} />
                <input type="button" value="last" {...lastProps} />
            </p>
        </>;
    }

    //// Collapse Related
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
    getPgnProps({increment, incrementIdx}, pgnState) {
        const { first, prev, next, last, ...props } = pgnState;
        return {
            ...props,
            firstProps:  this.getPgnBtnProps(first),
            prevProps: this.getPgnBtnProps(prev),
            nextProps: this.getPgnBtnProps(next),
            lastProps: this.getPgnBtnProps(last),
            selectProps: this.getPgnSelectProps(increment, incrementIdx)
        };
    }

    getPgnBtnProps(val: number) {
        return {
            disabled: !Number.isInteger(val),
            onClick: this.onPgnNav.bind(this, val)
        };
    }

    getPgnSelectProps(increment: number[], incrementIdx: number) {
        return {
            value: incrementIdx,
            onChange: this.onPgnIncrmChanged.bind(this),
            children: increment.map((perPage: number, idx: number) => (
                <option key={`perpage-${idx}`} value={idx}>
                    {perPage}
                </option>
            ))
        };
    }

    onPgnIncrmChanged({target}): void {
        this.setPgnState({
            incrementIdx: target.value,
            page: 0
        });
    }

    onPgnNav(pageIdx: number): void {
        this.setPgnState({page: pageIdx});
    }

    setPgnState(partialPgnOption): void {
        const pgnOption = {...this.state.pgnState.option, ...partialPgnOption};
        const pgnState = this.getPgnState(pgnOption, this.state.sortState.data);
        this.setState({...this.state, pgnState});
    }
}

export const DataGrid = memo(_DataGrid);