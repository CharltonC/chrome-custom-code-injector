export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    fileType: string;
    clsSuffix?: string;
    validate?: IValidationConfig[];
    onFileChange?: (...args: any[]) => any;
}

export interface IState {
    isValid: boolean;
    errMsg: string[];
}

export interface IValidationConfig {
    rule: ((val: File) => boolean);
    msg: string;
}