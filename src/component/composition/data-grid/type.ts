import * as sortHandleType from '../../../service/handle/sort/type';
import * as rowHandleType from '../../../service/handle/row/type';
import * as pgnHandleType from '../../../service/handle/pagination/type';
import * as thHandleType from '../../../service/handle/table-header/type';
import * as dropdownType from '../../prsntn/dropdown/type';
import { ReactElement } from 'react';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: TDataOption;
    type?: TGridTypeOption;
    header?: thHandleType.IOption[];
    rowKey?: TRowKeyOption;
    component: IComponentOption;
    expand?: IExpandOption;
    sort?: Partial<sortHandleType.IOption>;
    paginate?: Partial<pgnHandleType.IOption>;
    callback?: ICallbackOption;
}

export type TDataOption = Record<string, any>[];
export type TGridTypeOption = 'table' | 'list';
export type TRowKeyOption = string | ((ctx: rowHandleType.IRowItemCtx<ReactElement>) => string);

export type TRowsOption = [ TRootRowOption, ...Array<TNestedRowOption> ];
export type TRowOption = TRootRowOption | TNestedRowOption;
export type TRootRowOption = [ TFn ];
export type TNestedRowOption = [ string, TFn, number? ];

interface IComponentOption {
    rows: TRowsOption;
    header?: TCmp;
    pagination?: TCmp;
}

interface IExpandOption {
    showAll?: boolean;
    oneExpandPerLevel?: boolean;
}

interface ICallbackOption {
    onPaginateChange?: TFn;
    onSortChange?: TFn;
    onExpandChange?: TFn;
}

//// State
export interface IState {
    thRowsCtx: thHandleType.TRowsThCtx;
    rowsOption: rowHandleType.IRawRowsOption[];
    rowsExpdState: rowHandleType.TRowsExpdState;
    sortOption: sortHandleType.IOption;
    sortState: sortHandleType.IState;
    pgnOption: pgnHandleType.IOption;
    pgnState: pgnHandleType.IState;
}

export type TModPgnState = Pick<IState, 'pgnOption' | 'pgnState'>;
export type TModRowsExpdState = Pick<IState, 'rowsExpdState'>;
export type TModSortState = Pick<IState, 'sortOption' | 'sortState'>;

export type TShallResetState = {
    [K in keyof IState]: boolean;
}

//// Generic
export type TFn = (...args: any[]) => any;
export type TCmp = React.FC<any> | React.ComponentClass<any>;
export type TElemContent = ReactElement | ReactElement[];
export type TRowCtx = rowHandleType.IRowItemCtx<ReactElement>;

//// Reexport
export {pgnHandleType as pgnHandleType};
export {dropdownType as dropdownType}
export {rowHandleType as rowHandleType};
export {sortHandleType as sortHandleType};
export {thHandleType as thHandleType};
export * as sortBtnType from '../../prsntn/sort-btn/type';
export * as paginationType from '../../prsntn-grp/pagination/type';
