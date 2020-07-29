import React, { ReactElement } from "react";
import { MemoComponent } from '../../../asset/ts/memo-component';
import { UtilHandle } from '../../../service/handle/util';
import { ThHandle } from '../../../service/handle/header-group';
import { RowHandle } from '../../../service/handle/row'
import { ExpdHandle } from '../../../service/handle/expand'
import { SortHandle } from '../../../service/handle/sort';
import { PgnHandle } from '../../../service/handle/pagination';
import { Pagination as DefPagination } from '../../prsntn-grp/pagination';
import { TableHeader as DefTableHeader } from '../../prsntn-grp/table-header';
import { ListHeader as DefListHeader } from '../../prsntn-grp/list-header';
import {
    IProps, TRowsOption, TDataOption, TRowOption, TRootRowOption, TNestedRowOption,
    IState, TModExpdState, TModSortState, TShallResetState,
    TCmp, TFn, TRowCtx, IRowComponentProps,
    rowHandleType, expdHandleType, paginationType, sortBtnType
} from './type';


export class DataGrid extends MemoComponent<IProps, IState> {
    //// Dependency Injection
    readonly thHandle: ThHandle = new ThHandle();
    readonly pgnHandle: PgnHandle = new PgnHandle();
    readonly sortHandle: SortHandle = new SortHandle();
    readonly rowHandle: RowHandle = new RowHandle();
    readonly expdHandle: ExpdHandle = new ExpdHandle();
    readonly cssCls = new UtilHandle().cssCls;
    readonly BASE_CLS: string = 'kz-datagrid';

    //// Builtin API
    constructor(props: IProps) {
        super(props);
        this.state = this.createState(props);
    }

    UNSAFE_componentWillReceiveProps(modProps: IProps): void {
        const shallReset: TShallResetState = this.shallResetState(modProps, this.props);
        const modState: Partial<IState> = this.createState(modProps, shallReset);
        this.setState({ ...this.state, ...modState });
    }

    render() {
        const { BASE_CLS, cssCls } = this;
        const { isTb, thRowsCtx } = this.state;
        const { paginate, component } = this.props;
        const { pagination: UserPagination, header: UserHeader } = component;

        const data: TDataOption = this.getSortedData();
        const rowsElem: ReactElement[] = this.getRowsElem(data);
        const Grid = isTb ? 'table' : 'ul';
        const GRID_CLS: string = cssCls(`${BASE_CLS}__grid`, 'root');
        const gridBody: ReactElement | ReactElement[] = isTb ? <tbody>{rowsElem}</tbody> : rowsElem;
        const Pagination: TCmp = UserPagination ?? DefPagination;
        const GridHeader: TCmp = UserHeader ?? (isTb ? DefTableHeader : DefListHeader);

        return (
            <div className={BASE_CLS}>{ paginate &&
                <Pagination {...this.getPgnCmpProps(data)} />}
                <Grid className={GRID_CLS}>{ thRowsCtx &&
                    <GridHeader
                        thRowsContext={thRowsCtx}
                        sortBtnProps={(sortKey: string) => this.getSortCmpProps(data, sortKey)}
                        />}
                    {gridBody}
                </Grid>
            </div>
        );
    }

