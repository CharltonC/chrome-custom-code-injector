import React, { memo } from 'react';
import { IProps } from './type';

export const SymbolSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { id, label, ...inputProps } = props;

    return (
        <label className="symbol-switch" htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />
            <span>{label}</span>
        </label>
    );
});