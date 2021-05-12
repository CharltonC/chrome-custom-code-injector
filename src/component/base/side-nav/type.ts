export interface IProps extends React.HTMLAttributes<HTMLElement> {
    list: AObj[];
    childKey: string;
    itemKeys: [ string, string ];
    activeItem: AObj;
    onItemClick?: (...args: any[]) => void;
}

export interface IState {}
