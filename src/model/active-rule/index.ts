export class ActiveRuleState {
    isHost: boolean = null;
    idx: number = null;
    pathIdx: number = null; // i.e.`.paths[pathIdx]`

    constructor(arg?: ActiveRuleState) {
        if (!arg) return;

        const { isHost, idx, pathIdx } = arg;
        this.isHost = !!isHost;
        this.idx = idx;
        this.pathIdx = pathIdx;
    }
}