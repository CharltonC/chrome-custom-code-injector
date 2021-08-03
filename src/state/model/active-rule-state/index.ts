export class RuleIdCtxState {
    hostId: string;
    pathId?: string;
    libId?: string;

    constructor(arg?: RuleIdCtxState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}