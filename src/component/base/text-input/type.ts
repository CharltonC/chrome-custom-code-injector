
export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    validate?: IValidationConfig[];
    // TODO: regexMode: boolean
    onInputChange?: (arg: ICallback) => void;
    onInputBlur?: (arg: ICallback) => void;
}

export interface IState {
    hsValidationRules: boolean;
    isValid: boolean;       // null` is used for indicating if it has been set for the 1st time or not
    errMsg: string[];
}

export interface ICallback {
    evt: React.ChangeEvent<HTMLInputElement>;
    val: string;
    isGte3: boolean;
    validState: TValidState;
}

export type TValidState = Pick<IState, 'isValid' | 'errMsg'>;

export interface IValidationConfig {
    rule: ((val: string) => boolean) | RegExp;
    msg: string;
}
