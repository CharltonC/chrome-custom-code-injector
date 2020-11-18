//// Option
export interface IOption {
    key: string;
    isAsc: boolean;
    hsLocale?: boolean;
    reset?: boolean;
}

//// State
export interface IState {
    data: TLsItem[];
}

//// Generic UI Component Attribute Related
export interface ICmpAttrQuery {
    data: TLsItem[];
    option: IOption;
    callback: TFn;
}

export interface ICmpAttr {
    sortBtnAttr: ICmpSortBtnAttr;
}

export interface ICmpSortBtnAttr {
    disabled: boolean;

    // up/dn arrow highlight state for the sort btn
    // - o highlight state for non-current header or if current header sort is temp. off
    isAsc: boolean;

    // // handler for sort btn
    onClick: TFn;
}

//// Misc
export type TLsItem = Record<string, any>;
export type TFn = (...args: any[]) => any;
export type TStrSortOrder = 0 | 1 | -1;