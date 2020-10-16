export interface IProps extends React.HTMLAttributes<HTMLElement> {
    headers: [ string, string? ];
    currModalId: string;
    id: string;
    onHide?: TFn;
}

export interface IState {

}

export type TFn = (...args: any[]) => any;