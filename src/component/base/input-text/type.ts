export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    onInputChange?: AFn<void>;
    onInputBlur?: AFn<void>;
    validation?: {
        rules?: IValidationRule[];
        fixedPosErrMsg?: boolean;
        isValid?: boolean;         // null` is used for indicating if it has been set for the 1st time or not
        errMsg?: string[];
    };
}

export interface IValidationRule {
    rule: ((val: string) => boolean) | RegExp;
    msg: string;
}

export type IValidationState = {
    isValid: boolean;
    errMsg: string[];
};
