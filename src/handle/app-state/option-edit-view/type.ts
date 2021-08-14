import { LibRule, HostRule, PathRule } from "../../../model/rule";
import { ALibType, AActiveTabIdx } from "../../../model/rule/type";
import { RuleIdCtxState } from "../../../model/rule-id-ctx-state";

export interface IOnLibRowSelectTogglePayload {
    id: string;
    libs: LibRule[];
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
    item: HostRule | PathRule;
    parentIdx?: number;
    isChild?: boolean;
}
