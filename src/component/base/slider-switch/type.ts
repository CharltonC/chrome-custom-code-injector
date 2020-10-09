export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
}

export interface IState {

}

type TFn = (...args: any[]) => void;