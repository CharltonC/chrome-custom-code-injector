export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    defaultValue: string;
    onInputClear?: (arg: IOnInputClearArg) => void;
    onInputChange?: (arg: IOnInputChangeArg) => void;
}

export interface IOnInputChangeArg {
    evt: React.ChangeEvent<HTMLInputElement>;
    value: string;
    isGte3Char: boolean;
}

export interface IOnInputClearArg {
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>;
}