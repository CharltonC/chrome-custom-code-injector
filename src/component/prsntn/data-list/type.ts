import { ReactElement } from "react";

export type TCmpCls = React.FC<any> | React.ComponentClass<any>;

export type TRow = [string, TCmpCls];

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    data: any[];
    row: TRow[];
    header?: TCmpCls;
}

export interface IState {

}

export interface INestedRowProps extends React.HTMLAttributes<HTMLElement> {
    item: {[k: string]: any};
    nestedRow?: ReactElement;
}