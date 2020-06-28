import { ReactElement } from "react";
import * as pgnType from '../../../service/handle/paginate/type';
import * as clpsType from '../../../service/handle/collapse/type';

//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: any[];
    rows: IRow[];
    type?: TGridType;
    header?: TCmpCls;

    // TODO: renamed later
    nesting?: INestOption;
    sort?: ISortOption;
    paginate?: IPgnOption;
}

export type TCmpCls = React.FC<any> | React.ComponentClass<any>;

export type TGridType = 'table' | 'list';

export interface ISortOption {
    key: string;
    isAsc?: boolean;
}

export interface IPgnOption {
    page?: number;
    increment?: number[];
    incrementIdx?: number;
}

export interface INestOption {
    showInitial?: clpsType.TVisibleNestablePath;
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
}

export type TNestState = Record<string, boolean>;

export interface ISortState {
    option: ISortOption;
    data: any[];
};

export interface IPgnState {
    option: IPgnOption;
    status: Partial<pgnType.IPgnState>;
}

export interface INestedRowProps extends React.HTMLAttributes<HTMLElement> {
    item: {[k: string]: any};
    nestedRow?: ReactElement;
}

//// Internal Component Props
export type TFn = (...args: any[]) => any;

export interface IClpsProps {
    isNestedOpen?: boolean;
    onCollapseChanged?: TFn;
}
