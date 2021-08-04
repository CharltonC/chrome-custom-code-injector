import { ReactElement } from "react";

//// Option
export interface IOption {
    title: ATitle;
    sortKey?: string;
    subHeader?: IOption[]
}

//// Table Header
export interface ICtxTbHeader<T = ATitle> extends IRowColTotal {
    headers: IHeader<T>[][];
}

export interface IBaseTbHeader extends Pick<IOption, 'title'> {
    ownColTotal?: number;
}

export interface ITbHeaderCache extends IRowColTotal {
    slots: IBaseTbHeader[][];
}

//// List Header
export interface ICtxListHeader<T = ATitle>  extends IRowColTotal {
    headers: IListHeader<T>[];
    gridTemplateRows: string;
    gridTemplateColumns: string;
}

export interface IBaseCtxListHeader extends IRowColTotal {
    headers: IBaseListHeader[];
}

export interface ISpanListHeader extends IHeader {
    subHeader?: ISpanListHeader[];
}

export interface IBaseListHeader extends IOption {
    ownColTotal?: number;
    subHeader?: IBaseListHeader[];
}

export interface IListHeader<T> extends IHeader<T> {
    gridColumn?: string;
    gridRow?: string;
}

//// Common
export interface IHeader<T = ATitle> {
    title: T;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
}

export interface IRowColTotal {
    rowTotal: number;
    colTotal: number;
}

type ATitle = string | ReactElement | ((...args: any[]) => ReactElement);