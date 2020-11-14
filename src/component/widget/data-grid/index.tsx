import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { HeaderGrpHandle } from '../../../service/handle/header-group';
import { RowHandle } from '../../../service/handle/row'
import { RowExpdHandle } from '../../../service/handle/row-expand'
import { SortHandle } from '../../../service/handle/sort';
import { PgnHandle } from '../../../service/handle/pagination';
import { Pagination as DefPagination } from '../../group/pagination';
import { GridHeader } from '../../group/grid-header';
import {
    IProps, TRowsOption, TDataOption, TRowOption, TRootRowOption, TNestedRowOption,
    IState, TShallResetState,
    TCmp, TFn, TRowCtx, IRowComponentProps, IPreferredCmp,
    rowHandleType, rowExpdHandleType, paginationType, sortBtnType, GridHeaderType
} from './type';

/**
 * Data Context:
 * - Rows: `data` in row props                  sorted data (from state if exists) or data source (from props)
 * - Pagination, Sort, Expand, Select Handle    sorted data (from state if exists) or data source (from props)
 * - visible rows                               paginated sliced data (from sorted data (from state if exists) or data source (from props))
 */
export class DataGrid extends MemoComponent<IProps, IState> {
    //// Dependency Injection
    readonly headerGrpHandle: HeaderGrpHandle = new HeaderGrpHandle();
    readonly pgnHandle: PgnHandle = new PgnHandle();
    readonly sortHandle: SortHandle = new SortHandle();
    readonly rowHandle: RowHandle = new RowHandle();
    readonly rowExpdHandle: RowExpdHandle = new RowExpdHandle();
    readonly BASE_CLS: string = 'datagrid';

    //// Builtin API
    static defaultProps = { type: 'table' };

    constructor(props: IProps) {
        super(props);
        this.state = this.createState(props);
    }

    UNSAFE_componentWillReceiveProps(modProps: IProps): void {
        const shallReset: TShallResetState = this.shallResetState(modProps, this.props);
        const modState: Partial<IState> = this.createState(modProps, shallReset);
        this.setState({ ...this.state, ...modState });
    }

    render(): ReactElement {
        const { BASE_CLS, cssCls, props, state } = this;
        const { isTb, headerCtx, pgnState } = state;
        const { type, component } = props;
        const { commonProps, rows, ...defCmp } = component;

        const WRAPPER_CLS: string = cssCls(`${BASE_CLS}`, type);
        const sortedData: TDataOption = this.getSortedData();
        const headerProps = { commonProps, ...this.getHeaderProps(sortedData) };
        const paginationProps = { commonProps, ...this.getPgnCmpProps(sortedData) };
        const { Header, Pagination } = this.getPreferredCmp(defCmp);
        const headElem: ReactElement = headerCtx ? <Header {...headerProps} /> : null;
        const rowElems: ReactElement[] = this.getRowElems(sortedData);
        const bodyElem: ReactElement = this.getGridBodyElem(isTb, headElem, rowElems);

        return (
            <div className={WRAPPER_CLS}>
                { pgnState && <Pagination {...paginationProps} />}
                { isTb ? <table>{bodyElem}</table> : bodyElem }
            </div>
        );
    }

