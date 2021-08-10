import React, { memo } from 'react';
import { IProps } from './type';

export const BoxSwitch: React.FC<IProps> = memo((props: IProps) => {
    const { name, labels, activeLabel, onChange } = props;

    return labels.length && (
        <ul className="box-switch">{ labels.map((label, idx) => {
            const id = `${name}-${idx}`;
            const isChecked = activeLabel === label;
            return (
                <li>
                    <label htmlFor={id}>
                        <input
                            type="radio"
                            name={name}
                            key={id}
                            id={id}
                            checked={isChecked}
                            value={label}
                            onChange={onChange}
                            />
                        <span>{label}</span>
                    </label>
                </li>
            );})}
        </ul>
    );
});