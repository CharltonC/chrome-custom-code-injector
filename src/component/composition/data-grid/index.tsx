import React, { ReactElement } from "react";
import { MemoComponent } from '../../../asset/ts/memo-component';
import { UtilHandle } from '../../../service/handle/util';
import { ThHandle } from '../../../service/handle/table-header';
import { RowHandle } from '../../../service/handle/row'
import { ExpdHandle } from '../../../service/handle/expand'
import { SortHandle } from '../../../service/handle/sort';
import { PgnHandle } from '../../../service/handle/pagination';
import { ExpandWrapper } from '../../structural/expand';
import { Pagination as DefPagination } from '../../prsntn-grp/pagination';
import { TableHeader as DefTableHeader } from '../../prsntn-grp/table-header';
import {
    IProps, TRowsOption, TDataOption, TRowOption, TRootRowOption, TNestedRowOption,
    IState, TModRowsExpdState, TModSortState, TShallResetState,
    TCmp, TFn, TElemContent, TRowCtx,
    rowHandleType, expdHandleType, paginationType, sortBtnType
} from './type';


export class DataGrid extends MemoComponent<IProps, IState> {
    //// Dependency Injection
    readonly thHandle: ThHandle = new ThHandle();
    readonly pgnHandle: PgnHandle = new PgnHandle();
    readonly sortHandle: SortHandle = new SortHandle();
    readonly rowHandle: RowHandle = new RowHandle();
    readonly cssCls = new UtilHandle().cssCls;
    readonly BASE_GRID_CLS: string = 'kz-datagrid__grid';

    //// Builtin API
    constructor(props: IProps) {
        super(props);
        this.state = this.createState();
    }

    UNSAFE_componentWillReceiveProps(modProps: IProps): void {
        const shallReset: TShallResetState = this.shallResetState(modProps, this.props);
        const modState: IState = this.createState(shallReset);
        this.setState({...modState});
    }

    render() {
        const { thRowsCtx } = this.state;
        const { paginate, component } = this.props;
        const { pagination: UserPagination, header: UserHeader } = component;
        const data: TDataOption = this.getSortedData();
        const Pagination: TCmp = UserPagination || DefPagination;
        const TableHeader: TCmp = UserHeader || DefTableHeader;

        // TODO: Dynamic Tag
        // TODO: Resuse Header for List Grid

        return (
            <div className="kz-datagrid">{ paginate &&
                <Pagination {...this.getPgnCmpProps(data)} />}
                {/* TODO: Wrapper tag + class ? */}
                <table className={this.cssCls(this.BASE_GRID_CLS, 'root')}>{thRowsCtx &&
                    <TableHeader
                        thRowsContext={thRowsCtx}
                        getSortBtnProps={(sortKey: string) => this.getSortCmpProps(data, sortKey)}
                    />}
                    <tbody>
                        {this.getRowsElem(data)}
                    </tbody>
                </table>
            </div>
        );
    }

    //// Core
    createState(reset?: TShallResetState): IState {
        const { type, component, data, sort, paginate, header } = this.props;
        const { thHandle, sortHandle, pgnHandle } = this;
        const { rows } = component;
        const sortOption = sort && (reset?.sortOption || true) ? sortHandle.createOption(sort) : null;
        const pgnOption = paginate && (reset?.pgnOption || true) ? pgnHandle.createOption(paginate) : null;

        // data used to create paginate state doesnt have to be sorted, it can be generic
        return {
            isTb: type !== 'list' && (reset?.isTb || true) ? true : false,
            thRowsCtx: header && (reset?.thRowsCtx || true) ? thHandle.createRowThCtx(header) : null,
            rowsOption: rows && (reset?.rowsOption || true) ? this.transformRowOption(rows) : null,
            sortOption,
            sortState: sort && (reset?.sortState || true) ? sortHandle.createState(data, sortOption) : null,
            pgnOption,
            pgnState: paginate && (reset?.pgnState || true) ? pgnHandle.createState(data, paginate) : null,
            rowsExpdState: rows.length > 1 && (reset?.rowsExpdState || true) ? {} : null
        };
    }

    /*
     * State impacted by Props changes
     * - `R` flag means the prop is used at Render Time as a source of Truth so we dont need to recreate the internal states
     * - The table can be used to determine what internal states needs to be recreated/updated when props changes and hence optimizing calls
     * - Reference Table:
     *
     * | Props                             | States                                                                                             |
     * |                                   |-----------|-----------|------------|------------|-----------|-----------|----------|---------------|
     * |                                   |   isTb    | thRowsCtx | rowsOption | sortOption | sortState | pgnOption | pgnState | rowsExpdState |
     * |-----------------------------------|-----------|-----------|------------|------------|-----------|-----------|----------|---------------|
     * | data                              |     x     |     x     |      x     |      x     |     ✓     |     x     |     ✓    |       x       |
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
        const isDiffRowsOption: boolean = component.rows !== props.component.rows;
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
            rowsOption: isDiffRowsOption || isDiffExpd,
            rowsExpdState: isDiffRowsOption || isDiffExpd,
        };
    }

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
        const { cssCls, BASE_GRID_CLS, props } = this;
        const { callback, expand } = props;
        const { onExpandChange } = callback ?? {};
        const isOneExpdPerLvl: boolean = expand?.oneExpandPerLevel ?? false;

        return (itemCtx: TRowCtx) => {
            const { itemId, itemLvl, isExpdByDef, nestedItems } = itemCtx;
            itemCtx.nestedItems = nestedItems ?
                this.wrapNestedItemsWithTag(
                    nestedItems,
                    cssCls(BASE_GRID_CLS, `nest-${itemLvl+1}`)
                ) :
                null;

            const expandProps: expdHandleType.TRowExpdCmpAttr = (!!nestedItems && isOneExpdPerLvl) ?
                this.getRowCmpExpdProps(itemCtx):
                null;

            // Why use `ExpandWrapper` and `expandProps` separately to deal with expand state?
            // - `ExpandWrapper` is used for a local expand state where they dont interfere with each other hence keeping it to itself
            // - `expandProps` is used where each row's expand state MAY interfere with each other hence higher/shared state
            return nestedItems ?
                (isOneExpdPerLvl ?
                    <RowCmp key={itemId} {...itemCtx} expandProps={expandProps} /> :
                    <ExpandWrapper key={itemId} initial={isExpdByDef} callback={onExpandChange}>
                        <RowCmp {...itemCtx} />
                    </ExpandWrapper>
                ) :
                <RowCmp key={itemId} {...itemCtx} />;
        };
    }

    wrapNestedItemsWithTag(content: TElemContent, className: string = ''): ReactElement {
        const props: {className?: string} = className ? { className } : {};
        return this.state.isTb ?
            <table {...props}>
                <tbody>{content}</tbody>
            </table> :
            <ul {...props}>{content}</ul>;
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
        const { expdHandle, props, state } = this;
        const { onExpandChange } = props.callback ?? {};
        const currExpdState = state?.rowsExpdState ?? {};
        return expdHandle.getRowCmpExpdAttr({
            // by def. all rows should be closed for this feature as `showAll` cannot be used with `expOnePerLvl`
            itemCtx: (itemCtx as any),
            currExpdState,
            callback: (modState: TModRowsExpdState) => this.onStateChange(modState, onExpandChange),
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