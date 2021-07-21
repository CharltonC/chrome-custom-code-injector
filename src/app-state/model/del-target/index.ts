export class DelRuleState {
    ctxIdx: number;
    parentCtxIdx: number;

    constructor(arg?: DelRuleState) {
        if (!arg) return;
        const { ctxIdx, parentCtxIdx } = arg;
        this.ctxIdx = ctxIdx;
        this.parentCtxIdx = parentCtxIdx;
    }
}