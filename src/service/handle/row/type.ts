//// Option
export interface IOption {
    data: any[];
    rows: IRawRowsOption[];
    rowIdKey: TRowIdKeyOption;
    showAll?: boolean;
    pgnStartIdx: number;   // actual inclusive index of item in the array when there is pagination (def: 0)
}

export interface IRawRowsOption extends Array<any> {
    0?: string | TFn;
    1?: TFn;
}
export interface IParsedRowsOption {
    rowKey?: string;
    transformFn?: TFn;
}

export type TRowIdKeyOption = string | ((...args: any[]) => string);

//// Other
export interface ICtxRowsQuery {
    data: any;
    rows: IRawRowsOption[];
    rowLvl: number;
    rowIdKey: TRowIdKeyOption;
    pgnStartIdx: number;
    parentPath?: string;
    parentItemCtx?: IRowItemCtx<any>;
    showAll: boolean;
}

export interface IRowItemCtx<T = TDefNestdItems> extends IRowItemBaseCtx {
    itemId: string;
    isExpdByDef: boolean;
    nestedItems: T;
    parentItemCtx?: IRowItemCtx<T>;
}

export interface IRowItemBaseCtx {
    ctxIdx: number;         // actual idx of item in full set of data (w/o pagination)
    idx: number;
    rowType: TRowType;
    item: any;
    itemLvl: number;
    itemKey: string;
    itemPath: string;
    parentPath: string;
}

type TDefNestdItems = IRowItemCtx[];

export type TRowType = 'odd' | 'even';

export interface IErrMsg {
    ROW_KEY_MISSING: string;
    ROW_KEY_TYPE: string;
    PROP_DATA_TYPE: string;
}

export type TFn = (...args: any[]) => any;
