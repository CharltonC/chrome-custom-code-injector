// other indexes except 0 are optional, e.g. [ 'nestedRowKey', ComponentClass ]
export interface IClpsRowConfig extends Array<any> {
    0: string;
    1: (...args: any[]) => any;
}

export type TClpsShowTarget = 'ALL' | 'NONE' | string[];

interface IRowStateBaseReq {
    rowConfig: IClpsRowConfig[];
    rowLvl: number;
    prefixCtx: string;
    showTargetCtx: TClpsShowTarget;
}

export interface IRowStateReq extends IRowStateBaseReq{
    data: any[];
}

export interface INestedRowStateReq extends IRowStateBaseReq {
    row: Record<string, any>
}

export interface IRowCtx {
    rowCtx: string;
    nestedRowCtx: string;
}

export interface IRowState extends IRowCtx {
    idx: number;
    isOpen: boolean;
    row: any;
    rowCtx: string;
    nestedRows: any[];
}
