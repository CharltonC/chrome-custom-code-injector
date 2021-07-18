import React, { memo } from 'react';
import { UtilHandle } from '../../../handle/util';
import { inclStaticIcon } from '../../static/icon';
import * as TIcon from '../../static/icon/type';
import { IProps } from './type';


const { cssCls } = UtilHandle.prototype;
const BASE_CLS = 'icon-switch';

export const IconSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { id, icon, label, clsSuffix, ...inputProps } = props;
    const ROOT_CLS = cssCls(BASE_CLS, clsSuffix);

    return (
        <label className={ROOT_CLS} htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />
            { icon
                ? inclStaticIcon(label as TIcon.AIcon, 'gray')
                : <span className="icon-switch__label">{label}</span> }
        </label>
    );
});