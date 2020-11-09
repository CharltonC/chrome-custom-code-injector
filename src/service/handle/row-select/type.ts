export interface IOption {
    isAll: boolean;
    rowsCtx?: IRowsContext;
    currState: IState;
}

export interface IState {
    areAllRowsSelected: boolean;
    selectedRowsIndexes: ISelectedRowIndexes;
}

export interface ISelectedRowIndexes {
    [s: string]: boolean;
}

export interface IRowsContext {
    startRowIdx: number;
    endRowIdx: number;      // non-inclusive
    rowIdx: number;         // must be within `startIdx` and `endRowidx`
}