import { ReactElement } from "react";

export type TCmpCls = React.FC<any> | React.ComponentClass<any>;

export type TFn = (...args: any[]) => any;

export type TGridType = 'table' | 'list';

export type TNestState = Record<string, boolean>;

export interface IRow extends Array<any> {
    0: string | TCmpCls;
    1?: TCmpCls;
}

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: any[];
    rows: IRow[];
    type?: TGridType;
    header?: TCmpCls;
    nestingOption?: any;
}

export interface IState {
    nestState: TNestState;
}

export interface INestedRowProps extends React.HTMLAttributes<HTMLElement> {
    item: {[k: string]: any};
    nestedRow?: ReactElement;
}

export interface IClpsProps {
    isNestedOpen?: boolean;
    onCollapseChanged?: TFn;
}
