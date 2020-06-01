export interface IList {
    name: string;
    nestedList?: string[];
}

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    list: IList[];
}

export interface IState {
    atvIdx: number;
}