import React, {  memo } from 'react';
import { IProps } from './type';

const BASE_CLS: string = 'text-btn';

export const TextBtn = memo(({ text, outline, ...props }: IProps) => {
    const BTN_CLS: string = `${BASE_CLS} ${BASE_CLS}--` + (outline ? 'outline' : 'fill')

    return (
        <button
            type="button"
            className={BTN_CLS}
            {...props}
            >
            {text}
        </button>
    );
});