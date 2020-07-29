//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// State
export type ICtxTbHeader[][] = ICtxTbHeader[][];
export interface ICtxTbHeader {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
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
