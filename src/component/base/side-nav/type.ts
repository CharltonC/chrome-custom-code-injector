export interface IProps extends React.HTMLAttributes<HTMLElement> {
    list: AObj[];
    listTitleKey?: string;           // def?: 'title'    parent title
    childListKey?: string;           // def: 'list'      where to find the sub list array
    childListTitleKey?: string;      // def: 'title'     child title
    activeItemIdx?: number;          // def: 0           current active parent item
    activeChildItemIdx?: number;     // def: null        current active child item under active parent item
    onClick?: (...args: any[]) => void;
}

export interface IState {}

export interface IClickEvtArg {
    evt: React.MouseEvent;
    item: AObj | string;
    parentIdx?: number;
    idx: number;
    isChild?: boolean;
}

export interface IItemAttrsQuery {
    idx: number;
    suffix: string;
    isActive: boolean;
}

export interface IItemAttrs {
    ITEM_KEY: string;
    ITEM_CLS: string;
    ITEM_TITLE_CLS: string;
}