import React, { memo } from 'react';
import { IProps } from './type';

export const Checkbox: React.FC<IProps> = memo((props: IProps) => {
    const { id, label, ...inputProps } = props;

    return (
        <label className="checkbox" htmlFor={id}>
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