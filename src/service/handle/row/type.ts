//// Option
export interface IOption {
    data: any[];
    rows: IRawRowsOption[];
    rowIdKey: TRowIdKeyOption;
    showAll?: boolean;
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

//// State (for Showing One Expand per level feature only)
export type TRowsExpdState = Record<string, number>;

export type TRowsExpdStateEntry = [string, number];

export interface IRowExpdCmpAttrQuery {
    itemCtx: IRowItemCtx;
    isOpen: boolean;
    currExpdState: TRowsExpdState;
    callback: TFn;
}

export type TRowExpdCmpAttr = {
    isOpen: boolean;
    onClick: TFn;
};


//// Other
export interface ICtxRowsQuery {
    data: any;
    rows: IRawRowsOption[];
    rowLvl: number;
    rowIdKey: TRowIdKeyOption;
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
