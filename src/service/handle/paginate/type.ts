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

export interface IPageCtx {
    curr: number;
    pageNo: number;
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

export interface IRecordCtx {
    totalRecord: number;
    startRecord: number;
    endRecord: number;
}

export interface IPgnState extends IPageCtx, IPageSlice, IRelPage, IRecordCtx {
    perPage: number;
    totalPage: number;
}
