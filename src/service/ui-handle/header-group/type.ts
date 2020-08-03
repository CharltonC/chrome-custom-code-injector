//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// Table Header
export interface ICtxTbHeader extends IRowCol {
    headers: IHeader[][];
}

export interface IBaseTbHeader extends Pick<IOption, 'title'> {
    ownColTotal?: number;
}

export interface ITbHeaderCache extends IRowCol {
    slots: IBaseTbHeader[][];
}

//// List Header
export interface ICtxListHeader extends IRowCol {
    headers: IHeader[];
    gridTemplateRows: string;
    gridTemplateColumns: string;
}

export interface IBaseCtxListHeader extends IRowCol {
    headers: IBaseListHeader[];
}

export interface ISpanListHeader extends IHeader {
    subHeader?: ISpanListHeader[];
}

export interface IBaseListHeader extends IOption {
    ownColTotal?: number;
    subHeader?: IBaseListHeader[];
}

//// Common
export interface IHeader {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
    gridColumn?: string;
    gridRow?: string;
}

export interface IRowCol {
    rowTotal: number;
    colTotal: number;
}
