import { ReactElement } from 'react';
import * as TPgnHandle from '../../../../service/pagination-handle/type';
import * as dropdownType from '../../../base/select-dropdown/type';


//// Props
export interface IProps extends TPgnHandle.ICmpAttr, TPgnHandle.IState {
}


//// Partial Props
export interface IBtnProps {
    type: 'button',
    className: string;
    disabled?: boolean;
    key?: string;
    children?: ReactElement | ReactElement[] | string;
    onClick: (...args: any[]) => any;
}

export interface ISelectProps extends dropdownType.IProps {
}

//// Reexport
export { TPgnHandle };