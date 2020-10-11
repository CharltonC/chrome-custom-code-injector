import React, { memo } from 'react';
import { IProps } from './type';

export const SliderSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { id, label, ...inputProps } = props;

    return (
        <label className="slider-switch" htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />{ label &&
                <span>{label}</span>}
        </label>
    );
});