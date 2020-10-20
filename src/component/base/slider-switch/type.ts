export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    rtLabel?: boolean;
    clsSuffix?: string;
}