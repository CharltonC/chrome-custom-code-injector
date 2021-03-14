import * as TSortHandle from '../../../service/sort-handle/type';
import * as TRowTransformHandle from '../../../service/row-transform-handle/type';
import * as TRowExpdHandle from '../../../service/row-expand-handle/type';
import * as TPgnHandle from '../../../service/pagination-handle/type';
import * as THeaderGrpHandle from '../../../service/header-group-handle/type';
import * as TDataGridHeader from './contextual-header/type';
import { ReactElement } from 'react';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: ADataOption;
    type?: AGridTypeOption;
    header?: THeaderGrpHandle.IOption[];
    rowKey?: ARowKeyOption;
    component: IComponentOption;
    expand?: Partial<TRowExpdHandle.IOption>;
    sort?: Partial<TSortHandle.IOption>;
    paginate?: Partial<TPgnHandle.IOption>;
    callback?: ICallbackOption;
}

export type ADataOption = Record<string, any>[];
export type AGridTypeOption = 'table' | 'list';
export type ARowKeyOption = string | ((ctx: TRowTransformHandle.IRowItemCtx<ReactElement>) => string);
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
    rowsOption: TRowTransformHandle.IRawRowsOption[];
    expdState: TRowExpdHandle.IState;
    sortOption: TSortHandle.IOption;
    sortState: TSortHandle.IState;
    pgnOption: TPgnHandle.IOption;
    pgnState: TPgnHandle.IState;
}

export type AModPgnState = Pick<IState, 'pgnOption' | 'pgnState'>;
export type AModExpdState = Pick<IState, 'expdState'>;
export type AModSortState = Pick<IState, 'sortOption' | 'sortState'>;
export type AShallResetState = {
    [K in keyof IState]: boolean;
}

export type AHeaderCtx = ATbHeaderCtx | AListHeaderCtx
type ATbHeaderCtx = THeaderGrpHandle.ICtxTbHeader<TDataGridHeader.TTitle>;
type AListHeaderCtx = THeaderGrpHandle.ICtxListHeader<TDataGridHeader.TTitle>;

//// Generic
export type AFn = (...args: any[]) => any;
export type ACmp = React.FC<any> | React.ComponentClass<any>;
export type ARowCtx = TRowTransformHandle.IRowItemCtx<ReactElement>;

// User-Defined Row Template
export interface IRowComponentProps extends ARowCtx {
    key: string;
    dataSrc: ADataOption;
    expandProps: TRowExpdHandle.IExpdBtnAttr;
    commonProps: Record<string, any>;
    rowColStyle?: Record<string, string | number>;
    classNames: {
        REG_ROW: string;
        NESTED_ROW: string;
        NESTED_GRID: string;
    }
}

//// Reexport
export { TPgnHandle };
export { TRowTransformHandle };
export { TRowExpdHandle };
export { TSortHandle };
export { THeaderGrpHandle };
export * as TSortBtn from '../../base/btn-sort/type';
export * as TPagination from './contextual-pagination/type';
export * as TDataGridHeader from './contextual-header/type';
