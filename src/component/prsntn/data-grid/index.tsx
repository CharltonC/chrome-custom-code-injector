import React, { Component, memo, ReactElement } from "react";

import { ClpsHandle } from '../../../service/handle/collapse';
import { SortHandle } from '../../../service/handle/sort';
import { ThHandle } from '../../../service/handle/table-header';
import { PaginateHelper } from './helper';
import { SortBtn } from '../sort-btn';

import {
    IProps,
    IRow, TCmpCls, TFn, TNestState, IClpsProps,
    ISortOption,
    IState, ISortState, IPgnState, TShallResetState,
    clpsHandleType, thHandleType, sortBtnType
} from './type';


export class _DataGrid extends Component<IProps, IState> {
    readonly clpsHandle = new ClpsHandle();
    readonly sortHandle = new SortHandle();
    readonly thHandle = new ThHandle();
    readonly paginateHelper: PaginateHelper = new PaginateHelper();

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
        const { data: rawData, rows: rawRows, nesting, type } = this.props;
        const { sortState, pgnState } = this.state;
        const { showInitial: visiblePath } = nesting;

        // Rows
        const data: any[] = this.getRowData(rawData, sortState, pgnState);
        const rows: clpsHandleType.IRawRowConfig[] = this.getMappedConfig(rawRows);
        const rowsElem: ReactElement[] = this.clpsHandle.getClpsState({data, rows, visiblePath});
        const gridElem: ReactElement = (type === 'table') ? this.createTbElem(rowsElem) : this.createListElem(rowsElem);

        // Pagination
        let pgnElem: ReactElement = pgnState ? this.createPgnElem() : null;
        return <>
            {pgnElem}
            {gridElem}
        </>;
    }

    //// Core
    getMappedConfig(rows: IRow[]): clpsHandleType.IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as clpsHandleType.IRawRowConfig;
        });
    }

    getCmpTransformFn(Cmp: TCmpCls): TFn {
        return (itemCtx: clpsHandleType.IItemCtx) => {
            const { nestState } = this.state;
            const { nesting } = this.props;
            const { itemPath, nestedItems } = itemCtx;
            const hsClpsProps: boolean = !!nestedItems && !!nesting;
            const clpsProps: IClpsProps = hsClpsProps ? this.getItemClpsProps(itemCtx, nestState) : {};
            return <Cmp key={itemPath} {...itemCtx} {...clpsProps} />;
        };
    }

    getRowData(rawData: any[], sortState: ISortState, pgnState: IPgnState): any[] {
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
        const pgnState = (paginate && shallReset.pgnState) ? {pgnState: this.paginateHelper.createState(data, paginate)} : {}
        const thState = (header && shallReset.thState) ? {thState: this.thHandle.createThCtx(header)}: {};
        return { ...nestState, ...sortState, ...pgnState, ...thState };
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
    createListElem(rows: ReactElement[]): ReactElement {
        return (
            <ul className="kz-datagrid kz-list">
                {rows}
            </ul>
        );
    }

    createTbElem(rows: ReactElement[]): ReactElement {
        const { thState, sortState } = this.state;
        return (
            <table className="kz-datagrid kz-table">{thState &&
                <thead>{thState.map((thCtxs: thHandleType.IThCtx[]) => (
                    <tr>{thCtxs.map(({ title, sortKey, ...thCtx }: thHandleType.IThCtx) => (
                        <th {...thCtx}>
                            <span>
                                {title}
                            </span>{sortState && sortKey &&
                            <SortBtn {...this.createThSortBtnProps(sortKey)} />}
                        </th>))}
                    </tr>))}
                </thead>}
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    createThSortBtnProps(sortKey: string): sortBtnType.IProps {
        const { data } = this.props;
        const { key, isAsc: isCurrAsc } = this.state.sortState.option;

        const isAsc: boolean = key === sortKey ? isCurrAsc : null;
        const onClick = (() => {
            const isSameTh: boolean = sortKey === key;
            const option = {
                key: isSameTh ? key : sortKey,
                isAsc: isSameTh ? !isAsc : true
            };
            this.setState({
                ...this.state,
                sortState: this.createSortState(option, data)
            });
        }).bind(this);

        return { isAsc, onClick };
    }

    createPgnElem(): ReactElement {
        const { sortState, pgnState } = this.state;
        const { option, status } = pgnState;
        const data = sortState ? sortState.data : this.props.data;
        const callback = ( (state) => this.setState({...this.state, pgnState: state}) ).bind(this);
        const pgnProps = this.paginateHelper.createProps(data, option, status, callback);
        return this.paginateHelper.createDefComponent(status, pgnProps);
    }

    //// Collapse Related
    getItemClpsProps(itemCtx: clpsHandleType.IItemCtx, nestState: TNestState): IClpsProps {
        const { itemPath, isDefNestedOpen } = itemCtx;

        // Only Set the state for each Item during Initialization, if not use the existing one
        const isInClpsState: boolean = typeof nestState[itemPath] !== 'undefined';
        if (!isInClpsState) this.setItemInitialClpsState(nestState, itemCtx);

        const isNestedOpen: boolean = isInClpsState ? nestState[itemPath] : isDefNestedOpen;
        const onCollapseChanged = this.getItemOnClpsChangedFn(itemCtx, isNestedOpen);

        return { isNestedOpen, onCollapseChanged };
    }

    setItemInitialClpsState(nestState: TNestState, { itemPath, isDefNestedOpen }: clpsHandleType.IItemCtx): void {
        nestState[itemPath] = isDefNestedOpen;
    }

    getItemOnClpsChangedFn(itemCtx: clpsHandleType.IItemCtx, isNestedOpen: boolean): TFn {
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

    getImpactedItemsClpsState(nestState: TNestState, { itemLvl, itemKey, parentPath }: clpsHandleType.IItemCtx): TNestState {
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
}

export const DataGrid = memo(_DataGrid);