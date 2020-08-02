//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// State
export interface IState {
    rowTotal: number;
    colTotal: number;
    headers: IHeader[] | IHeader[][];
}

export interface IHeader {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
}

//// Table Header
export interface IBaseCtxTbHeader {
    title: string;
    ownColTotal?: number;
}

export interface ITbHeaderCache {
    slots: IBaseCtxTbHeader[][];
    colTotal: number;
    rowTotal: number;
}

//// List Header
export interface IBaseCtxListHeaders {
    colTotal: number;
    rowTotal: number;
    baseCtxHeaders: IBaseCtxListHeader[];
}

export interface IBaseCtxListHeader extends IOption {
    ownColTotal?: number;
    subHeader?: IBaseCtxListHeader[];
}

export interface ISpanCtxListHeader extends IHeader {
    subHeader?: ISpanCtxListHeader[];
}

export interface IBaseListHeaderCache {
    rowTotal: number;
    colTotal: number;
}
