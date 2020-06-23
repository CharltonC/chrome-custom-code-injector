import { ReactElement } from "react";

export type TCmpCls = React.FC<any> | React.ComponentClass<any>;

export type TFn = (...args: any[]) => any;

export interface IRow extends Array<any> {
    0: string | TCmpCls;
    1?: TCmpCls;
}

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: any[];
    rows: IRow[];
    header?: TCmpCls;
    collapse?: any;
}

export interface IState {

}

export interface INestedRowProps extends React.HTMLAttributes<HTMLElement> {
    item: {[k: string]: any};
    nestedRow?: ReactElement;
}