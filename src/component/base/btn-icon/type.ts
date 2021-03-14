import * as TIcon from '../../static/icon/type';

export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: TIcon.AIcon;
    theme?: TIcon.ATheme;
    clsSuffix?: string;
}