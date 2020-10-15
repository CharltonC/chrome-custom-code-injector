export interface IProps extends React.HTMLAttributes<HTMLElement> {
    list: IObj[];
    childKey: string;
    itemKeys: [ string, string ];
    onActiveItemChange?: (...args: any[]) => void;
}

export interface IState {
    atvLsIdx: number;
    atvNestLsIdx: number;
}

export interface IObj {
    [k: string]: any;
}