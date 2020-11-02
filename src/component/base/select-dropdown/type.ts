export interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    ltLabel?: boolean;
    clsSuffix?: string;
    border?: boolean;
    list: (string | number)[];
    listTxtTransform?: (...args: any[]) => string;   // transform the list item text
    selectIdx?: number;                              // index in `list`
    onSelect?: (...args: any[]) => void;
}

export interface IState {
    hsList: boolean;
    hsSelectIdx: boolean;
}