//// Pagination Option (full)
export interface IOption {
    page: number;
    increment: number[];
    incrementIdx: number;
    maxSpread: number;
}


//// Pagination State
export interface IState extends IPageCtx, IPageSlice, IRelPage, IRecordCtx, ISpreadCtx {
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

export interface ISpreadCtx {
    ltSpread: ASpreadCtx;
    rtSpread: ASpreadCtx;
    maxSpread: number;
}

export type ASpreadCtx = (number | '...')[];


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
export interface IRelPageCtx extends ARelPageCtx {}
type ARelPageCtx = {
    [K in keyof IRelPage]: boolean;
}


//// Generic Component Attributes
export interface ICmpAttr {
    firstBtnAttr: ICmpBtnAttr;
    prevBtnAttr: ICmpBtnAttr;
    nextBtnAttr: ICmpBtnAttr;
    lastBtnAttr: ICmpBtnAttr;
    ltSpreadBtnsAttr: ICmpBtnAttr[];
    rtSpreadBtnsAttr: ICmpBtnAttr[];
    pageSelectAttr: ICmpSelectAttr;
    perPageSelectAttr: ICmpSelectAttr;
}

export interface ICmpAttrQuery {
    data: any[];
    option: IOption;
    state: IState;
    callback: AFn;
}

export interface ICmpBtnAttr extends ICommonCmpAttr {
    isSpread?: boolean;
    onClick: AFn;
}

export interface ICmpSelectAttr extends ICommonCmpAttr {
    options: (string | number)[];
    selectedOptionValue: string | number;
    selectedOptionIdx: number;
    onSelect: AFn;
}

interface ICommonCmpAttr {
    [k: string]: any;
    title: string;
    disabled?: boolean;
}

export interface ISelectEvt extends Event {
    target: HTMLSelectElement;
}

export type APageList = (string | number)[];
