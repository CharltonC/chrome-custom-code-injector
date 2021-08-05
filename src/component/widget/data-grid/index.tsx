import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { HeaderGrpHandle } from '../../../handle/header-group';
import { RowTransformHandle } from '../../../handle/row-transform'
import { RowExpdHandle } from '../../../handle/row-expand'
import { SortHandle } from '../../../handle/sort';
import { PgnHandle } from '../../../handle/pagination';
import { DataGridPagination as DefPagination } from './contextual-pagination';
import { DataGridHeader } from './contextual-header';
import {
    IProps, ARowsOption, ADataOption, ARowOption, ARootRowOption, ANestedRowOption,
    IState, AShallResetState,
    ACmp, AFn, ARowCtx, IRowComponentProps, IPreferredCmp,
    TRowTransformHandle, TRowExpdHandle, TPagination, TSortBtn, TDataGridHeader
} from './type';

export const BASE_CLS = 'datagrid';

/**
 * Data Context:
 * - Rows: `data` in row props                  sorted data (from state if exists) or data source (from props)
 * - Rows `ctxIdx` in row props                 sorted data (from state if exists) or data source (from props)
 * - Pagination, Sort, Expand, Select Handle    sorted data (from state if exists) or data source (from props)
 * - visible rows                               paginated sliced data (from sorted data (from state if exists) or data source (from props))
 */
export class DataGrid extends MemoComponent<IProps, IState> {
    //// Dependency Injection
    readonly headerGrpHandle = new HeaderGrpHandle();
    readonly pgnHandle = new PgnHandle();
    readonly sortHandle = new SortHandle();
    readonly rowTransformHandle = new RowTransformHandle();
    readonly rowExpdHandle = new RowExpdHandle();

    //// Builtin API
    static defaultProps = { type: 'table' };

    constructor(props: IProps) {
        super(props);
        this.state = this.createState(props);
    }

    UNSAFE_componentWillReceiveProps(modProps: IProps): void {
        const shallReset: AShallResetState = this.shallResetState(modProps, this.props);
        const modState: Partial<IState> = this.createState(modProps, shallReset);
        this.setState({ ...this.state, ...modState });
    }

    render(): ReactElement {
        const { cssCls, props, state } = this;
        const { isTb, headerCtx, pgnState } = state;
        const { type, component } = props;
        const { commonProps: defCommonProps, rows, ...defCmp } = component;
        const commonProps = { ...defCommonProps, props, state };

        const ROOT_CLS = cssCls(`${BASE_CLS}`, type);
        const sortedData: ADataOption = this.getSortedData();
        const headerProps = { commonProps, ...this.getHeaderProps(sortedData) };
        const paginationProps = { commonProps, ...this.getPgnCmpProps(sortedData) };
        const { Header, Pagination } = this.getPreferredCmp(defCmp);
        const $head: ReactElement = headerCtx ? <Header {...headerProps} /> : null;
        const $rows: ReactElement[] = this.getRowElems(sortedData);
        const $gridBody: ReactElement = this.getGridBodyElem(isTb, $head, $rows);

        return (
            <div className={ROOT_CLS}>
                { pgnState && <Pagination {...paginationProps} />}
                { isTb ? <table>{$gridBody}</table> : $gridBody }
            </div>
        );
    }

    //// State
    createState(props: IProps, shallResetState?: AShallResetState): IState {
        const { type, component, data, sort, paginate, expand, header } = props;
        const { rows } = component;
        const { headerGrpHandle, rowExpdHandle, sortHandle, pgnHandle } = this;
        const sortOption = sort ? sortHandle.createOption(sort) : null;
        const pgnOption = paginate ? pgnHandle.getOption(paginate) : null;
        const isTb = type !== 'list' ? true : false;
        const headerCtx = header ?
            (isTb ?
                headerGrpHandle.getCtxTbHeaders(header) :
                headerGrpHandle.getCtxListHeaders(header)
            ): null;

        // Note: data used to create paginate state doesnt have to be sorted, it can be generic
        const state: IState = {
            isTb,
            headerCtx,
            rowsOption: rows ? this.transformRowOption(rows) : null,
            sortOption,
            sortState: sort ? sortHandle.createState(data, sortOption) : null,
            pgnOption,
            pgnState: paginate ? pgnHandle.getState(data.length, pgnOption) : null,
            expdState: rows?.length > 1 && expand ? rowExpdHandle.createState() : null
        };

        // If Reset is need, we filter out the state properties to get partial state to be merged later
        return !shallResetState ?
            state :
            Object
                .entries(shallResetState)
                .reduce((modState: IState, [ key, shallReset ]: [ string, boolean ]) => {
                    if (shallReset) {
                        modState[key] = state[key]
                    }
                    return modState;
                }, {} as IState);
    }

