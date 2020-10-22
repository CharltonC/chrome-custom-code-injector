export interface IProps extends React.HTMLAttributes<HTMLElement> {
    header: string;
    subHeader?: string;
    currModalId: string;
    id: string;
    clsSuffix?: string;
    cancel?: string;
    confirm?: string;
    confirmDisabled?: boolean;
    onCancel: TFn;
    onConfirm?: TFn;
}

export interface IState {

}

export type TFn = (...args: any[]) => any;