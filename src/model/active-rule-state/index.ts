import { HostRuleConfig, PathRuleConfig } from "../rule-config";

export class ActiveRuleState {
    item: HostRuleConfig | PathRuleConfig = null;
    isHost: boolean = null;
    ruleIdx: number = null;         // index in global data `rules` (i.e. source of truth)
    pathIdx: number = null;         // index in `rules[ruleIdx].paths`

    constructor(arg?: ActiveRuleState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}