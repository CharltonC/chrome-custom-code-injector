export interface IOption {
    isAll: boolean;
    rowsCtx?: IRowCtx;
    currState: IState;
}

export interface IState {
    areAllRowsSelected: boolean;
    selectedRowKeyCtx: ISelectedRowKeyCtx;
}

export interface IDistillState {
    // single/multiple selected (not all)
    isPartiallySelected: boolean;

    // single/multiple/all selected
    hasSelected: boolean;
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