export class TextInputState {
    value? = '';
    errMsg?: string[] = [];
    isValid?: boolean = null;

    constructor(arg?: TextInputState) {
        if (!arg) return;
        Object.assign(this, arg);
    }
}