//// Option
export interface IOption {
    showAll: boolean;
    onePerLevel: boolean;
}

//// State
export interface IState {
    [K: string]: number;    // number value is the item level the row represents
}

//// Generic Component Attribute
export interface IExpdBtnAttrQuery {
    itemCtx: TItemCtx;
    expdState: IState;
    callback: AFn;
    option: Partial<IOption>;
}

export interface IExpdBtnAttr {
    isOpen: boolean;
    onClick: AFn;
}

//// Misc
export type AExpdStateEntry = [ string, number ];

export type TItemCtx = {
    itemLvl: number;
    itemId: string;
    parentItemCtx: TItemCtx;
};

export type AFn = (...args: any[]) => any;