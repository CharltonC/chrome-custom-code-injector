export interface IProps extends React.HTMLAttributes<HTMLSelectElement> {
    id: string;
    disabled?: boolean;
    list: string[];
    border?: boolean;
    selectIdx?: number;
    onSelect?: (...args: any[]) => void;
}

export interface IState {
    hsList: boolean;
    hsSelectIdx: boolean;
}