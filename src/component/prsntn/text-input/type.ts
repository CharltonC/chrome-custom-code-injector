export interface IValidationConfig {
    rule: ((val: string) => boolean) | RegExp;
    msg: string;
}

export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    text?: string;
    validate?: IValidationConfig[];
    onInputChange?: (...args: any[]) => void;
    onInputBlur?: (...args: any[]) => void;
}

/**
 * Internal state only
 */
export interface IState {
    hsExtState: boolean;
    hsValidationRules: boolean;
    isValid: boolean;       // null` is used for indicating if it has been set for the 1st time or not
    errMsg: string[];
}