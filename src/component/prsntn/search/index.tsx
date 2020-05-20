import React, { memo, useState, useRef, FC, ReactElement } from 'react';

import { staticIconElem } from '../../static/icon';
import * as NSearch from './type';

const _Search: FC<NSearch.IProps> = ({id, text, disabled, onClear, onChange, ...inputProps}) => {
    // Label / Input + Button
    const labelCls: string = 'search' + (disabled ? ' search--disabled' : '');
    const isDisabled: boolean = typeof disabled === 'undefined' ? false : disabled;

    // Input (w/ private state only)
    let inputElemRef = useRef(null);

    // Private State only (wont be used if external input value is passed)
    let value: string, setValue: any;
    const hasOwnState: boolean = typeof text === 'undefined';
    if (hasOwnState) [ value, setValue ] = useState('');
    const inputVal: string = hasOwnState ? value : text;

    const inputOnChange: NSearch.cbFn = (evt: Event) => {
        const targetElem = evt.target as HTMLInputElement;
        const val: string = targetElem.value;
        if (hasOwnState) setValue(val);             // 2-way binding to self
        if (onChange) onChange(evt, val);
    }

    // Button
    const btnOnClear: NSearch.cbFn = (evt: Event) => {
        const inputElem = inputElemRef.current;

        if (hasOwnState) setValue('');
        if (onClear) onClear(evt);

        // `null` is assigned instead of `''` else it wont trigger "change" event
        // - Ref: https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
        inputElem.value = null;
        inputElem.focus();
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
                value={inputVal}
                ref={inputElemRef}
                disabled={isDisabled}
                onChange={inputOnChange}
                {...inputProps}
                >
            </input>
            {
                inputVal ?
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
}

export const Search = memo(_Search);