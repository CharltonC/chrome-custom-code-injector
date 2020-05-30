import React, { memo, FC } from 'react';

import { inclStaticIcon } from '../../static/icon';
import * as NIconBtn from './type';

const _IconBtn: FC<NIconBtn.IProps> = ({icon, ...props}) => {
    const { name, darkMode } = icon;
    return (
        <button type="button" className="icon-btn" {...props}>
            { inclStaticIcon(name, darkMode) }
        </button>
    );
};

export const IconBtn = memo(_IconBtn);