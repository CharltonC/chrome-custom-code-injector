//// Props
export interface IProps extends React.HTMLAttributes<HTMLElement> {
    initial?: boolean;
    callback?: (...args: any[]) => any;
}

//// State
export interface IState {
    isOpen: boolean;
}

// TODO: use interface from row handle
//// Additional Children Props
export interface IChildExtraProps {
    expandProps?: {
        isOpen?: boolean;
        onClick?: (...args: any[]) => void;
    };
}