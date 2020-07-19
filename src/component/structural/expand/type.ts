//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    initial?: boolean;
}

//// State
export interface IState {
    isOpen: boolean;
}

//// Additional Children Props
export interface IChildExtraProps {
    toggleProps?: {
        isOpen?: boolean;
        onToggle?: (...args: any[]) => void;
    };
}