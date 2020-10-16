export interface IProps extends React.HTMLAttributes<HTMLElement> {
    headers: [ string, string? ];
    currModalId: string;
    id: string;
    onHide?: TFn;
    bodyClass?: string;
}

export interface IState {

}

export type TFn = (...args: any[]) => any;