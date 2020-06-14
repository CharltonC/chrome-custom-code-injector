export interface IPageQuery {
    type: string;
    currPage?: number;
    lastPage: number;
    targetPage: number;
}

export interface IPageSlice {
    startIdx: number;
    endIdx: number;
}

export interface IState extends IPageSlice {
    noPerPage: number;
    noOfPages: number;
    first: number;
    prev: number;
    next: number;
    last: number;
    currPage: number;
    error?: Record<string, boolean>;
}