    /*
     * State impacted by Props changes
     * - `R` flag means the prop is used at Render Time as a source of Truth so we dont need to recreate the internal states
     * - The table can be used to determine what internal states needs to be recreated/updated when props changes and hence optimizing calls
     * - Reference Table:
     *
     * | Props Changes                     | States that need to be reset                                                                       |
     * |                                   |-----------|-----------|------------|------------|-----------|-----------|----------|---------------|
     * |                                   |   isTb    | headerCtx | rowsOption | sortOption | sortState | pgnOption | pgnState |  expdState    |
     * |-----------------------------------|-----------|-----------|------------|------------|-----------|-----------|----------|---------------|
     * | data                              |     x     |     x     |      x     |      x     |     ✓     |     x     |     ✓    |       ✓       |
     * | type                              |     ✓     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     * | header                            |     x     |     ✓     |      x     |      x     |     ✓     |     x     |     x    |       x       |
     * | component - rows                  |     x     |     x     |      ✓     |      x     |     x     |     x     |     x    |       ✓       |
     * | expand                            |     x     |     x     |      ✓     |      x     |     x     |     x     |     x    |       ✓       |
     * | sort                              |     x     |     x     |      x     |      ✓     |     ✓     |     x     |     x    |       x       |
     * | paginate                          |     x     |     x     |      x     |      x     |     x     |     ✓     |     ✓    |       x       |
     * | rowKey (R)                        |     x     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     * | component - header (R)            |     x     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     * | component - pagination (R)        |     x     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     * | callback - onExpandChange (R)     |     x     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     * | callback - onSortChange (R)       |     x     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     * | callback - onPaginationChange (R) |     x     |     x     |      x     |      x     |     x     |     x     |     x    |       x       |
     */
    shallResetState(modProps: IProps, props: IProps): AShallResetState {
        const { data, type, header, component, sort, paginate, expand } = modProps;
        const isDiffData = data !== props.data;
        const isDiffGridType = type !== props.type;
        const isDiffHeader = header !== props.header;
        const isDiffRows = component.rows !== props.component.rows;
        const isDiffSort = sort !== props.sort;
        const isDiffPgn = paginate !== props.paginate;
        const isDiffExpd = expand !== props.expand;

        return {
            isTb: isDiffGridType,
            sortOption: isDiffSort,
            sortState: isDiffSort || isDiffData || isDiffHeader,
            pgnOption: isDiffPgn,
            pgnState: isDiffPgn || isDiffData,
            headerCtx: isDiffHeader,
            rowsOption: isDiffRows || isDiffExpd,
            expdState: isDiffExpd || isDiffRows || isDiffData,
        };
    }

    //// Altering Rows Option (so that it renders the corresponding Row Template Component)
    // Transform the Component Row Option (from Props) to align its input with Row Handle Service
    // - component state is not yet ready until `transformFn` is executed
    transformRowOption(rows: ARowsOption): TRowTransformHandle.IRawRowsOption[] {
        return rows.map((row: ARowOption, idx: number) => {
            const isRootRowConfig = idx === 0;
            const RowCmp: ACmp = isRootRowConfig ? (row as ARootRowOption)[0] : (row as ANestedRowOption)[1];
            const transformFn: AFn = this.getRowTransformFn(RowCmp);
            return (isRootRowConfig ? [transformFn] : [row[0], transformFn]) as TRowTransformHandle.IRawRowsOption;
        });
    }

    getRowTransformFn(RowCmp: ACmp): AFn {
        return (itemCtx: ARowCtx) => <RowCmp {...this.getRowCmpProps(itemCtx)} />;
    }

