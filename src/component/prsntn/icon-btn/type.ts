import * as NIcon from '../../static/icon/type';

export interface IIcon {
    name: NIcon.TName;
    darkMode?: boolean;
}

export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: IIcon;
    // [prop: string]: any;    // any other unknown prop, e.g. className, id, onClick etc
}