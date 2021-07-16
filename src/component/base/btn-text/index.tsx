import React, {  memo } from 'react';
import { IProps } from './type';

const BASE_CLS = 'text-btn';

export const TextBtn = memo(({ text, outline, ...props }: IProps) => {
    const ROOT_CLS = `${BASE_CLS} ${BASE_CLS}--` + (outline ? 'outline' : 'fill')

    return (
        <button
            type="button"
            className={ROOT_CLS}
            {...props}
            >
            {text}
        </button>
    );
});