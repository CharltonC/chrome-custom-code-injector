import React, { memo } from 'react';
import { IProps } from './type';
import { UtilHandle } from '../../../handle/util';

const { cssCls } = UtilHandle;

export const Checkbox: React.FC<IProps> = memo((props: IProps) => {
    const { id, label, ltLabel, clsSuffix, ...inputProps } = props;
    const ROOT_CLS = cssCls('checkbox', (clsSuffix ?? '') + `${ltLabel ? 'lt-label' : ''}`);

    return (
        <div className={ROOT_CLS}>
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />{ label &&
            <label htmlFor={id}>{label}</label> }
        </div>
    );
});