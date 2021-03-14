export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    ltLabel?: boolean;
    clsSuffix?: string;
}