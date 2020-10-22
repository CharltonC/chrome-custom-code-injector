export interface IProps extends React.HTMLAttributes<HTMLElement> {
    header: string;
    subHeader?: string;
    currModalId: string;
    id: string;
    clsSuffix?: string;
    cancel?: string;
    confirm?: string;
    onCancel: TFn;
    onConfirm?: TFn;
}

export interface IState {

}

export type TFn = (...args: any[]) => any;