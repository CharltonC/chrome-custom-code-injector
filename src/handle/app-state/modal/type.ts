import { HostRule } from '../../../model/rule';

export interface IOnDelHostsModalPayload {
    srcRules: HostRule[];
    sliceIdxCtx: {
        startIdx: number;
        endIdx: number;
    };
}
