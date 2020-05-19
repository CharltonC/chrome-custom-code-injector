import React, { memo, useState, FC, ReactElement } from 'react';

import { staticIconElem } from '../../static/icon';
import * as NSearch from './type';


const _Search: FC<NSearch.IProps> = ({id, text, disabled, onClear, onChange, ...inputProps}) => {
    // Label / Input + Button
    const labelCls: string = 'search' + (disabled ? ' search--disabled' : '');
    const isDisabled = typeof disabled === 'undefined' ? false : disabled;

    // Input
    const [ value, setValue ] = useState(text ? text : '');
    const inputOnChange: NSearch.cbFn = (evt: Event) => {
        const targetElem = evt.target as HTMLInputElement;
        const val: string = targetElem.value;
        setValue(val);             // 2-way binding to self
        if (onChange) onChange(evt, val);
    }

    // Button
    const btnOnClear: NSearch.cbFn = (evt: Event) => {
        setValue('');
        if (onClear) onClear(evt);
    };

    // Icon
    const clearIcon: ReactElement = staticIconElem('close', true);
    const searchIcon: ReactElement = staticIconElem('search', true);

    return (
        <label className={labelCls} htmlFor={id}>
            <input
                id={id}
                className="search__input"
                type="text"
                placeholder="Search"
                value={value}
                disabled={isDisabled}
                onChange={inputOnChange}
                {...inputProps}
                >
            </input>
            {
                value ?
                <button
                    className="search__clear"
                    type="button"
                    title="clear the search"
                    disabled={isDisabled}
                    onClick={btnOnClear}
                    >
                    {clearIcon}
                </button> :
                searchIcon
            }
        </label>
    );
};

export const Search = memo(_Search);