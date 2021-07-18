export class RuleValidState {
    isIdValid: boolean;
    isValueValid: boolean;

    constructor(isIdValid: boolean = false, isValueValid: boolean = false) {
        this.isIdValid = isIdValid;
        this.isValueValid = isValueValid;
    }
}