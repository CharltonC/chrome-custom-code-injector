//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// State
export interface ICtxTbHeader {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
}

export interface ICtxListHeader extends ICtxTbHeader {
    subHeader: ICtxListHeader[];
}

//// Other
export interface IBaseCtxTbHeader {
    title: string;
    ownColTotal?: number;
}

export interface ITbHeaderCache {
    slots: IBaseCtxTbHeader[][];
    colTotal: number;
}

export interface IBaseCtxListHeader extends IOption {
    ownColTotal?: number;
    subHeader: IBaseCtxListHeader[];
}

export interface IListHeaderCache {
    rowTotal: number;
    colTotal: number;
}
