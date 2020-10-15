export interface IList {
    id: string;
}

export interface INestList {
    id: string;
    nestList?: IList[];
}

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    list: INestList[];
    onActiveItemChange?: (...args: any[]) => void;
}

export interface IState {
    atvLsIdx: number;
    atvNestLsIdx: number;
}