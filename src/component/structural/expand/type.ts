//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    initial?: boolean;
    callback?: (...args: any[]) => any;
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