//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    show?: boolean;
    toggle?: boolean;
}

//// State
export interface IState {
    isVisible: boolean;
    toggle?: boolean;
}

//// Additional Children Props
export interface IChildExtraProps {
    style?: { display: string; };
    toggleProps?: {
        isVisible?: boolean;
        onVisibleChange?: (...args: any[]) => void;
    };
}