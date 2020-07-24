import React, { Component, memo, ReactElement } from "react";
import { UtilHandle } from '../../../service/handle/util';
import { ThHandle } from '../../../service/handle/table-header';
import { SortHandle } from '../../../service/handle/sort';
import { RowHandle } from '../../../service/handle/row'
import { PgnHandle } from '../../../service/handle/pagination';
import { ExpandWrapper } from '../../structural/expand';
import { Pagination as DefPagination } from '../../prsntn-grp/pagination';
import { TableHeader as DefTableHeader } from '../../prsntn-grp/table-header';
import {
    IProps, IRowOption, TDataOption,
    IState, TModPgnState, TModRowsExpdState, TModSortState,
    TCmp, TFn, TElemContent, TRowCtx,
    rowHandleType, paginationType, sortBtnType, pgnHandleType, sortHandleType, thHandleType
} from './type';


export class _DataGrid extends Component<IProps, IState> {
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

    render() {
        const { thRowsCtx } = this.state;
        const { paginate, component } = this.props;
        const { pagination: UserPagination, header: UserHeader } = component;
        const data: TDataOption = this.getSortedData();
        const Pagination: TCmp = UserPagination || DefPagination;
        const TableHeader: TCmp = UserHeader || DefTableHeader;

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
    createState(): IState {
        const { component, data, sort, paginate, header } = this.props;
        const { thHandle, sortHandle, pgnHandle } = this;
        const { rows } = component;
        const thRowsCtx: thHandleType.TRowsThCtx = header ? thHandle.createRowThCtx(header) : null;
        const rowsOption: rowHandleType.IRawRowsOption[] = rows ? this.transformRowOption(rows) : null;
        const sortOption: sortHandleType.IOption = sort ? sortHandle.createOption(sort) : null;
        const sortState: sortHandleType.IState = sort ? sortHandle.createState(data, sortOption) : null;
        const pgnOption: pgnHandleType.IOption = paginate ? pgnHandle.createOption(paginate) : null;
        const pgnState: pgnHandleType.IState = paginate ? pgnHandle.createState(data, paginate) : null;
        return { thRowsCtx, rowsOption, sortOption, sortState, pgnOption, pgnState, rowsExpdState: {} };
    }

    // Transform the Component Row Option (from Props) to align its input with Row Handle Service
    transformRowOption(rows: IRowOption[]): rowHandleType.IRawRowsOption[] {
        return rows.map((row: IRowOption, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as rowHandleType.IRawRowsOption;
        });
    }

    getCmpTransformFn(RowCmp: TCmp): TFn {
        const { cssCls, BASE_GRID_CLS, props } = this;
        const { type, callback, expand } = props;
        const { onExpandChange } = callback ?? {};
        const isOneExpdPerLvl: boolean = expand?.oneExpandPerLevel ?? false;

        return (itemCtx: TRowCtx) => {
            const { itemId, itemLvl, isExpdByDef, nestedItems } = itemCtx;
            itemCtx.nestedItems = nestedItems ?
                this.wrapNestedItemsWithTag(
                    nestedItems,
                    type,
                    cssCls(BASE_GRID_CLS, `nest-${itemLvl+1}`)
                ) :
                null;

            const expandProps: rowHandleType.TRowExpdCmpAttr = (!!nestedItems && isOneExpdPerLvl) ?
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

    wrapNestedItemsWithTag(content: TElemContent, type: string = 'table', className: string = ''): ReactElement {
        const props: {className?: string} = className ? { className } : {};
        return type === 'table' ?
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
        const { rowHandle, props, state } = this;
        const { onExpandChange } = props.callback ?? {};
        const currExpdState = state?.rowsExpdState ?? {};
        return rowHandle.getRowCmpExpdAttr({
            // by def. all rows should be closed for this feature as `showAll` cannot be used with `expOnePerLvl`
            isOpen: rowHandle.isRowOpen(currExpdState, itemCtx.itemId),
            itemCtx,
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

export const DataGrid = memo(_DataGrid);