export class DelTarget {
    ctxIdx: number;
    parentCtxIdx: number;

    constructor(ctxIdx: number = null, parentCtxIdx: number = null) {
        this.ctxIdx = ctxIdx;
        this.parentCtxIdx = parentCtxIdx;
    }
}