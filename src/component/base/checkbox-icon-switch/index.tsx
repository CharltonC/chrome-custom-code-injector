import React, { memo } from 'react';
import { UtilHandle } from '../../../service/handle/util-handle';
import { inclStaticIcon } from '../../static/icon';
import * as NIcon from '../../static/icon/type';
import { IProps } from './type';


const { cssCls } = UtilHandle.prototype;
const CSS_BASE_CLS: string = 'icon-switch';

export const IconSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { id, icon, label, clsSuffix, ...inputProps } = props;
    const CSS_CLS: string = cssCls(CSS_BASE_CLS, clsSuffix);

    return (
        <label className={CSS_CLS} htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />
            { icon ?
                inclStaticIcon(label as NIcon.TIcon, 'gray') :
                <span className="icon-switch__label">{label}</span> }
        </label>
    );
});