import React, { memo } from 'react';
import { UtilHandle } from '../../../service/handle/util';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

const { cssCls } = UtilHandle.prototype;
const CSS_BASE_CLS: string = 'icon-switch';

export const IconSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { id, icon, theme, clsSuffix, ...inputProps } = props;
    const CSS_CLS: string = cssCls(CSS_BASE_CLS, clsSuffix);

    return (
        <label className={CSS_CLS} htmlFor={id}>
            <input
                type="checkbox"
                className="icon-switch__checkbox"
                id={id}
                name={id}
                {...inputProps}
                />
            { inclStaticIcon(icon, theme) }
        </label>
    );
});