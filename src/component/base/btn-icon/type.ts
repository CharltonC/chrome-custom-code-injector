import * as NIcon from '../../static/icon/type';

export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: NIcon.AIcon;
    theme?: NIcon.ATheme;
    clsSuffix?: string;
}