import React, { Component, memo, ReactElement } from "react";
import { UtilHandle } from '../../../service/handle/util';
import { ThHandle } from '../../../service/handle/table-header';
import { SortHandle } from '../../../service/handle/sort';
import { RowHandle } from '../../../service/handle/row'
import { PgnHandle } from '../../../service/handle/pagination';
import { SortBtn } from '../../prsntn/sort-btn';
import { Pagination } from '../../prsntn-grp/pagination';
import { ExpandWrapper } from '../../structural/expand';
import {
    IProps, IState,
    IRow, TRowCmpCls, TFn, TRowKeyPipeFn,
    rowHandleType, paginationType, sortBtnType,
} from './type';


export class _DataGrid extends Component<IProps, IState> {
    //// Dependency Injection
    readonly BASE_TB_CLS: string = 'kz-datagrid__table';
    readonly thHandle = new ThHandle();
    readonly pgnHandle: PgnHandle = new PgnHandle();
    readonly sortHandle: SortHandle = new SortHandle();
    readonly rowHandle: RowHandle = new RowHandle();
    readonly cssCls = new UtilHandle().cssCls;

    //// Builtin API
    constructor(props: IProps) {
        super(props);
        this.state = this.createState(props);
    }

    render() {
        const { paginate } = this.props;
        const { thState } = this.state;
        const data: any[] = this.getSortedData();

        return (
            <div className="kz-datagrid">{ paginate &&
                <Pagination {...this.getPgnCmpProps(data)} />}
                {/* TODO: Wrapper tag ? */}
                <table className={this.cssCls(this.BASE_TB_CLS, 'root')}>{ thState &&
                    <thead>{ thState.map((thCtxs, trIdx: number) => (
                        <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }, thIdx: number) => (
                            <th key={thIdx} {...thProps}>
                                <span>{title}</span>{ sortKey &&
                                <SortBtn {...this.getSortCmpProps(data, sortKey)} />}
                            </th>))}
                        </tr>))}
                    </thead>}
                    <tbody>
                        {this.getRowsElem(data)}
                    </tbody>
                </table>
            </div>
        );
    }

    //// Core
    // Transform the Component Row Option (from Props) to align its input with Row Handle Service
    transformRowOption(rows: IRow[], rowKey: string | TRowKeyPipeFn): rowHandleType.IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx], rowKey);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as rowHandleType.IRawRowConfig;
        });
    }

    getCmpTransformFn(RowCmp: TRowCmpCls, rowKey: string | TRowKeyPipeFn): TFn {
        return (itemCtx: rowHandleType.IItemCtx) => {
            const { item, itemLvl, isExpdByDef, nestedItems } = itemCtx;
            const key: string = typeof rowKey === 'string' ? item[rowKey] : rowKey(itemCtx);

            if (nestedItems) {
                const tbCls: string = this.cssCls(this.BASE_TB_CLS, `nest-${itemLvl+1}`);
                // TODO: fix type
                itemCtx.nestedItems = this.wrapCmpWithTag(nestedItems, tbCls) as any;
            }

            return nestedItems ?
                <ExpandWrapper key={key} initial={isExpdByDef}>
                    <RowCmp {...itemCtx} />
                </ExpandWrapper> :
                <RowCmp key={key} {...itemCtx} />;
        };
    }

    createState(props: IProps): IState {
        const { rows, rowKey, data, sort, paginate, header } = props;
        const rowOption = rows ? this.transformRowOption(rows, rowKey ? rowKey : 'id') : null;
        const sortOption = sort ? this.sortHandle.createOption(sort) : null;
        const sortState = sort ? this.sortHandle.createState(data, sortOption) : null;
        const pgnOption = paginate ? this.pgnHandle.createOption(paginate) : null;
        const pgnState = paginate ? this.pgnHandle.createState(data, paginate) : null;
        const thState = header ? this.thHandle.createState(header) : null;

        return {
            // TODO: make option & state in one call?
            thState,
            rowOption,
            sortOption, sortState,
            pgnOption, pgnState,
        };
    }

    getSortedData(): any[] {
        return this.state.sortState?.data || this.props.data;
    }

    getRowsElem(data: any[]): ReactElement[] {
        const { pgnOption, pgnState, rowOption } = this.state;
        const { showInitial: visiblePath } = this.props.expand;
        const { startIdx, endIdx } = pgnOption ? pgnState : {} as any;
        return this.rowHandle.createState({
            data: pgnOption ? data.slice(startIdx, endIdx) : data,
            rows: rowOption,
            visiblePath
        });
    }

    getPgnCmpProps(data: any[]): paginationType.IProps {
        const { pgnOption, pgnState } = this.state;
        if (!pgnOption) return null;
        return {
            ...pgnState,
            ...this.pgnHandle.createGenericCmpAttr({
                data,
                callback: this.onOptionChange.bind(this),
                option: pgnOption, state: pgnState
            })
        };
    }

    getSortCmpProps(data: any[], sortKey: string): sortBtnType.IProps {
        const { sortOption } = this.state;
        if (!sortOption) return null;
        const { sortBtnAttr } = this.sortHandle.createGenericCmpAttr({
            data,
            callback: this.onOptionChange.bind(this),
            option: sortOption
        }, sortKey);
        return sortBtnAttr;
    }

    // TODO: param type
    onOptionChange(modState): void {
        // TODO: add diff. callback
        this.setState({ ...this.state, ...modState });
    }

    wrapCmpWithTag(content: ReactElement | ReactElement[], className: string = ''): ReactElement {
        // TODO: Type
        const props = className ? { className } : {};
        return this.props.type === 'table' ?
            <table {...props}>
                <tbody>{content}</tbody>
            </table> :
            <ul {...props}>{content}</ul>;
    }
}

export const DataGrid = memo(_DataGrid);