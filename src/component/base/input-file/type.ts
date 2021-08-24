export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    fileType: string;
    clsSuffix?: string;
    validate?: AValidationConfig[];
    onFileChange?: (...args: any[]) => any;
}

export interface IState {
    isValid: boolean;
    errMsg: string[];
}

export type AValidationConfig = IConfigValidator | ACustomValidator;
export interface IConfigValidator {
    rule: ((val: File) => boolean);
    msg: string;
}
export type ACustomValidator = (val: File) => Promise<boolean | string[]>;

export interface IOnFileChange extends IState {
    file: File;
}