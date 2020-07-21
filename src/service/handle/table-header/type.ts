//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// State
export type TRowsThCtx = IThCtx[][];

export interface IThCtx {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
}

//// Other
export type TRowsThColCtx = IThColCtx[][];

export type TRowThColCtx = IThColCtx[];

export interface IThColCtx {
    title: string;
    ownColTotal?: number;
}

export interface IThColCtxCache {
    slots: IThColCtx[][];
    colTotal: number;
}
