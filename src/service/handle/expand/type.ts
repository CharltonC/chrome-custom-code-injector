//// Option
export interface IOption {
    data: any[];
    rows: IRawRowConfig[];
    visiblePath?: TVisibleNestablePath;
}

// other indexes except 0 are optional, e.g. [ 'nestedRowKey', ComponentClass ]
export type TVisibleNestablePath = 'ALL' | 'NONE' | string[];

export type TData = any[] | Record<string, any>;

export type TFn = (...args: any[]) => any;

export interface IRawRowConfig extends Array<any> {
    0?: string | TFn;
    1?: TFn;
}

export interface IParsedRowConfig {
    rowKey?: string;
    transformFn?: TFn;
}

export interface IItemsCtxReq {
    data: TData;
    rows: IRawRowConfig[];
    rowLvl: number;
    parentPath?: string;
    visiblePath: TVisibleNestablePath;
}

export interface IItemCtx {
    idx: number;
    item: any;
    itemLvl: number;
    itemKey: string;
    itemPath: string;
    parentPath: string;
    nestedItems: any[];
    isExpdByDef: boolean;
}

export interface IErrMsg {
    ROW_KEY_MISSING: string;
    ROW_KEY_TYPE: string;
    PROP_DATA_TYPE: string;
}