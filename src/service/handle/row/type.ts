//// Option
export interface IOption {
    data: any[];
    rows: IRawRowsOption[];
    visiblePath?: TVisibleNestedOption;
}

export interface IRawRowsOption extends Array<any> {
    0?: string | TFn;
    1?: TFn;
}

// other indexes except 0 are optional, e.g. [ 'nestedRowKey', ComponentClass ]
export type TVisibleNestedOption = 'ALL' | 'NONE' | string[];

//// Other
export interface IParsedRowsOption {
    rowKey?: string;
    transformFn?: TFn;
}

export interface ICtxRowsQuery {
    data: any;
    rows: IRawRowsOption[];
    rowLvl: number;
    parentPath?: string;
    visiblePath: TVisibleNestedOption;
}

export interface IRowItemCtx<T = TDefNestdItems> {
    idx: number;
    isOddRow: boolean;
    item: any;
    itemLvl: number;
    itemKey: string;
    itemPath: string;
    parentPath: string;
    isExpdByDef: boolean;
    nestedItems: T;
}

type TDefNestdItems = IRowItemCtx[];

export interface IErrMsg {
    ROW_KEY_MISSING: string;
    ROW_KEY_TYPE: string;
    PROP_DATA_TYPE: string;
}

export type TFn = (...args: any[]) => any;