import * as sortHandleType from '../../../service/sort-handle/type';
import * as rowTransformHandleType from '../../../service/row-transform-handle/type';
import * as rowExpdHandleType from '../../../service/row-expand-handle/type';
import * as pgnHandleType from '../../../service/pagination-handle/type';
import * as headerGrpHandleType from '../../../service/header-group-handle/type';
import * as GridHeaderType from '../../group/grid-header/type';
import { ReactElement } from 'react';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: TDataOption;
    type?: TGridTypeOption;
    header?: headerGrpHandleType.IOption[];
    rowKey?: TRowKeyOption;
    component: IComponentOption;
    expand?: Partial<rowExpdHandleType.IOption>;
    sort?: Partial<sortHandleType.IOption>;
    paginate?: Partial<pgnHandleType.IOption>;
    callback?: ICallbackOption;
}

export type TDataOption = Record<string, any>[];
export type TGridTypeOption = 'table' | 'list';
export type TRowKeyOption = string | ((ctx: rowTransformHandleType.IRowItemCtx<ReactElement>) => string);
export type TRowsOption = [ TRootRowOption, ...Array<TNestedRowOption> ];
export type TRowOption = TRootRowOption | TNestedRowOption;
export type TRootRowOption = [ TFn ];
export type TNestedRowOption = [ string, TFn ];

export interface IComponentOption extends IPreferredCmp {
    rows: TRowsOption;
    commonProps?: Record<string, any>;
}

export interface IPreferredCmp {
    Header?: TCmp;
    Pagination?: TCmp;
}

interface ICallbackOption {
    onPaginateChange?: TFn;
    onSortChange?: TFn;
    onExpandChange?: TFn;
}

//// State
export interface IState {
    isTb: boolean;
    headerCtx: THeaderCtx;
    rowsOption: rowTransformHandleType.IRawRowsOption[];
    expdState: rowExpdHandleType.IState;
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

export type THeaderCtx = TTbHeaderCtx | TListHeaderCtx
type TTbHeaderCtx = headerGrpHandleType.ICtxTbHeader<GridHeaderType.TTitle>;
type TListHeaderCtx = headerGrpHandleType.ICtxListHeader<GridHeaderType.TTitle>;

//// Generic
export type TFn = (...args: any[]) => any;
export type TCmp = React.FC<any> | React.ComponentClass<any>;
export type TRowCtx = rowTransformHandleType.IRowItemCtx<ReactElement>;

// User-Defined Row Template
export interface IRowComponentProps extends TRowCtx {
    key: string;
    dataSrc: TDataOption;
    expandProps: rowExpdHandleType.IExpdBtnAttr;
    commonProps: Record<string, any>;
    rowColStyle?: Record<string, string | number>;
    classNames: {
        REG_ROW: string;
        NESTED_ROW: string;
        NESTED_GRID: string;
    }
}

//// Reexport
export { pgnHandleType };
export { rowTransformHandleType };
export { rowExpdHandleType };
export { sortHandleType };
export { headerGrpHandleType };
export * as sortBtnType from '../../base/btn-sort/type';
export * as paginationType from '../../group/pagination/type';
export * as GridHeaderType from '../../group/grid-header/type';
