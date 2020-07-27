export type TRowsExpdState = Record<string, number>;

export type TRowsExpdStateEntry = [string, number];

export interface IRowExpdCmpAttrQuery {
    itemCtx: TItemCtx;
    currExpdState: TRowsExpdState;
    callback: TFn;
}

export type TRowExpdCmpAttr = {
    isOpen: boolean;
    onClick: TFn;
};

export type TItemCtx = {
    itemLvl: number;
    itemId: string;
    parentItemCtx: TItemCtx;
};

export type TFn = (...args: any[]) => any;