export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    ltLabel?: boolean;
    clsSuffix?: string;
}

type TFn = (...args: any[]) => void;