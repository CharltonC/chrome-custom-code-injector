import * as sortHandleType from '../../../service/sort-handle/type';
import * as rowTransformHandleType from '../../../service/row-transform-handle/type';
import * as rowExpdHandleType from '../../../service/row-expand-handle/type';
import * as pgnHandleType from '../../../service/pagination-handle/type';
import * as headerGrpHandleType from '../../../service/header-group-handle/type';
import * as DataGridHeaderType from './contextual-header/type';
import { ReactElement } from 'react';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: ADataOption;
    type?: AGridTypeOption;
    header?: headerGrpHandleType.IOption[];
    rowKey?: ARowKeyOption;
    component: IComponentOption;
    expand?: Partial<rowExpdHandleType.IOption>;
    sort?: Partial<sortHandleType.IOption>;
    paginate?: Partial<pgnHandleType.IOption>;
    callback?: ICallbackOption;
}

export type ADataOption = Record<string, any>[];
export type AGridTypeOption = 'table' | 'list';
export type ARowKeyOption = string | ((ctx: rowTransformHandleType.IRowItemCtx<ReactElement>) => string);
export type ARowsOption = [ ARootRowOption, ...Array<ANestedRowOption> ];
export type ARowOption = ARootRowOption | ANestedRowOption;
export type ARootRowOption = [ ACmp ];
export type ANestedRowOption = [ string, ACmp ];

export interface IComponentOption extends IPreferredCmp {
    rows: ARowsOption;
    commonProps?: Record<string, any>;
}

export interface IPreferredCmp {
    Header?: ACmp;
    Pagination?: ACmp;
}

interface ICallbackOption {
    onPaginateChange?: AFn;
    onSortChange?: AFn;
    onExpandChange?: AFn;
}

//// State
export interface IState {
    isTb: boolean;
    headerCtx: AHeaderCtx;
    rowsOption: rowTransformHandleType.IRawRowsOption[];
    expdState: rowExpdHandleType.IState;
    sortOption: sortHandleType.IOption;
    sortState: sortHandleType.IState;
    pgnOption: pgnHandleType.IOption;
    pgnState: pgnHandleType.IState;
}

export type AModPgnState = Pick<IState, 'pgnOption' | 'pgnState'>;
export type AModExpdState = Pick<IState, 'expdState'>;
export type AModSortState = Pick<IState, 'sortOption' | 'sortState'>;
export type AShallResetState = {
    [K in keyof IState]: boolean;
}

export type AHeaderCtx = ATbHeaderCtx | AListHeaderCtx
type ATbHeaderCtx = headerGrpHandleType.ICtxTbHeader<DataGridHeaderType.TTitle>;
type AListHeaderCtx = headerGrpHandleType.ICtxListHeader<DataGridHeaderType.TTitle>;

//// Generic
export type AFn = (...args: any[]) => any;
export type ACmp = React.FC<any> | React.ComponentClass<any>;
export type ARowCtx = rowTransformHandleType.IRowItemCtx<ReactElement>;

// User-Defined Row Template
export interface IRowComponentProps extends ARowCtx {
    key: string;
    dataSrc: ADataOption;
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
export * as paginationType from './contextual-pagination/type';
export * as DataGridHeaderType from './contextual-header/type';
