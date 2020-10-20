export interface IProps extends React.HTMLAttributes<HTMLElement> {
    header: string;
    subHeader?: string;
    currModalId: string;
    id: string;
    cancel?: string;
    confirm?: string;
    onHide: TFn;
    onCancel?: TFn;
    onConfirm?: TFn;
}

export interface IState {

}

export type TFn = (...args: any[]) => any;