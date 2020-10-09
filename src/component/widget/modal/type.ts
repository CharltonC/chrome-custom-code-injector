export interface IProps extends React.HTMLAttributes<HTMLElement> {
    header: string;
    subHeader?: string;
    initialShow?: boolean;
}

export interface IState {
    isOpen: boolean;
}

export type TFn = (...args: any[]) => any;