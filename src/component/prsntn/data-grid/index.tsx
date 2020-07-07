import React, { Component, memo, ReactElement } from "react";

import { ThHandle } from '../../../service/handle/table-header';
import { PaginateHelper, ExpandHelper, SortHelper } from './helper';
import { SortBtn } from '../sort-btn';
import { Pagination } from '../pagination';

// TODO: clean
import {
    IProps,
    IRow, TCmpCls, TFn, IClpsProps,
    IState, ISortState, IPgnState, TShallResetState,
    IPgnProps,
    clpsHandleType, thHandleType,
} from './type';


class NestableRowWrapper extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isExpd: props.isInitialExpd
        };
    }

    onExpdChanged() {
        const isExpd: boolean = !this.state.isExpd;
        this.setState({isExpd});
    }

    render() {
        const { RowCmp, isInitialExpd, ...rowProps } = this.props;
        const { isExpd } = this.state;
        const props = { ...rowProps, isExpd, onExpdChanged: this.onExpdChanged.bind(this) };
        return <RowCmp {...props} />;
    }
}


export class _DataGrid extends Component<IProps, IState> {
    readonly thHandle = new ThHandle();
    readonly paginateHelper: PaginateHelper = new PaginateHelper();
    readonly expandHelper: ExpandHelper = new ExpandHelper();
    readonly sortHelper: SortHelper = new SortHelper();
    rowConfig: clpsHandleType.IRawRowConfig[];

    //// Builtin API
    constructor(props: IProps) {
        super(props);
        const defState: IState = { nestState: null, sortState: null, pgnState: null, thState: null };
        const initState: Partial<IState> = this.createState(props);
        this.state = {...defState, ...initState};

        const { rows } = this.props;
        this.rowConfig = this.getMappedConfig(rows);
    }

    UNSAFE_componentWillReceiveProps(props: IProps): void {
        const shallReset: TShallResetState = this.shallResetState(props);
        if (!shallReset) return;
        const updateState = this.createState(props, shallReset);
        this.setState({...this.state, ...updateState});
    }

