import { ReactElement } from 'react';
import * as pgnHandleType from '../../../service/pagination-handle/type';
import * as dropdownType from '../../base/select-dropdown/type';


//// Props
export interface IProps extends pgnHandleType.ICmpAttr, pgnHandleType.IState {
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
export { pgnHandleType };