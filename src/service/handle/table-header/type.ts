export interface IThOption {
    title: string;
    subHeader?: IThOption[]
}

export interface IThInfo {
    title: string;
    ownColSum?: number;
}

export interface IThInfoCache {
    slots: IThInfo[][];
    grossColSum: number;
}

export interface IThProps {
    title: string;
    rowSpan: number;
    colSpan: number;
}