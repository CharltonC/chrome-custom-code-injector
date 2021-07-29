export interface IOption {
    isAll: boolean;
    rowsCtx?: IRowCtx;
    currState: IState;
}

export interface IState {
    areAllRowsSelected: boolean;
    selectedRowKeyCtx: ISelectedRowKeyCtx;
}

export interface ISelectedRowKeyCtx {
    [s: string]: boolean;
}

export interface IRowCtx {
    rows: IObjWithId[]
    rowKey: string;
}

interface IObjWithId {
    id: string;
    [k: string]: any;
}