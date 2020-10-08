export interface IProps extends React.HTMLAttributes<HTMLElement> {
    headerText: string;
    subHeaderText?: string;
    initialShow?: boolean;
}

export interface IState {
    isOpen: boolean;
}

export type TFn = (...args: any[]) => any;