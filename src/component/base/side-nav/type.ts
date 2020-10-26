export interface IProps extends React.HTMLAttributes<HTMLElement> {
    list: IObj[];
    childKey: string;
    itemKeys: [ string, string ];
    activeItem: IObj;
    onItemClick?: (...args: any[]) => void;
}

export interface IState {
}

export interface IObj {
    [k: string]: any;
}