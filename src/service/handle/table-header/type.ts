export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

export interface IThColCtx {
    title: string;
    ownColTotal?: number;
}

export interface IThColCtxCache {
    slots: IThColCtx[][];
    colTotal: number;
}

export interface IThCtx {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
}