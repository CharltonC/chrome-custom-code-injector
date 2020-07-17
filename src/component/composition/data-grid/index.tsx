import React, { Component, memo } from "react";

import { ThHandle } from '../../../service/handle/table-header';
import { SortHandle } from '../../../service/handle/sort';
import { RowHandle } from '../../../service/handle/row'
import { PgnHandle } from '../../../service/handle/pagination';

import { SortBtn } from '../../prsntn/sort-btn';
import { Pagination } from '../../prsntn-grp/pagination';

// TODO: clean
import {
    // Props
    IProps,
    IRow, TRowCmpCls, TFn, TRowKeyPipeFn,

    // State
    IState, TShallResetState,

    // Reexport types
    rowHandleType, thHandleType,
    sortBtnType,
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
        const BASE_CLS: string = 'kz-datagrid__table';
        const TB_CLS: string = `${BASE_CLS} ${BASE_CLS}--` + (isNested ? `nest-${tbLvl+1}` : 'root')

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
    readonly rowHandle: RowHandle = new RowHandle();
    rowConfig: rowHandleType.IRawRowConfig[];

    //// Builtin API
    constructor(props: IProps) {
        super(props);

        const defState: IState = this.getDefState();
        const initState: Partial<IState> = this.createState(props);
        this.state = {...defState, ...initState};

        const { rows, rowKey } = this.props;
        this.rowConfig = this.getMappedRowConfig(rows, rowKey ? rowKey : 'id');
    }

    UNSAFE_componentWillReceiveProps(props: IProps): void {
        // const shallReset: TShallResetState = this.shallResetState(props);
        // if (!shallReset) return;
        // const updateState = this.createState(props, shallReset);
        // this.setState({...this.state, ...updateState});
    }

    render() {
        const { data: rawData, expand, paginate } = this.props;
        const { sortedData, sortOption, pgnOption, pgnState } = this.state;
        const { showInitial: visiblePath } = expand;

        const data: any[] = sortedData || rawData;

        const pgnCmpAttr = this.pgnHandle.createGenericCmpAttr({
            data,
            option: this.pgnHandle.createOption(paginate, pgnOption),
            state: pgnState,
            callback: this.onOptionChange.bind(this)
        });

        const rowsElem = this.rowHandle.createState({
            data: data.slice(pgnState.startIdx, pgnState.endIdx),
            rows: this.rowConfig,
            visiblePath
        });

        return <div className="kz-datagrid">
            {pgnState && <Pagination {...pgnState} {...pgnCmpAttr} />}
            <Table
                tbody={rowsElem}
                thRowCtx={this.state.thState}
                sortBtnRender={(sortKey) => <SortBtn {...this.createSortBtnProps(sortOption, sortKey)} />}
                />
        </div>;
    }

    getDefState(): IState {
        return {
            sortOption: null,
            sortState: null,
            sortedData: null,
            pgnOption: null,
            pgnState: null,
            thState: null
        };
    }

    //// Core
    getMappedRowConfig(rows: IRow[], rowKey: string | TRowKeyPipeFn): rowHandleType.IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.createCmpTransformFn(row[transformFnIdx], rowKey);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as rowHandleType.IRawRowConfig;
        });
    }

    createCmpTransformFn(RowCmp: TRowCmpCls, rowKey: string | TRowKeyPipeFn): TFn {
        return (itemCtx: rowHandleType.IItemCtx) => {
            const { item, itemLvl, isExpdByDef, nestedItems } = itemCtx;

            const rowProps = {
                ...itemCtx,
                key: typeof rowKey === 'string' ? item[rowKey] : rowKey(itemCtx),
                nestedTb: nestedItems ? <Table tbody={nestedItems} tbLvl={itemLvl} /> : null
            };

            return nestedItems ?
                <ExpandableWrapper
                    isExpdByDef={isExpdByDef}
                    Cmp={RowCmp}
                    {...rowProps}
                /> :
                <RowCmp {...rowProps} />;
        };
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
/*     shallResetState(props: IProps): TShallResetState {
        // const { data, rows, header, expand, sort, paginate } = props;
        // const { sortState: currSort, pgnState: currPaginate } = this.state;
        // const { data: currData, rows: currRows, header: currHeader, expand: currExpand } = this.props;

        // const isDiffData: boolean = data !== currData;
        // const isDiffRows: boolean = rows !== currRows;
        // const isDiffExpand: boolean = expand !== currExpand;
        // const isDiffSort: boolean = sort !== currSort.option;
        // // const isDiffPgn: boolean = paginate !== currPaginate.option;
        // const isDiffHeader: boolean = header !== currHeader;

        // const thState: boolean = isDiffData || isDiffHeader;
        // const expandState: boolean = isDiffData || isDiffRows || isDiffSort || isDiffPgn || isDiffExpand;
        // const sortState: boolean = isDiffData || isDiffRows || isDiffSort;
        // const pgnState: boolean = isDiffData || isDiffRows || isDiffSort || isDiffPgn;
        // const shallReset: boolean = (thState || expandState || sortState || pgnState);
        // return shallReset ? {thState, sortState, pgnState} : null;
    } */

    createState(props: IProps, shallReset?: TShallResetState): Partial<IState> {
        // TODO: default option for each
        const { data, sort, paginate, header } = props;
        return {
            sortOption: sort ? { ...sort } : null,
            sortedData: sort ? this.sortHandle.sortByObjKey(data, sort.key, sort.isAsc) : null,
            pgnOption: paginate ? this.pgnHandle.createOption(paginate) : null,
            pgnState: paginate ? this.pgnHandle.createState(data, paginate) : null,
            thState: header ? this.thHandle.createState(header) : null
        };
    }

    //// Sorting
    createSortBtnProps({isAsc, key}: any, sortKey: string): sortBtnType.IProps {
        const { sortedData } = this.state;
        const isSameTh: boolean = sortKey === key;

        return {
            isAsc: isSameTh ? isAsc : null,
            onClick: (() => {
                const sortOption = {
                    key: isSameTh ? key : sortKey,
                    isAsc: isSameTh ? !isAsc : true
                };
                this.setState({
                    ...this.state,
                    sortOption,
                    sortedData: this.sortHandle.sortByObjKey(sortedData, sortOption.key, sortOption.isAsc)
                });
            }).bind(this)
        };
    }

    onOptionChange(modState): void {
        this.props.callback?.onPaginateChange(modState);
        this.setState({ ...this.state, ...modState });
    }
}

export const DataGrid = memo(_DataGrid);