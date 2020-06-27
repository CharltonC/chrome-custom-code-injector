// other indexes except 0 are optional, e.g. [ 'nestedRowKey', ComponentClass ]
export type TClpsShowTarget = 'ALL' | 'NONE' | string[];

export type TData = any[] | Record<string, any>;

export type TFn = (...args: any[]) => any;

export interface IUserRowConfig extends Array<any> {
    0?: string | TFn;
    1?: TFn;
}

export interface IRowConfig {
    rowKey?: string;
    transformFn?: TFn;
}

export interface IItemsReq {
    data: TData;
    rowConfigs: IUserRowConfig[];
    rowLvl: number;
    parentCtx?: string;
    showTargetCtx: TClpsShowTarget;
}

export interface IItems {
    idx: number;
    item: any;
    itemLvl: number;
    itemKey: string;
    itemCtx: string;
    parentCtx: string;
    nestedItems: any[];
    isDefNestedOpen: boolean;
}

export interface IErrMsg {
    ROW_KEY_MISSING: string;
    ROW_KEY_TYPE: string;
    PROP_DATA_TYPE: string;
}