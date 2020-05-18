export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    text: string;
    id: string;
    disabled: boolean;
    onSearch: (...args: any[]) => void;
    onClear: (...args: any[]) => void;
    onChange: (...args: any[]) => void;
}