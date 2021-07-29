import React, { memo } from 'react';
import { UtilHandle } from '../../../handle/util';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

const { cssCls } = UtilHandle;
const BASE_CLS = 'icon-btn';

export const IconBtn = memo(({icon, theme, clsSuffix, ...props}: IProps) => {
    const ROOT_CLS = cssCls(BASE_CLS, clsSuffix);
    return (
        <button type="button" className={ROOT_CLS} {...props}>
            { inclStaticIcon(icon, theme) }
        </button>
    );
});