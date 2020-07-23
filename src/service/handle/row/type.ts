//// Option
export interface IOption {
    data: any[];
    rows: IRawRowsOption[];
    showAll?: boolean;
}

export interface IRawRowsOption extends Array<any> {
    0?: string | TFn;
    1?: TFn;
}

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
    showAll: boolean;
}

export interface IRowItemCtx<T = TDefNestdItems> {
    idx: number;
    rowType: TRowType;
    item: any;
    itemLvl: number;
    itemKey: string;
    itemPath: string;
    parentPath: string;
    isExpdByDef: boolean;
    nestedItems: T;
}

type TDefNestdItems = IRowItemCtx[];

export type TRowType = 'odd' | 'even';

export interface IErrMsg {
    ROW_KEY_MISSING: string;
    ROW_KEY_TYPE: string;
    PROP_DATA_TYPE: string;
}

export type TFn = (...args: any[]) => any;