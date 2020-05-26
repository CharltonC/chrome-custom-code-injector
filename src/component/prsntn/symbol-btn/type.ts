export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    text: string;
    onChange?: (...args: any[]) => void
}
