export interface IProps extends React.HTMLAttributes<HTMLElement> {
    headerText: string;
    subHeaderText?: string;
}

export interface IState {
    isOpen: boolean;
}

export type TFn = (...args: any[]) => any;