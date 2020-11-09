//// Option
export interface IOption {
    showAll: boolean;
    onePerLevel: boolean;
}

//// State
export interface IState {
    [K: string]: number;
}

//// Generic Component Attribute
export interface IExpdBtnAttrQuery {
    itemCtx: TItemCtx;
    expdState: IState;
    callback: TFn;
    option: Partial<IOption>;
}

export interface IExpdBtnAttr {
    isOpen: boolean;
    onClick: TFn;
}

//// Misc
export type TExpdStateEntry = [ string, number ];

export type TItemCtx = {
    itemLvl: number;
    itemId: string;
    parentItemCtx: TItemCtx;
};

export type TFn = (...args: any[]) => any;