export interface IPageRange {
    curr: number;
    last: number;
}

export interface IPageSlice {
    startIdx: number;
    endIdx: number;
}

export interface IPageNavQuery {
    type: string;
    target?: number;
}

export type IRelPage = {
    first: number;
    prev: number;
    next: number;
    last: number;
}

type TRelPageCtx = {
    [K in keyof IRelPage]: boolean;
}

export interface IRelPageCtx extends TRelPageCtx {}

export interface IPageState extends IPageSlice, IRelPage {
    perPage: number;
    totalPage: number;
    curr: number;
}
