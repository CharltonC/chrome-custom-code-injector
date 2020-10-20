import React, { memo, ReactElement } from 'react';
import { IProps } from './type';
import { UtilHandle } from '../../../service/handle/util';

const { cssCls } = UtilHandle.prototype;

export const SliderSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { id, label, rtLabel, clsSuffix, ...inputProps } = props;
    const $label: ReactElement = <span>{label}</span>;
    const className: string = cssCls('slider-switch', clsSuffix);

    return (
        <label className={className} htmlFor={id}>
            { label && !rtLabel && $label }
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />
            { label && rtLabel && $label }
        </label>
    );
});