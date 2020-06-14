export interface ISlice {
    startIdx: number;
    endIdx: number;
}

export interface IPerPageConfig {
    // TODO: validate these props & add to validity result
    increment?: number | number[];
    incrementIdx?: number;
}

export interface IState {
    noPerPage: number;
    noOfPages: number;
    firstPage: number;
    prevPage: number;
    nextPage: number;
    lastPage: number;
    currPage: number;
    currSlice: ISlice;
    error?: Record<string, boolean>;
}
