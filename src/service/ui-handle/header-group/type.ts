//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// State
export interface IState {
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

export interface ISpanCtxListHeader extends IState {
    subHeader?: ISpanCtxListHeader[];
}

export interface IBaseListHeaderCache {
    rowTotal: number;
    colTotal: number;
}

export interface IFillListHeaderCache {
    rowLvl: number;
    parentPos: number;
    rowsContainer: IState[][];
}

