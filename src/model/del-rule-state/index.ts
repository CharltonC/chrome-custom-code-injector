export class DelRuleState {
    ctxIdx: number;
    parentCtxIdx: number;

    constructor(arg?: DelRuleState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}