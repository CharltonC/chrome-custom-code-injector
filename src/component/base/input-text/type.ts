export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    validate?: IValidationConfig[];
    fixedPosErrMsg?: boolean;
    // TODO: regexMode: boolean
    onInputChange?: (arg: ICallback) => void;
    onInputBlur?: (arg: ICallback) => void;
}

export interface IState {
    hsValidation: boolean;
    isValid: boolean;       // null` is used for indicating if it has been set for the 1st time or not
    errMsg: string[];
}

export interface ICallback {
    evt: React.ChangeEvent<HTMLInputElement>;
    val: string;
    isGte3: boolean;
    validState: AValidState;
}

export type AValidState = Pick<IState, 'isValid' | 'errMsg'>;

export interface IValidationConfig {
    rule: ((val: string) => boolean) | RegExp;
    msg: string;
}
