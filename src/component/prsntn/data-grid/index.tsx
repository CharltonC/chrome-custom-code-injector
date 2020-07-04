import React, { Component, memo, ReactElement } from "react";

import { ClpsHandle } from '../../../service/handle/collapse';
import { SortHandle } from '../../../service/handle/sort';
import { PgnHandle } from '../../../service/handle/paginate';
import { ThHandle } from '../../../service/handle/table-header';
import { inclStaticIcon } from '../../static/icon';

import {
    IProps,
    IRow, TCmpCls, TFn, TNestState, IClpsProps,
    ISortOption, IPgnOption,
    IState, ISortState, IPgnState, TShallResetState,
    pgnType, PgnOption, clpsType, thType
} from './type';

export class _DataGrid extends Component<IProps, IState> {
    readonly clpsHandle = new ClpsHandle();
    readonly sortHandle = new SortHandle();
    readonly pgnHandle = new PgnHandle();
    readonly thHandle = new ThHandle();

    //// Builtin API
    constructor(props: IProps) {
        super(props);
        const defState: IState = { nestState: null, sortState: null, pgnState: null, thState: null };
        const initState: Partial<IState> = this.createState(props);
        this.state = {...defState, ...initState};
    }

    UNSAFE_componentWillReceiveProps(props: IProps): void {
        const shallReset: TShallResetState = this.shallResetState(props);
        if (!shallReset) return;
        const updateState = this.createState(props, shallReset);
        this.setState({...this.state, ...updateState});
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
    getMappedConfig(rows: IRow[]): clpsType.IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as clpsType.IRawRowConfig;
        });
    }

    getCmpTransformFn(Cmp: TCmpCls): TFn {
        return (itemCtx: clpsType.IItemCtx) => {
            const { nestState } = this.state;
            const { nesting } = this.props;
            const { itemPath, nestedItems } = itemCtx;
            const hsClpsProps: boolean = !!nestedItems && !!nesting;
            const clpsProps: IClpsProps = hsClpsProps ? this.getItemClpsProps(itemCtx, nestState) : {};
            return <Cmp key={itemPath} {...itemCtx} {...clpsProps} />;
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

    //// Deal with Props changes
    /**
     * Determine what slice of state should be reset for avoiding unneeded calls of creating particular state slice
     *
     * PROPS        SELECTIVE STATE THAT REQUIRES TO BE CHANGED IF DIFF. PROPS
     * ---------------------------------------------------------------------
     * data         thState:        yes - modified sort header/asc may be diff. to initial one
     *              sortState:      yes - diff. set or data to sort
     *              pgnState:       yes - diff. set or data to paginate
     *              nestState       yes - since visible data is diff.
     *
     * rows         thState:        no - its dep. on data but indep to the curr. sort state
     *              sortState:      yes - diff. set or data to sort
     *              pgnState:       yes - diff. set or data to paginate
     *              nestState       yes - as the key will be different
     *
     * sort         thState         no - its dep. on data but indep to the curr. sort state
     *              sortState       yes - itself
     *              pgnState        yes - diff. set or data to paginate
     *              nestState       yes - since visible data is diff.
     *
     * nesting      thState         no - its dep. on data but indep to the curr. sort state
     *              sortState       no
     *              pgnState        no
     *              nestState       yes - itself
     *
     * paginate     thState         no - its dep. on data but indep to the curr. sort state
     *              sortState       no
     *              pgnState        yes - itself
     *              nestState       yes - since visible data is diff.
     *
     * header       thState         yes - itself
     *              sortState       no - thState is indep to the curr. sort state
     *              pgnState        no
     *              nestState       no
     *
     * type         thState         no
     *              sortState       no
     *              pgnState        no
     *              nestState       no
     */
    shallResetState(props: IProps): TShallResetState {
        const { data, rows, header, nesting, sort, paginate } = props;
        const { sortState: currSort, pgnState: currPaginate } = this.state;
        const { data: currData, rows: currRows, header: currHeader, nesting: currNesting } = this.props;

        const isDiffData: boolean = data !== currData;
        const isDiffRows: boolean = rows !== currRows;
        const isDiffNesting: boolean = nesting !== currNesting;
        const isDiffSort: boolean = sort !== currSort.option;
        const isDiffPgn: boolean = paginate !== currPaginate.option;
        const isDiffHeader: boolean = header !== currHeader;

        const thState: boolean = isDiffData || isDiffHeader;
        const nestState: boolean = isDiffData || isDiffRows || isDiffSort || isDiffPgn || isDiffNesting;
        const sortState: boolean = isDiffData || isDiffRows || isDiffSort;
        const pgnState: boolean = isDiffData || isDiffRows || isDiffSort || isDiffPgn;
        const shallReset: boolean = (thState || nestState || sortState || pgnState);
        return shallReset ? {thState, nestState, sortState, pgnState} : null;
    }

    //// State & State Slices
    createState(props: IProps, shallReset?: TShallResetState): Partial<IState> {
        const { data, rows, sort, paginate, header } = props;
        shallReset = shallReset ? shallReset : {thState: true, nestState: true, sortState: true, pgnState: true};

        const nestState = (rows.length > 1 && shallReset.nestState) ? {nestState: {}} : {};
        const sortState = (sort && shallReset.sortState) ? {sortState : this.createSortState(sort, data)}: {};
        const pgnState = (paginate && shallReset.pgnState) ? {pgnState: this.createPgnState(paginate, data)} : {}
        const thState = (header && shallReset.thState) ? {thState: this.thHandle.createThCtx(header)}: {};
        return { ...nestState, ...sortState, ...pgnState, ...thState };
    }

    createPgnState(pgnOption: PgnOption, data: any[]): IPgnState {
        // Only display valid increments for <option> value
        const { increment } = pgnOption;
        pgnOption.increment = increment ? this.pgnHandle.parseNoPerPage(increment) : increment;

        const option: PgnOption = Object.assign(this.pgnHandle.getDefOption(), pgnOption);

        return {
            option,
            status: this.pgnHandle.getPgnState(data, option)
        };
    }

    createSortState(sortOption: ISortOption, data: any[]): ISortState {
        const { key, isAsc } = sortOption;
        return {
            option: { ...sortOption },
            // TODO: renamed method
            data: this.sortHandle.objList(data, key, isAsc)
        };
    }

    //// Default Component Template
    getDefListWrapperElem(items: ReactElement[]): ReactElement {
        return <ul>{items}</ul>;
    }

    getDefTbWrapperElem(tbRows: ReactElement[]): ReactElement {
        return (
        <table>
            {this.getDefThElem(this.state.thState)}
            <tbody>{tbRows}</tbody>
        </table>
        );
    }

    getDefThElem(thState): ReactElement {
        const { sortState } = this.state;
        let key, isAsc, onSort;

        // TODO: separate method
        if (sortState) {
            ({ key, isAsc } = sortState.option);

            onSort = (sortKey: string, order: boolean) => {
                const { key, isAsc  } = this.state.sortState.option;
                const isSameTh: boolean = sortKey === key;
                const isSameAsc: boolean = order === isAsc;

                if (isSameTh && isSameAsc) return;

                const option = {
                    key: isSameTh ? key : sortKey,
                    isAsc: order
                };
                this.setState({
                    ...this.state,
                    sortState: this.createSortState(option, this.props.data)
                });
            };
        }

        const upArwElem = inclStaticIcon('arrow-up');
        const dnArwElem = inclStaticIcon('arrow-dn');
        const atvSortStyle = {color: 'red'};

        return thState && (
        <thead>
            {thState.map(row => (
            <tr>
                { row.map(({title, sortKey, ...thCtx}) =>
                <th {...thCtx}>
                    <span>{title}</span>
                    {sortState && sortKey && (
                        <>
                        <span
                            style={sortKey === key && isAsc ? atvSortStyle : {}}
                            onClick={onSort.bind(this, sortKey, true)}
                            >
                            {upArwElem}
                        </span>
                        <span
                            style={sortKey === key && !isAsc ? atvSortStyle : {}}
                            onClick={onSort.bind(this, sortKey, false)}
                            >
                            {dnArwElem}
                        </span>
                        </>
                    )}
                </th>
                )}
            </tr>
            ))}
        </thead>
        );
    }

    getDefPgnElem(): ReactElement {
        const { option, status } = this.state.pgnState;
        const { pageNo, totalPage, startRecord, endRecord, totalRecord } = status;
        const { firstProps, prevProps, nextProps, lastProps, selectProps } = this.getPgnFmElemProps(option, status);

        return <>
            <p>Current Page : {pageNo}</p>
            <p>Total Pages: {totalPage}</p>
            <p>Showing records from: {startRecord} to {endRecord} of total {totalRecord} records</p>
            <p>Showing: <select name="" id="" {...selectProps}></select> records/page</p>
            <p>
                <input type="button" value="first" {...firstProps} />
                <input type="button" value="prev" {...prevProps} />
                <input type="button" value="next" {...nextProps} />
                <input type="button" value="last" {...lastProps} />
            </p>
        </>;
    }

    //// Collapse Related
    getItemClpsProps(itemCtx: clpsType.IItemCtx, nestState: TNestState): IClpsProps {
        const { itemPath, isDefNestedOpen } = itemCtx;

        // Only Set the state for each Item during Initialization, if not use the existing one
        const isInClpsState: boolean = typeof nestState[itemPath] !== 'undefined';
        if (!isInClpsState) this.setItemInitialClpsState(nestState, itemCtx);

        const isNestedOpen: boolean = isInClpsState ? nestState[itemPath] : isDefNestedOpen;
        const onCollapseChanged = this.getItemOnClpsChangedFn(itemCtx, isNestedOpen);

        return { isNestedOpen, onCollapseChanged };
    }

    setItemInitialClpsState(nestState: TNestState, { itemPath, isDefNestedOpen }: clpsType.IItemCtx): void {
        nestState[itemPath] = isDefNestedOpen;
    }

    getItemOnClpsChangedFn(itemCtx: clpsType.IItemCtx, isNestedOpen: boolean): TFn {
        const { nestState } = this.state;
        const { showOnePerLvl } = this.props.nesting;

        return (() => {
            // Find the items that are at the same level and if they are open (true), close them (set them to false)
            const impactedItemsState: TNestState = showOnePerLvl && !isNestedOpen ? this.getImpactedItemsClpsState(nestState, itemCtx) : {};
            const itemState: TNestState = { [itemCtx.itemPath]: !isNestedOpen };
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

    getImpactedItemsClpsState(nestState: TNestState, { itemLvl, itemKey, parentPath }: clpsType.IItemCtx): TNestState {
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
            return isImpactedItemOpen ? { ...impactedState, [ctx]: false } : impactedState;
        }, {});
    }

    //// Pagination Related
    // TODO: return type
    getPgnFmElemProps({ increment, incrementIdx }: PgnOption, pgnState: pgnType.IPgnState) {
        const { first, prev, next, last } = pgnState;

        // TODO: loop for `getPgnBtnProps`
        return {
            firstProps: this.getPgnBtnProps(first),
            prevProps: this.getPgnBtnProps(prev),
            nextProps: this.getPgnBtnProps(next),
            lastProps: this.getPgnBtnProps(last),
            selectProps: this.getPgnSelectProps(increment, incrementIdx)
        };
    }

    getPgnBtnProps(val: number): React.ButtonHTMLAttributes<HTMLButtonElement> {
        return {
            disabled: !Number.isInteger(val),
            onClick: (() => {
                this.onPgnChanged({ page: val });
            }).bind(this)
        };
    }

    getPgnSelectProps(increment: number[], incrementIdx: number): React.SelectHTMLAttributes<HTMLSelectElement> {
        return {
            value: incrementIdx,
            children: increment.map((perPage: number, idx: number) => (
                // TODO: Move this to Def Component Class
                <option key={`perpage-${idx}`} value={idx}>
                    {perPage}
                </option>
            )),
            onChange: (({ target }) => {
                this.onPgnChanged({incrementIdx: target.value, page: 0});
            }).bind(this)
        };
    }

    onPgnChanged(partialPgnOption): void {
        const { sortState, pgnState: currPgnState } = this.state;
        const pgnOption: PgnOption = { ...currPgnState.option, ...partialPgnOption };
        const pgnState: IPgnState = this.createPgnState(pgnOption, sortState.data);
        this.setState({ ...this.state, pgnState });
    }
}

export const DataGrid = memo(_DataGrid);