    getRowCmpProps(itemCtx: ARowCtx): IRowComponentProps {
        const { cssCls, props, state } = this;
        const { commonProps } = props.component;
        const { isTb, headerCtx } = state;
        const { itemId, itemLvl, nestedItems, rowType } = itemCtx;
        return {
            ...itemCtx,
            key: itemId,
            // non-sliced full set data
            // - reason this is deliberately passed is to event handler of each row (e.g. select, delete) have access to the internally processed data
            dataSrc: this.getSortedData(),
            commonProps,
            expandProps: nestedItems ? this.getRowCmpExpdProps(itemCtx) : null,
            rowColStyle: isTb  ? null : { '--cols': headerCtx.colTotal },
            classNames:  {
                REG_ROW: cssCls(`${BASE_CLS}__row`, rowType),
                NESTED_ROW: nestedItems ? cssCls(`${BASE_CLS}__row`, 'nested') : '',
                NESTED_GRID: nestedItems ? cssCls(`${BASE_CLS}__body`, `nested-${itemLvl+1}`) : '',
            },
        };
    }

    getRowElems(sortedData: ADataOption): ReactElement[] {
        const { rowKey: rowIdKey, expand } = this.props;
        const { pgnState, rowsOption: rows } = this.state;
        const { startIdx, endIdx } = pgnState ?? {};
        const { showAll } = expand ?? {};
        const data: ADataOption = pgnState ? sortedData.slice(startIdx, endIdx) : sortedData;
        return this.rowTransformHandle.createCtxRows<ReactElement>({ data, rows, rowIdKey, showAll, pgnStartIdx: startIdx });
    }

    //// Get/Wrap Conditional Components
    getGridBodyElem(isTb: boolean, headElem: ReactElement, rowsElem: ReactElement[]): ReactElement {
        const { cssCls } = this;
        const ROOT_CLS = cssCls(`${BASE_CLS}__body`, 'root');
        const Body = isTb ? 'tbody' : 'ul';
        return (<>
            {headElem}
            <Body className={ROOT_CLS}>{rowsElem}</Body>
        </>);
    }

    getPreferredCmp({ Pagination, Header } : IPreferredCmp): IPreferredCmp {
        return {
            Header: Header ?? DataGridHeader,
            Pagination: Pagination ?? DefPagination
        };
    }

    //// Sort, Expand, Pagination
    getSortedData(): ADataOption {
        return this.state.sortState?.data || this.props.data;
    }

    getHeaderProps(sortedData: ADataOption): TDataGridHeader.IProps {
        const { type } = this.props;
        const { headerCtx } = this.state;
        return {
            type,
            // non-sliced full set data
            // - reason this is deliberately passed is to event handler of each row (e.g. select, delete) have access to the internally processed data
            data: sortedData,
            rows: headerCtx,
            sortBtnProps: (sortKey: string) => this.getSortCmpProps(sortedData, sortKey)
        };
    }

    getSortCmpProps(sortedData: ADataOption, sortKey: string): TSortBtn.IProps {
        const { sortOption } = this.state;
        if (!sortOption) return null;

        const { onSortChange } = this.props.callback ?? {};
        const { sortBtnAttr } = this.sortHandle.createGenericCmpAttr({
            data: sortedData,
            option: sortOption,
            callback: this.getOnStateChangeHandler(onSortChange)
        }, sortKey);

        return sortBtnAttr;
    }

    getRowCmpExpdProps(itemCtx: ARowCtx) {
        const { expdState } = this.state;
        const { expand, callback } = this.props;
        const { onExpandChange } = callback ?? {};
        return this.rowExpdHandle.getExpdBtnAttr({
            itemCtx: itemCtx as TRowExpdHandle.TItemCtx,
            expdState,
            option: expand,
            callback: this.getOnStateChangeHandler(onExpandChange),
        });
    }

    getPgnCmpProps(sortedData: ADataOption): TPagination.IProps {
        const { pgnOption, pgnState } = this.state;
        if (!pgnOption) return null;

        const { onPaginateChange } = this.props.callback ?? {};
        return {
            ...pgnState,
            ...this.pgnHandle.createGenericCmpAttr({
                totalRecord: sortedData.length,
                callback: this.getOnStateChangeHandler(onPaginateChange),
                option: pgnOption,
                state: pgnState
            })
        };
    }

    getOnStateChangeHandler(userCallback: AFn): AFn {
        return (modState: Partial<IState>): void => {
            this.setState({ ...this.state, ...modState });
            userCallback?.(modState);
        };
    }
}