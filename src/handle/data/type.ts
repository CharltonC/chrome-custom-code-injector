import { HostRule, LibRule, PathRule } from '../../model/rule';

export interface IRuleIdCtx {
    hostId: string;
    pathId?: string;
    libId?: string;
}

export interface IRuleIdxCtx {
    hostIdx: number;
    pathIdx?: number;
    libIdx?: number;
}

export interface ISliceIdxCtx {
    startIdx: number;
    endIdx?: number;  // exclusive of itself
}

export type AAnyRule = HostRule | PathRule | LibRule;
export type AHostPathRule = HostRule | PathRule;