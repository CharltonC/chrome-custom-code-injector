export interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    list: (string | number)[];
    border?: boolean;
    selectIdx?: number;
    onSelect?: (...args: any[]) => void;
}

export interface IState {
    hsList: boolean;
    hsSelectIdx: boolean;
}