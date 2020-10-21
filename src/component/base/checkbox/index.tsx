import React, { memo, ReactElement } from 'react';
import { IProps } from './type';
import { UtilHandle } from '../../../service/handle/util';

const { cssCls } = UtilHandle.prototype;

export const Checkbox: React.FC<IProps> = memo((props: IProps) => {
    const { id, label, rtLabel, clsSuffix, ...inputProps } = props;
    const $label: ReactElement = <label htmlFor={id}>{label}</label>;
    const className: string = cssCls('checkbox', clsSuffix);

    return (
        <div className={className}>
            { label && !rtLabel && $label }
            <input
                type="checkbox"
                id={id}
                name={id}
                {...inputProps}
                />
            { label && rtLabel && $label }
        </div>
    );
});