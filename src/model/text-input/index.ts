export class TextInputState {
    value = '';
    errMsg: string[] = [];
    isValid: boolean = null;

    constructor(args?) {
        if (!args) return;
        const { value, errMsg, isValid } = args;
        this.value = value;
        this.errMsg = errMsg;
        this.isValid = isValid;
    }
}