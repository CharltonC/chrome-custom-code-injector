import { LibRuleConfig, HostRuleConfig, PathRuleConfig } from "../../../data/model/rule-config";
import { ALibType, AActiveTabIdx } from "../../../data/model/rule-config/type";
import { RuleIdCtxState } from "../../model/rule-id-ctx-state";

export interface IOnLibRowSelectTogglePayload {
    id: string;
    libs: LibRuleConfig[];
}

export interface IOnActiveTabChangePayload {
    ruleIdCtx: RuleIdCtxState;
    idx: AActiveTabIdx;
}

export interface IOnTabTogglePayload {
    ruleIdCtx: RuleIdCtxState;
    tab: Record<string, any>;
}

export interface IOnCodeChangePayload {
    ruleIdCtx: RuleIdCtxState;
    codeKey: 'jsCode' | 'cssCode';
    codeMirrorArgs: [unknown, unknown, string];
}

export interface IOnLibTypeChangePayload {
    id: string;
    selectValue: ALibType;
}

export interface IOnActiveRuleChangePayload {
    item: HostRuleConfig | PathRuleConfig;
    parentIdx?: number;
    isChild?: boolean;
}
