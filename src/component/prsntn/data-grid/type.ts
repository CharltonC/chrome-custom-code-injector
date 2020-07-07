import { ReactElement } from "react";

import * as clpsHandleType from '../../../service/handle/collapse/type';
import * as pgnHandleType from '../../../service/handle/paginate/type';
import * as thHandleType from '../../../service/handle/table-header/type';
import * as dropdownType from '../dropdown/type';
import { PgnOption } from '../../../service/handle/paginate';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: any[];
    rows: IRow[];
    type?: TGridType;
    header?: thHandleType.IThConfig[];
    nesting?: INestOption;
    sort?: ISortOption;
    paginate?: IPgnOption;
}

export type TCmpCls = React.FC<any> | React.ComponentClass<any>;

export type TGridType = 'table' | 'list';

export interface IPgnOption extends Partial<PgnOption> {}

export interface ISortOption {
    key: string;
    isAsc?: boolean;
}

export interface INestOption {
    showInitial?: clpsHandleType.TVisibleNestablePath;
    showOnePerLvl?: boolean;
}

export interface IRow extends Array<any> {
    0: string | TCmpCls;
    1?: TCmpCls;
}

//// State
export interface IState {
    nestState: TNestState;
    sortState: ISortState;
    pgnState: IPgnState;
    thState: thHandleType.IThCtx[][]
}

export type TNestState = Record<string, boolean>;

export interface ISortState {
    option: ISortOption;
    data: any[];
}

export interface INestedRowProps extends React.HTMLAttributes<HTMLElement> {
    item: {[k: string]: any};
    nestedRow?: ReactElement;
}

export type TShallResetState = {
    [K in keyof IState]: boolean;
}


//// Expand/Collapse
export interface IClpsProps {
    isNestedOpen?: boolean;
    onCollapseChanged?: TFn;
}


//// Pagination
export interface IPgnState {
    option: Required<PgnOption>;
    status: pgnHandleType.IPgnStatus;
}

export interface IPgnProps {
    firstBtnProps: TBtnProps;
    prevBtnProps: TBtnProps;
    nextBtnProps: TBtnProps;
    lastBtnProps: TBtnProps;
    perPageSelectProps: dropdownType.IProps;
    pageSelectProps: dropdownType.IProps;
}

export interface IPgnPropsCtx {
    data: any[];
    option: PgnOption;
    callback?: TPgnCallback;
}

export type TPgnCallback = (pgnState: IPgnState) => any;

export {pgnHandleType as pgnHandleType};
export {PgnOption as PgnOption};
export {dropdownType as dropdownType}


//// Generic
export type TFn = (...args: any[]) => any;
export type TBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type TSelectEvt = React.ChangeEvent<HTMLSelectElement>;


//// Reexport
export {clpsHandleType as clpsHandleType};
export {thHandleType as thHandleType};
export * as sortBtnType from '../sort-btn/type';
export * as paginationType from '../pagination/type';
