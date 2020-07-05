export interface IProps extends React.HTMLAttributes<HTMLElement> {
    isAsc?: boolean;
    onClick?: (...args: any[]) => any;
}