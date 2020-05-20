import React, { memo, useRef, FC, ReactElement } from 'react';

import { staticIconElem } from '../../static/icon';
import * as NSearch from './type';

const _Search: FC<NSearch.IProps> = ({id, text, disabled, onClear, onChange, ...inputProps}) => {
    // Label / Input + Button
    const labelCls: string = 'search' + (disabled ? ' search--disabled' : '');
    const isDisabled: boolean = typeof disabled === 'undefined' ? false : disabled;

    // Input (w/ private state only)
    let inputElemRef = useRef(null);

    // Button
    const onBtnClick: NSearch.cbFn = (evt: Event) => {
        const inputElem = inputElemRef.current;
        onClear(evt);

        // `null` is assigned instead of `''` else it wont trigger "change" event
        // - Ref: https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
        // inputElem.value = null;
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
                value={text}
                ref={inputElemRef}
                disabled={isDisabled}
                onChange={onChange}
                {...inputProps}
                >
            </input>
            {
                text ?
                <button
                    className="search__clear"
                    type="button"
                    title="clear the search"
                    disabled={isDisabled}
                    onClick={onBtnClick}
                    >
                    {clearIcon}
                </button> :
                searchIcon
            }
        </label>
    );
}

export const Search = memo(_Search);