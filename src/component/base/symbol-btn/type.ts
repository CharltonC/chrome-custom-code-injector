export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    text: string;
    isChecked?: boolean;
    onChecked?: (...args: any[]) => void;
}
