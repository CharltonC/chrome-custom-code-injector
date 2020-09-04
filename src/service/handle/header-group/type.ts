//// Option
export interface IOption {
    title: string;
    sortKey?: string;
    subHeader?: IOption[]
}

//// Table Header
export interface ICtxTbHeader extends IRowColTotal {
    headers: IHeader[][];
}

export interface IBaseTbHeader extends Pick<IOption, 'title'> {
    ownColTotal?: number;
}

export interface ITbHeaderCache extends IRowColTotal {
    slots: IBaseTbHeader[][];
}

//// List Header
export interface ICtxListHeader extends IRowColTotal {
    headers: IListHeader[];
    gridTemplateRows: string;
    gridTemplateColumns: string;
}

export interface IBaseCtxListHeader extends IRowColTotal {
    headers: IBaseListHeader[];
}

export interface ISpanListHeader extends IHeader {
    subHeader?: ISpanListHeader[];
}

export interface IBaseListHeader extends IOption {
    ownColTotal?: number;
    subHeader?: IBaseListHeader[];
}

export interface IListHeader extends IHeader {
    gridColumn?: string;
    gridRow?: string;
}

//// Common
export interface IHeader {
    title: string;
    sortKey?: string;
    rowSpan?: number;
    colSpan?: number;
}

export interface IRowColTotal {
    rowTotal: number;
    colTotal: number;
}
