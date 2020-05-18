import React, { memo, FC } from 'react';
import * as NSymbolBtn from './type';

const _SymbolBtn: FC<NSymbolBtn.IProps> = ({text, ...checkboxProps}) => {
    const baseCls = 'symbol-btn';
    const inputCls = `${baseCls}__checkbox`;
    const inputId = `${baseCls}-${text}`;
    const spanCls = `${baseCls}__text`;

    return (
        <label htmlFor={inputId} className={baseCls}>
            <input
                type="checkbox"
                className={inputCls}
                id={inputId}
                {...checkboxProps}
                >
            </input>
            <span className={spanCls}>{text}</span>
        </label>
    );
};

export const SymbolBtn = memo(_SymbolBtn);