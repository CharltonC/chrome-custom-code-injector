import React, { memo } from 'react';
import { UtilHandle } from '../../../service/handle/util';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

const { cssCls } = UtilHandle.prototype;
const CSS_BASE_CLS: string = 'icon-btn';

export const IconBtn = memo(({icon, theme, clsSuffix, ...props}: IProps) => {
    const CSS_CLS: string = cssCls(CSS_BASE_CLS, clsSuffix);
    return (
        <button type="button" className={CSS_CLS} {...props}>
            { inclStaticIcon(icon, theme) }
        </button>
    );
});