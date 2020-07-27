import * as sortHandleType from '../../../service/handle/sort/type';
import * as rowHandleType from '../../../service/handle/row/type';
import * as expdHandleType from '../../../service/handle/expand/type';
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
    expand?: Partial<expdHandleType.IOption>;
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
export type TNestedRowOption = [ string, TFn ];

interface IComponentOption {
    rows: TRowsOption;
    header?: TCmp;
    pagination?: TCmp;
}

interface ICallbackOption {
    onPaginateChange?: TFn;
    onSortChange?: TFn;
    onExpandChange?: TFn;
}

//// State
export interface IState {
    isTb: boolean;
    thRowsCtx: thHandleType.TRowsThCtx;
    rowsOption: rowHandleType.IRawRowsOption[];
    expdState: expdHandleType.IState;
    sortOption: sortHandleType.IOption;
    sortState: sortHandleType.IState;
    pgnOption: pgnHandleType.IOption;
    pgnState: pgnHandleType.IState;
}

export type TModPgnState = Pick<IState, 'pgnOption' | 'pgnState'>;
export type TModExpdState = Pick<IState, 'expdState'>;
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
export {expdHandleType as expdHandleType};
export {sortHandleType as sortHandleType};
export {thHandleType as thHandleType};
export * as sortBtnType from '../../prsntn/sort-btn/type';
export * as paginationType from '../../prsntn-grp/pagination/type';
