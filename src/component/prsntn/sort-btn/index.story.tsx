import React, { useState } from 'react';
import { SortBtn, _SortBtn } from './';

export default {
    title: 'Sort Button',
    component: _SortBtn,
};

export const WithSortState = () => {
    const [ isAsc, setSortOrder ] = useState(true);
    const onClick = () => setSortOrder(!isAsc);
    return (
        <SortBtn
            isAsc={isAsc}
            onClick={onClick}
            />
    )
};

export const WithoutSortState = () => {
    const [ isAsc, setSortOrder ] = useState(null);
    const onClick = () => setSortOrder(!isAsc);
    return (
        <SortBtn
            isAsc={isAsc}
            onClick={onClick}
            />
        )
    };
