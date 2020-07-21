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
    IProps, IRowOption, TRowKeyOption, TDataOption,
    IState,
    TCmp, TFn,
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
        const { paginate, component } = this.props;
        const { pagination: UserPagination, header: UserHeader } = component;
        const { thRowsCtx } = this.state;
        const data: TDataOption = this.getSortedData();
        const Pagination: TCmp = UserPagination ? UserPagination : DefPagination;
        const TableHeader: TCmp = UserHeader ? UserHeader : DefTableHeader;

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
        const { component, rowKey, data, sort, paginate, header } = this.props;
        const { thHandle, sortHandle, pgnHandle } = this;
        const { rows } = component;
        const thRowsCtx: thHandleType.TRowsThCtx = header ? thHandle.createRowThCtx(header) : null;
        const rowsOption: rowHandleType.IRawRowConfig[] = rows ? this.transformRowOption(rows, rowKey ? rowKey : 'id') : null;
        const sortOption: sortHandleType.IOption = sort ? sortHandle.createOption(sort) : null;
        const sortState: sortHandleType.IState = sort ? sortHandle.createState(data, sortOption) : null;
        const pgnOption: pgnHandleType.IOption = paginate ? pgnHandle.createOption(paginate) : null;
        const pgnState: pgnHandleType.IState = paginate ? pgnHandle.createState(data, paginate) : null;
        return { thRowsCtx, rowsOption, sortOption, sortState, pgnOption, pgnState };
    }

    // Transform the Component Row Option (from Props) to align its input with Row Handle Service
    transformRowOption(rows: IRowOption[], rowKey: TRowKeyOption): rowHandleType.IRawRowConfig[] {
        return rows.map((row: IRowOption, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx], rowKey);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as rowHandleType.IRawRowConfig;
        });
    }

    getCmpTransformFn(RowCmp: TCmp, rowKey: TRowKeyOption): TFn {
        const { cssCls, BASE_GRID_CLS, props } = this;
        const { type, callback } = props;
        const { onExpandChange } = callback ?? {};

        return (itemCtx: rowHandleType.IItemCtx<ReactElement>) => {
            const { item, itemLvl, isExpdByDef, nestedItems } = itemCtx;
            const key: string = typeof rowKey === 'string' ? item[rowKey] : rowKey(itemCtx);
            itemCtx.nestedItems = nestedItems ?
                this.wrapNestedItemsWithTag(
                    nestedItems,
                    type,
                    cssCls(BASE_GRID_CLS, `nest-${itemLvl+1}`)
                ) :
                null;

            return nestedItems ?
                <ExpandWrapper key={key} initial={isExpdByDef} callback={onExpandChange}>
                    <RowCmp {...itemCtx} />
                </ExpandWrapper> :
                <RowCmp key={key} {...itemCtx} />;
        };
    }

    wrapNestedItemsWithTag(content: ReactElement | ReactElement[], type: string = 'table', className: string = ''): ReactElement {
        const props: {className?: string} = className ? { className } : {};
        return type === 'table' ?
            <table {...props}>
                <tbody>{content}</tbody>
            </table> :
            <ul {...props}>{content}</ul>;
    }

    //// Sort, Pagination
    getSortedData(): TDataOption {
        return this.state.sortState?.data || this.props.data;
    }

    getRowsElem(data: TDataOption): ReactElement[] {
        const { pgnOption, pgnState, rowsOption } = this.state;
        const { showInitial: visiblePath } = this.props.expand;
        const { startIdx, endIdx } = pgnOption ? pgnState : {} as any;
        return this.rowHandle.createState({
            data: pgnOption ? data.slice(startIdx, endIdx) : data,
            rows: rowsOption,
            visiblePath
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
                callback: (modState: Partial<IState>) => this.onOptionChange(modState, onPaginateChange),
                option: pgnOption,
                state: pgnState
            })
        };
    }

    getSortCmpProps(data: TDataOption, sortKey: string): sortBtnType.IProps {
        const { onSortChange } = this.props.callback ?? {};
        const { sortOption } = this.state;
        if (!sortOption) return null;

        const { sortBtnAttr } = this.sortHandle.createGenericCmpAttr({
            data,
            callback: (modState: Partial<IState>) => this.onOptionChange(modState, onSortChange),
            option: sortOption
        }, sortKey);
        return sortBtnAttr;
    }

    onOptionChange(modState: Partial<IState>, userCallback: TFn): void {
        this.setState({ ...this.state, ...modState });
        userCallback?.(modState);
    }
}

export const DataGrid = memo(_DataGrid);