import React, { Component, memo } from "react";

import { ThHandle } from '../../../service/handle/table-header';
import { SortHandle } from '../../../service/handle/sort';
import { ClpsHandle } from '../../../service/handle/collapse';
import { PgnHandle, PgnOption } from '../../../service/handle/paginate';

import { SortBtn } from '../../prsntn/sort-btn';
import { Pagination } from '../../prsntn/pagination';

// TODO: clean
import {
    // Props
    IProps, ISortOption,
    IRow, TCmpCls, TFn,

    // State
    IState, ISortState, IPgnState, TShallResetState,

    // Reexport types
    pgnHandleType, clpsHandleType, thHandleType,
    paginationType, sortBtnType,
} from './type';

// TODO: Move, typing
class ExpandableWrapper extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isExpd: props.isExpdByDef
        };
    }

    onExpdChange() {
        const isExpd: boolean = !this.state.isExpd;
        this.setState({isExpd});
    }

    render() {
        const { Cmp, isExpdByDef, ...spareProps } = this.props;
        const { isExpd } = this.state;
        const cmpProps = {
            ...spareProps,
            isExpd,
            onExpdChange: this.onExpdChange.bind(this)
        };
        return <Cmp {...cmpProps} />;
    }
}

// TODO: Table
class Table extends Component<any> {
    render() {
        const { tbLvl, thRowCtx, tbody, sortBtnRender } = this.props;
        const isNested: boolean = Number.isInteger(tbLvl);

        // Table Header Sort Button
        const hsTbHeader: boolean = !isNested && !!thRowCtx;

        // Table Class
        const BASE_CLS: string = 'kz-datagrid';
        const TB_CLS: string = `${BASE_CLS} ${BASE_CLS}--table ${BASE_CLS}--` + (isNested ? `nest-${tbLvl+1}` : 'root')

        return (
            <table className={TB_CLS}>{ hsTbHeader &&
                <thead>{ thRowCtx.map((thCtxs: thHandleType.IThCtx[], trIdx: number) => (
                    <tr key={trIdx}>{ thCtxs.map(({ title, sortKey, ...thProps }: thHandleType.IThCtx, thIdx: number) => (
                        <th key={thIdx} {...thProps}>
                            <span>{title}</span>
                            {sortKey && sortBtnRender(sortKey)}
                        </th>))}
                    </tr>))}
                </thead>}
                <tbody>
                    {tbody}
                </tbody>
            </table>
        );
    }
}

export class _DataGrid extends Component<IProps, IState> {
    readonly thHandle = new ThHandle();
    readonly pgnHandle: PgnHandle = new PgnHandle();
    readonly sortHandle: SortHandle = new SortHandle();
    readonly clpsHandle: ClpsHandle = new ClpsHandle();
    rowConfig: clpsHandleType.IRawRowConfig[];

    //// Builtin API
    constructor(props: IProps) {
        super(props);
        const defState: IState = { expandState: null, sortState: null, pgnState: null, thState: null };
        const initState: Partial<IState> = this.createState(props);
        this.state = {...defState, ...initState};

        const { rows } = this.props;
        this.rowConfig = this.getMappedRowConfig(rows);
    }

    UNSAFE_componentWillReceiveProps(props: IProps): void {
        const shallReset: TShallResetState = this.shallResetState(props);
        if (!shallReset) return;
        const updateState = this.createState(props, shallReset);
        this.setState({...this.state, ...updateState});
    }

    render() {
        const { data: rawData, expand } = this.props;
        const { sortState, pgnState } = this.state;
        const { showInitial: visiblePath } = expand;

        const data: any[] = this.getRowData(rawData, sortState, pgnState);
        const rowsElem = this.clpsHandle.getClpsState({
            data,
            rows: this.rowConfig,
            visiblePath
        });

        return <>
            {pgnState && <Pagination {...this.createPgnProps()} />}
            <Table
                tbody={rowsElem}
                thRowCtx={this.state.thState}
                sortBtnRender={(sortKey) => <SortBtn {...this.createSortBtnProps(sortState.option, sortKey)} />}
                />
        </>;
    }