    //// State
    createState(props: IProps, shallResetState?: TShallResetState): IState {
        const { type, component, data, sort, paginate, expand, header } = props;
        const { rows } = component;
        const { headerGrpHandle, rowExpdHandle, sortHandle, pgnHandle } = this;
        const sortOption = sort ? sortHandle.createOption(sort) : null;
        const pgnOption = paginate ? pgnHandle.createOption(paginate) : null;
        const isTb: boolean = type !== 'list' ? true : false;
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
            pgnState: paginate ? pgnHandle.createState(data, pgnOption) : null,
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
    shallResetState(modProps: IProps, props: IProps): TShallResetState {
        const { data, type, header, component, sort, paginate, expand } = modProps;
        const isDiffData: boolean = data !== props.data;
        const isDiffGridType: boolean = type !== props.type;
        const isDiffHeader: boolean = header !== props.header;
        const isDiffRows: boolean = component.rows !== props.component.rows;
        const isDiffSort: boolean = sort !== props.sort;
        const isDiffPgn: boolean = paginate !== props.paginate;
        const isDiffExpd: boolean = expand !== props.expand;

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
    transformRowOption(rows: TRowsOption): rowHandleType.IRawRowsOption[] {
        return rows.map((row: TRowOption, idx: number) => {
            const isRootRowConfig: boolean = idx === 0;
            const RowCmp: TCmp = isRootRowConfig ? (row as TRootRowOption)[0] : (row as TNestedRowOption)[1];
            const transformFn: TFn = this.getRowTransformFn(RowCmp);
            return (isRootRowConfig ? [transformFn] : [row[0], transformFn]) as rowHandleType.IRawRowsOption;
        });
    }

    getRowTransformFn(RowCmp: TCmp): TFn {
        return (itemCtx: TRowCtx) => <RowCmp {...this.getRowCmpProps(itemCtx)} />;
    }

    getRowCmpProps(itemCtx: TRowCtx): IRowComponentProps {
        const { cssCls, BASE_CLS, props, state } = this;
        const { commonProps } = props.component;
        const { isTb, headerCtx } = state;
        const { itemId, itemLvl, nestedItems, rowType } = itemCtx;
        return {
            ...itemCtx,
            key: itemId,
            // non-sliced full set data
            // - reason this is deliberately passed is to event handler of each row (e.g. select, delete) have access to the internally processed data
            data: this.getSortedData(),
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

    getRowElems(sortedData: TDataOption): ReactElement[] {
        const { rowKey: rowIdKey, expand } = this.props;
        const { pgnState, rowsOption: rows } = this.state;
        const { startIdx, endIdx } = pgnState ?? {};
        const { showAll } = expand ?? {};
        const data: TDataOption = pgnState ? sortedData.slice(startIdx, endIdx) : sortedData;
        return this.rowHandle.createCtxRows<ReactElement>({ data, rows, rowIdKey, showAll, pgnStartIdx: startIdx });
    }

    //// Get/Wrap Conditional Components
    getGridBodyElem(isTb: boolean, headElem: ReactElement, rowsElem: ReactElement[]): ReactElement {
        const { BASE_CLS, cssCls } = this;
        const ROOT_CLS: string = cssCls(`${BASE_CLS}__body`, 'root');
        const Body = isTb ? 'tbody' : 'ul';
        return (<>
            {headElem}
            <Body className={ROOT_CLS}>{rowsElem}</Body>
        </>);
    }

    getPreferredCmp({ Pagination, Header } : IPreferredCmp): IPreferredCmp {
        return {
            Header: Header ?? GridHeader,
            Pagination: Pagination ?? DefPagination
        };
    }

    //// Sort, Expand, Pagination
    getSortedData(): TDataOption {
        return this.state.sortState?.data || this.props.data;
    }

    getHeaderProps(sortedData: TDataOption): GridHeaderType.IProps {
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

    getSortCmpProps(sortedData: TDataOption, sortKey: string): sortBtnType.IProps {
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

    getRowCmpExpdProps(itemCtx: TRowCtx) {
        const { expdState } = this.state;
        const { expand, callback } = this.props;
        const { onExpandChange } = callback ?? {};
        return this.rowExpdHandle.getExpdBtnAttr({
            itemCtx: itemCtx as rowExpdHandleType.TItemCtx,
            expdState,
            option: expand,
            callback: this.getOnStateChangeHandler(onExpandChange),
        });
    }

    getPgnCmpProps(sortedData: TDataOption): paginationType.IProps {
        const { pgnOption, pgnState } = this.state;
        if (!pgnOption) return null;

        const { onPaginateChange } = this.props.callback ?? {};
        return {
            ...pgnState,
            ...this.pgnHandle.createGenericCmpAttr({
                data: sortedData,
                callback: this.getOnStateChangeHandler(onPaginateChange),
                option: pgnOption,
                state: pgnState
            })
        };
    }

    getOnStateChangeHandler(userCallback: TFn): TFn {
        return (modState: Partial<IState>): void => {
            this.setState({ ...this.state, ...modState });
            userCallback?.(modState);
        };
    }
}