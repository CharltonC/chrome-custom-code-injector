export interface ISliceIdx {
    startIdx: number;
    endIdx: number;
}

export interface ISliceScope {
    list: any[];
    noPerPage: number;
    lastIdx: number;
}

export interface ISliceValidity {
    pageIdx: boolean;
    noOfPage: boolean;
}

export interface IPerPageConfig {
    // TODO: validate these props & add to validity result
    incrm?: number | number[];
    currIncrmIdx?: number;
}

export interface IState {
    slice?: {
        curr: ISliceIdx;
        prev: ISliceIdx;
        next: ISliceIdx;
        last: ISliceIdx;
    };
    currPage?: number;
    noOfPages?: number;
    noPerPage?: number;
    lastPage?: number;
    validity?: ISliceValidity;
}
