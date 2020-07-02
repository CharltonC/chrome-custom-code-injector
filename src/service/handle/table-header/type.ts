export interface IThConfig {
    title: string;
    subHeader?: IThConfig[]
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
    rowSpan: number;
    colSpan: number;
}