import React, { memo, FC, ReactElement } from 'react';

import { staticIconElem } from '../../static/icon';
import * as NSearch from './type';

const _Search: FC<NSearch.IProps> = ({id, text, disabled, onSearch, onClear, onChange, ...inputProps}) => {
    const labelCls: string = 'search' + (disabled ? ' search--disabled' : '');
    const btnTitle: string = text ? 'clear the search': 'search';
    const btnOnClick: (...args: any[]) => void = text ? onClear : onSearch;
    const btnIcon: ReactElement = staticIconElem(text ? 'close' : 'search', true);

    return (
        <label className={labelCls} htmlFor={id}>
            <button
                className="search__btn"
                type="button"
                disabled={disabled}
                title={btnTitle}
                onClick={btnOnClick}
                >
                    {btnIcon}
            </button>
            <input
                id={id}
                className="search__input"
                type="text"
                placeholder="Search"
                value={text}
                disabled={disabled}
                onChange={onChange}
                {...inputProps}
                >
            </input>
        </label>
    );
};

export const Search = memo(_Search);