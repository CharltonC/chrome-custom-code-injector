import { HostRuleConfig, LibRuleConfig, PathRuleConfig } from '../model/rule-config';

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

export type AAnyRule = HostRuleConfig | PathRuleConfig | LibRuleConfig;
export type AHostPathRule = HostRuleConfig | PathRuleConfig;