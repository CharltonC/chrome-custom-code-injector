export class ActiveRuleState {
    hostId: string;
    pathId?: string;
    libId?: string;

    constructor(arg?: ActiveRuleState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}