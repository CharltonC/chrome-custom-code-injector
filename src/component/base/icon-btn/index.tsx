import React, { memo } from 'react';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

export const IconBtn = memo(({icon, theme, ...props}: IProps) => {
    return (
        <button type="button" className="kz-icon-btn" {...props}>
            { inclStaticIcon(icon, theme) }
        </button>
    );
});