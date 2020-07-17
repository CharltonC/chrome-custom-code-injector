//// Option
export interface IOption {
    key: string;
    isAsc: boolean;
    hsLocale?: boolean;
    reset?: boolean;
}

export type TLsItem = Record<string, any>;
export type TStrSortOrder =  0 | 1 | -1;

export type TFn = (...args: any[]) => any;