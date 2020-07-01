export interface IThOption {
    title: string;
    subHeader?: IThOption[]
}

export interface IThInfo {
    title: string;
    ownColTotal?: number;
}

export interface IThInfoCache {
    slots: IThInfo[][];
    colTotal: number;
}

export interface IThProps {
    title: string;
    rowSpan: number;
    colSpan: number;
}