    //// Core
    getMappedRowConfig(rows: IRow[]): clpsHandleType.IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.createCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as clpsHandleType.IRawRowConfig;
        });
    }

    createCmpTransformFn(Cmp: TCmpCls): TFn {
        return (itemCtx: clpsHandleType.IItemCtx) => {
            const { item, itemLvl, isExpdByDef, nestedItems } = itemCtx;

            const rowProps = {
                ...itemCtx,
                key: `${item.id}-${item.name}`,
                nestedTb: nestedItems ? <Table tbody={nestedItems} tbLvl={itemLvl} /> : null
            };

            return nestedItems ?
                <ExpandableWrapper
                    isExpdByDef={isExpdByDef}
                    Cmp={Cmp}
                    {...rowProps}
                /> :
                <Cmp {...rowProps} />;
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

    //// Deal with Props & State in General
    /**
     * Determine what slice of state should be reset for avoiding unneeded calls of creating particular state slice
     *
     * PROPS        SELECTIVE STATE THAT REQUIRES TO BE CHANGED IF DIFF. PROPS
     * ---------------------------------------------------------------------
     * data         thState:        yes - modified sort header/asc may be diff. to initial one
     *              sortState:      yes - diff. set or data to sort
     *              pgnState:       yes - diff. set or data to paginate
     *              expandState       yes - since visible data is diff.
     *
     * rows         thState:        no - its dep. on data but indep to the curr. sort state
     *              sortState:      yes - diff. set or data to sort
     *              pgnState:       yes - diff. set or data to paginate
     *              expandState       yes - as the key will be different
     *
     * sort         thState         no - its dep. on data but indep to the curr. sort state
     *              sortState       yes - itself
     *              pgnState        yes - diff. set or data to paginate
     *              expandState       yes - since visible data is diff.
     *
     * expand      thState         no - its dep. on data but indep to the curr. sort state
     *              sortState       no
     *              pgnState        no
     *              expandState       yes - itself
     *
     * paginate     thState         no - its dep. on data but indep to the curr. sort state
     *              sortState       no
     *              pgnState        yes - itself
     *              expandState       yes - since visible data is diff.
     *
     * header       thState         yes - itself
     *              sortState       no - thState is indep to the curr. sort state
     *              pgnState        no
     *              expandState       no
     *
     * type         thState         no
     *              sortState       no
     *              pgnState        no
     *              expandState       no
     */
    shallResetState(props: IProps): TShallResetState {
        const { data, rows, header, expand, sort, paginate } = props;
        const { sortState: currSort, pgnState: currPaginate } = this.state;
        const { data: currData, rows: currRows, header: currHeader, expand: currExpand } = this.props;

        const isDiffData: boolean = data !== currData;
        const isDiffRows: boolean = rows !== currRows;
        const isDiffExpand: boolean = expand !== currExpand;
        const isDiffSort: boolean = sort !== currSort.option;
        const isDiffPgn: boolean = paginate !== currPaginate.option;
        const isDiffHeader: boolean = header !== currHeader;

        const thState: boolean = isDiffData || isDiffHeader;
        const expandState: boolean = isDiffData || isDiffRows || isDiffSort || isDiffPgn || isDiffExpand;
        const sortState: boolean = isDiffData || isDiffRows || isDiffSort;
        const pgnState: boolean = isDiffData || isDiffRows || isDiffSort || isDiffPgn;
        const shallReset: boolean = (thState || expandState || sortState || pgnState);
        return shallReset ? {thState, expandState, sortState, pgnState} : null;
    }

    createState(props: IProps, shallReset?: TShallResetState): Partial<IState> {
        // TODO: default option for each
        const { data, rows, sort, paginate, header } = props;
        shallReset = shallReset ? shallReset : {thState: true, expandState: true, sortState: true, pgnState: true};

        const expandState = (rows.length > 1 && shallReset.expandState) ? {expandState: {}} : {};
        const sortState = (sort && shallReset.sortState) ? {sortState : this.createSortState(data.slice(0), sort)}: {};
        const pgnState = (paginate && shallReset.pgnState) ? {pgnState: this.createPgnState(data, paginate)} : {}
        const thState = (header && shallReset.thState) ? {thState: this.thHandle.createThCtx(header)}: {};
        return { ...expandState, ...sortState, ...pgnState, ...thState };
    }

    //// Sorting
    createSortState(data: any[], sortOption: ISortOption): ISortState {
        const { key, isAsc } = sortOption;
        return {
            option: { ...sortOption },
            data: this.sortHandle.sortByObjKey(data, key, isAsc)
        };
    }

    createSortBtnProps({isAsc, key}: any, sortKey: string): sortBtnType.IProps {
        const { data } = this.state.sortState;
        const isSameTh: boolean = sortKey === key;

        return {
            isAsc: isSameTh ? isAsc : null,
            onClick: (() => {
                const option = {
                    key: isSameTh ? key : sortKey,
                    isAsc: isSameTh ? !isAsc : true
                };
                const sortState = this.createSortState(data, option);
                this.setState({...this.state, sortState});
            }).bind(this)
        };
    }

    //// Pagination
    createPgnState(data: any[], modOption: PgnOption): IPgnState {
        const { pgnHandle } = this;

        // Only display valid increments for <option> value
        const { increment } = modOption;
        modOption.increment = increment ? pgnHandle.parseNoPerPage(increment) : increment;

        const option = Object.assign(pgnHandle.getDefOption(), modOption) as Required<PgnOption>;
        const status: pgnHandleType.IPgnStatus = pgnHandle.getPgnStatus(data, option);
        return { option, status };
    }

    createPgnProps(): paginationType.IProps {
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

        return {
            ...statusProps,
            ...optionProps,
            ...pageSelectProps,
            onPgnChanged: ((modOption: Required<PgnOption>) => {
                const { data } = this.state.sortState;
                const { option: currOption } = this.state.pgnState;
                const option = {...currOption, ...modOption} as Required<PgnOption>;
                const status: pgnHandleType.IPgnStatus = this.pgnHandle.getPgnStatus(data, option);
                const pgnState: IPgnState = { option, status };
                this.setState({...this.state, pgnState});
            }).bind(this)
        };
    }
}

export const DataGrid = memo(_DataGrid);