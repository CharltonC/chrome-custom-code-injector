// other indexes except 0 are optional, e.g. [ 'nestedRowKey', ComponentClass ]
export interface IClpsRowConfig {
    0: string;
}
export type TClpsShowTarget = 'ALL' | 'NONE' | string[];

export interface IClpsState {
    [k: string]: boolean;
}