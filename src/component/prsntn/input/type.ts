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

export interface IState {
    isValid: boolean | null;
    errMsg: string[];
}