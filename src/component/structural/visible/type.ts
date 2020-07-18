export interface IProps extends React.HTMLAttributes<HTMLElement> {
    isDefVisible?: boolean;
}

export interface IState {
    isVisible: boolean;
}

export interface IChildVisibleProps {
    isVisible: boolean;
    onVisibleChange: (...args: any[]) => void;
}