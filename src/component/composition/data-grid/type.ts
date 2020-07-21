import * as sortHandleType from '../../../service/handle/sort/type';
import * as rowHandleType from '../../../service/handle/row/type';
import * as pgnHandleType from '../../../service/handle/pagination/type';
import * as thHandleType from '../../../service/handle/table-header/type';
import * as dropdownType from '../../prsntn/dropdown/type';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: TDataOption;
    rowKey?: TRowOption;
    rows: IRowOption[];
    type?: TGridTypeOption;
    header?: thHandleType.IOption[];
    expand?: IExpandOption;
    sort?: Partial<sortHandleType.IOption>;
    paginate?: Partial<pgnHandleType.IOption>;
    onPaginateChange?: TFn;
    onSortChange?: TFn;
    onExpandChange?: TFn;
}

// TODO: Move to Expand Wrapper Cmp Type
export interface IExpandOption {
    showInitial?: rowHandleType.TVisibleNestablePath;
    showOnePerLvl?: boolean;
}

export interface IRowOption extends Array<any> {
    0: string | TRowCmpCls;
    1?: TRowCmpCls;
}

export type TRowCmpCls = React.FC<any> | React.ComponentClass<any>;
export type TGridTypeOption = 'table' | 'list';
export type TDataOption = Record<string, any>[];
export type TRowOption = string | TRowKeyPipeFn;
type TRowKeyPipeFn = (ctx: rowHandleType.IItemCtx) => string;

//// State
export interface IState {
    thState: thHandleType.TState;
    rowOption: rowHandleType.IRawRowConfig[];
    sortOption: sortHandleType.IOption;
    sortState: sortHandleType.IState;
    pgnOption: pgnHandleType.IOption;
    pgnState: pgnHandleType.IState;
}

export type TShallResetState = {
    [K in keyof IState]: boolean;
}

//// Generic
export type TFn = (...args: any[]) => any;

//// Reexport
export {pgnHandleType as pgnHandleType};
export {dropdownType as dropdownType}
export {rowHandleType as rowHandleType};
export {thHandleType as thHandleType};
export {sortHandleType as sortHandleType}
export * as sortBtnType from '../../prsntn/sort-btn/type';
export * as paginationType from '../../prsntn-grp/pagination/type';
