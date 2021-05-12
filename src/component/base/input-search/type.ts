export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    onInputClear?: (...args: any[]) => void;
    onInputChange?: (...args: any[]) => void;
}