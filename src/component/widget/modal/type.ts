export interface IProps extends React.HTMLAttributes<HTMLElement> {
    header: string;
    subHeader?: string;
    currModalId: string;
    id: string;
    clsSuffix?: string;
    cancel?: string;
    confirm?: string;
    confirmDisabled?: boolean;
    confirmType?: 'submit' | 'button';
    onCancel: AFn;
    onConfirm?: AFn;
}

export interface IState {}

export type AFn = (...args: any[]) => any;