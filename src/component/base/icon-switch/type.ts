export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: boolean;
    clsSuffix?: string | string[];
}