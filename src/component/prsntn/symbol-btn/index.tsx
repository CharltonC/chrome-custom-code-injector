import React, { memo, FC } from 'react';
import * as NSymbolBtn from './type';

const _SymbolBtn: FC<NSymbolBtn.IProps> = ({id, text, ...checkboxProps}) => {
    const baseCls = 'symbol-btn';
    const inputCls = `${baseCls}__checkbox`;
    const spanCls = `${baseCls}__text`;

    return (
        <label htmlFor={id} className={baseCls}>
            <input
                type="checkbox"
                className={inputCls}
                id={id}
                {...checkboxProps}
                >
            </input>
            <span className={spanCls}>{text}</span>
        </label>
    );
};

export const SymbolBtn = memo(_SymbolBtn);