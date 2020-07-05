export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isAsc?: boolean;
    onClick?: (...args: any[]) => any;
}