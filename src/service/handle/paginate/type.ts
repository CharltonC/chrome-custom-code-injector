//// Pagination State/Status
export interface IPgnStatus extends IPageCtx, IPageSlice, IRelPage, IRecordCtx {
    perPage: number;
    totalPage: number;
}

export interface IPageCtx {
    curr: number;
    pageNo: number;
}

export interface IPageSlice {
    startIdx: number;
    endIdx: number;
}

export type IRelPage = {
    first: number;
    prev: number;
    next: number;
    last: number;
}

export interface IRecordCtx {
    totalRecord: number;
    startRecord: number;
    endRecord: number;
}


//// Pagination Option (full)
export interface IOption {
    page: number;
    increment: number;
    incrementIdx: number;
}


//// Pagination Request/Query
// Current Page Index Range
export interface IPageRange {
    curr: number;
    last: number;
}

// Navigation Target Request
export interface IPageNavQuery {
    type: string;
    target?: number;
}

// Whether relevant pages are navigatable
export interface IRelPageCtx extends TRelPageCtx {}
type TRelPageCtx = {
    [K in keyof IRelPage]: boolean;
}