    render() {
        // const { data: rawData, rows: rawRows, nesting, type } = this.props;
        // const { sortState, pgnState } = this.state;
        // const { showInitial: visiblePath } = nesting;

        // Rows
        // const data: any[] = this.getRowData(rawData, sortState, pgnState);
        // const rows: clpsHandleType.IRawRowConfig[] = this.getMappedConfig(rawRows);
        // const rowsElem: ReactElement[] = this.expandHelper.getClpsState({data, rows, visiblePath});
        // const gridElem: ReactElement = (type === 'table') ? this.createTbElem(rowsElem) : this.createListElem(rowsElem);
        const { data: rawData, nesting } = this.props;
        const { sortState, pgnState } = this.state;
        const { showInitial: visiblePath } = nesting;
        const data: any[] = this.getRowData(rawData, sortState, pgnState);
        const rowsElem = this.expandHelper.getClpsState({data, rows: this.rowConfig, visiblePath});
        const gridElem: ReactElement = this.createTbElem(rowsElem);

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
            const transformFn = this.createCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as clpsHandleType.IRawRowConfig;
        });
    }

    createCmpTransformFn(Cmp: TCmpCls): TFn {
        const { nestState } = this.state;
        const { nesting } = this.props;
        const { showOnePerLvl } = nesting;      // TODO: def. value

        // TODO: if no nesting
        const callback = nesting ? ( (state) => this.setState({...this.state, nestState: state}) ).bind(this) : null;
        const commoRowCtx = nesting ? {nestState, showOnePerLvl, callback} : null;

        return (itemCtx: clpsHandleType.IItemCtx) => {
            const { item, idx, itemLvl, nestedItems: rawNestedItems } = itemCtx;

            // TODO: Move to getRowProps?
            const hsClpsProps: boolean = !!nesting && !!rawNestedItems;
            const clpsProps: IClpsProps = hsClpsProps ? this.expandHelper.createRowProps(commoRowCtx, itemCtx) : {};

            // TODO: if itemCtx has `nestedItems`, then wrap it with either `ul` OR `tr/td/table/tbody`
            const nestedTb: ReactElement = hsClpsProps ? this.createTbElem(rawNestedItems, itemLvl) : null;

            // Beware: Expand state persistency has nothing to do with list clone
            const rowProps = {
                ...itemCtx,
                nestedTb,
                clpsProps
            };
            return nestedTb ?
                <NestableRowWrapper
                    key={`${item.id}-${item.name}`}
                    isInitialExpd={itemCtx.isDefNestedOpen}
                    RowCmp={Cmp}
                    {...rowProps}
                /> :
                <Cmp
                    key={`${item.id}-${item.name}`}
                    {...rowProps}
                    />;
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
        // TODO: default option for each
        const { data, rows, sort, paginate, header } = props;
        shallReset = shallReset ? shallReset : {thState: true, nestState: true, sortState: true, pgnState: true};

        const nestState = (rows.length > 1 && shallReset.nestState) ? {nestState: {}} : {};
        const sortState = (sort && shallReset.sortState) ? {sortState : this.sortHelper.createState(data.slice(0), sort)}: {};
        const pgnState = (paginate && shallReset.pgnState) ? {pgnState: this.paginateHelper.createState(data, paginate)} : {}
        const thState = (header && shallReset.thState) ? {thState: this.thHandle.createThCtx(header)}: {};
        return { ...nestState, ...sortState, ...pgnState, ...thState };
    }

    //// Default Component Template
    createTbElem(rows: ReactElement[], tbLvl?: number): ReactElement {
        const isNested: boolean = Number.isInteger(tbLvl);
        const thElem: ReactElement = (!isNested && this.state.thState) ? this.createTbHeaderElem() : null;
        const TB_CLS: string = 'kz-datagrid';
        const tbProps = {
            className: `${TB_CLS} ${TB_CLS}--table ${TB_CLS}--` + (isNested ? `nest-${tbLvl+1}` : 'root')
        };
        return (
            <table {...tbProps}>
                {thElem}
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    // TODO: Move to `thHelper`?
    createTbHeaderElem(): ReactElement {
        const { state } = this;
        const { thState, sortState: currSortState } = state;

        // TODO: Check if sort option exist in rows
        const commonCtx = {
            data: currSortState.data,
            option: currSortState.option,
            callback: ((sortState: ISortState) => {
                this.setState({...state, sortState: {
                    ...currSortState,
                    option: sortState.option
                }});
            }).bind(this)
        };

        return (
            <thead>{thState.map((thCtxs: thHandleType.IThCtx[]) => (
                <tr>{thCtxs.map(({ title, sortKey, ...thProps }: thHandleType.IThCtx) => (
                    <th {...thProps}>
                        <span>{title}</span>{sortKey &&
                        <SortBtn {...this.sortHelper.createBtnProps(commonCtx, sortKey)} />}
                    </th>))}
                </tr>))}
            </thead>
        );
    }

    createPgnElem(): ReactElement {
        const {
            option: optionProps,
            status: currStatus
        } = this.state.pgnState;

        const {
            totalPage, perPage, curr, pageNo, startIdx, endIdx,
            ...statusProps
        } = currStatus;

        let pageList: number[] = [];
        let pageSelectIdx: number = 0;
        for (let p: number = 1; p <= totalPage; p++) {
            const pageIdx = p - 1;
            pageList.push(pageIdx);
            pageSelectIdx = p === pageNo ? pageIdx : pageSelectIdx;
        }
        const pageSelectProps = {pageList, pageSelectIdx};

        return <Pagination
            {...statusProps}
            {...optionProps}
            {...pageSelectProps}
            onPgnChanged={((modPgnOption) => {
                const option = {...optionProps, ...modPgnOption};
                const status = this.paginateHelper.getPgnStatus(this.state.sortState.data, option);
                const pgnState = { option, status };
                this.setState({...this.state, pgnState});
            }).bind(this)}
        />;
    }
}

export const DataGrid = memo(_DataGrid);