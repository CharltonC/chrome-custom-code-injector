//// Option
export interface IOption {
    key: string;
    isAsc: boolean;
    hsLocale?: boolean;
    reset?: boolean;
}

//// State
export interface IState {
    data: ALsItem[];
}

//// Generic UI Component Attribute Related
export interface ICmpAttrQuery {
    data: ALsItem[];
    option: IOption;
    callback: AFn;
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
    onClick: AFn;
}

//// Misc
export type ALsItem = Record<string, any>;
export type AFn = (...args: any[]) => any;
export type AStrSortOrder = 0 | 1 | -1;