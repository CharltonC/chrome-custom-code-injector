export class ActiveRuleState {
    type: 'host' | 'path' | 'lib';
    hostId: string;
    pathId?: string;
    libId?: string;

    constructor(arg?: ActiveRuleState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}