    //// State
    createState(props: IProps, shallResetState?: TShallResetState): IState {
        const { type, component, data, sort, paginate, expand, header } = props;
        const { rows } = component;
        const { thHandle, expdHandle, sortHandle, pgnHandle } = this;
        const sortOption = sort ? sortHandle.createOption(sort) : null;
        const pgnOption = paginate ? pgnHandle.createOption(paginate) : null;

        // Note: data used to create paginate state doesnt have to be sorted, it can be generic
        const state: IState = {
            isTb: type !== 'list' ? true : false,
            thRowsCtx: header ? thHandle.getCtxTbHeaders(header) : null,
            rowsOption: rows ? this.transformRowOption(rows) : null,
            sortOption,
            sortState: sort ? sortHandle.createState(data, sortOption) : null,
            pgnOption,
            pgnState: paginate ? pgnHandle.createState(data, pgnOption) : null,
            expdState: rows.length > 1 && expand ? expdHandle.createState() : null
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
     * |                                   |   isTb    | thRowsCtx | rowsOption | sortOption | sortState | pgnOption | pgnState |  expdState    |
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
        const isDffHeader: boolean = header !== props.header;
        const isDiffRows: boolean = component.rows !== props.component.rows;
        const isDiffSort: boolean = sort !== props.sort;
        const isDiffPgn: boolean = paginate !== props.paginate;
        const isDiffExpd: boolean = expand !== props.expand;

        return {
            isTb: isDiffGridType,
            sortOption: isDiffSort,
            sortState: isDiffSort || isDiffData || isDffHeader,
            pgnOption: isDiffPgn,
            pgnState: isDiffPgn || isDiffData,
            thRowsCtx: isDffHeader,
            rowsOption: isDiffRows || isDiffExpd,
            expdState: isDiffExpd || isDiffRows || isDiffData,
        };
    }

    //// Altering Rows Option (so that it renders the corresponding Row Template Component)
    // Transform the Component Row Option (from Props) to align its input with Row Handle Service
    transformRowOption(rows: TRowsOption): rowHandleType.IRawRowsOption[] {
        return rows.map((row: TRowOption, idx: number) => {
            const isRootRowConfig: boolean = idx === 0;
            const RowCmp: TCmp = isRootRowConfig ?
                (row as TRootRowOption)[0] :
                (row as TNestedRowOption)[1];
            const transformFn: TFn = this.getCmpTransformFn(RowCmp);
            return (isRootRowConfig ? [transformFn] : [row[0], transformFn]) as rowHandleType.IRawRowsOption;
        });
    }

    getCmpTransformFn(RowCmp: TCmp): TFn {
        const { cssCls, BASE_CLS } = this;
        return (itemCtx: TRowCtx) => {
            const { itemId, itemLvl, nestedItems, rowType } = itemCtx;
            const rowProps: IRowComponentProps = {
                ...itemCtx,
                expandProps: nestedItems ? this.getRowCmpExpdProps(itemCtx) : null,
                classNames:  {
                    REG_ROW: cssCls(`${BASE_CLS}__row`, rowType),
                    NESTED_ROW: nestedItems ? cssCls(`${BASE_CLS}__row`, 'nested') : '',
                    NESTED_GRID: nestedItems ? cssCls(`${BASE_CLS}__grid`, `nested-${itemLvl+1}`) : '',
                }
            };
            return <RowCmp key={itemId} {...rowProps} />;
        };
    }

    //// Sort, Expand, Pagination
    getSortedData(): TDataOption {
        return this.state.sortState?.data || this.props.data;
    }

    getRowsElem(data: TDataOption): ReactElement[] {
        const { rowKey, expand } = this.props;
        const { pgnOption, pgnState, rowsOption } = this.state;
        const { startIdx, endIdx } = pgnOption ? pgnState : {} as any;
        return this.rowHandle.createCtxRows<ReactElement>({
            data: pgnOption ? data.slice(startIdx, endIdx) : data,
            rows: rowsOption,
            rowIdKey: rowKey,
            showAll: expand?.showAll ?? false
        });
    }

    getRowCmpExpdProps(itemCtx: TRowCtx) {
        const { expand, callback } = this.props;
        const { onExpandChange } = callback ?? {};

        return this.expdHandle.getExpdBtnAttr({
            itemCtx: itemCtx as expdHandleType.TItemCtx,
            expdState: this.state.expdState,
            option: expand,
            callback: (modState: TModExpdState) => this.onStateChange(modState, onExpandChange),
        });
    }

    getPgnCmpProps(data: TDataOption): paginationType.IProps {
        const { onPaginateChange } = this.props.callback ?? {};
        const { pgnOption, pgnState } = this.state;
        if (!pgnOption) return null;

        return {
            ...pgnState,
            ...this.pgnHandle.createGenericCmpAttr({
                data,
                callback: (modState: Partial<IState>) => this.onStateChange(modState, onPaginateChange),
                option: pgnOption,
                state: pgnState
            })
        };
    }

    getSortCmpProps(data: TDataOption, sortKey: string): sortBtnType.IProps {
        const { sortOption } = this.state;
        if (!sortOption) return null;

        const { onSortChange } = this.props.callback ?? {};
        const { sortBtnAttr } = this.sortHandle.createGenericCmpAttr({
            data,
            callback: (modState: TModSortState) => this.onStateChange(modState, onSortChange),
            option: sortOption
        }, sortKey);
        return sortBtnAttr;
    }

    onStateChange(modState: Partial<IState>, userCallback: TFn): void {
        this.setState({ ...this.state, ...modState });
        userCallback?.(modState);
    }
}