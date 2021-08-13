import { HostRuleConfig } from '../../../data/model/rule-config';

export interface IOnDelHostsModalPayload {
    srcRules: HostRuleConfig[];
    sliceIdxCtx: {
        startIdx: number;
        endIdx: number;
    };
}
