export class ActiveRuleState {
    isHost: boolean = null;
    idx: number = null;
    pathIdx: number = null; // i.e.`.paths[pathIdx]`

    constructor(arg?: ActiveRuleState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}