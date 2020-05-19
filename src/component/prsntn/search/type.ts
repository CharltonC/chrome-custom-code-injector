export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    text?: string;
    disabled?: boolean;
    onClear?: (...args: any[]) => void;
    onChange?: (...args: any[]) => void;
}

export type cbFn = (...args: any[]) => void;