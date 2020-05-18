import React, { useState } from 'react';
import { Search } from '.';

export default {
    title: 'Search',
    component: Search,
};

const defStyle = {backgroundColor: '#5AB3AD', padding: '15px'};

export const DefaultSearch = () => {
    // must be set from parent or root lvl cmp which can handle state (via setState or useSTate equivalent)
    const [ text, setText ] = useState('');
    const onChange = (e) => { setText(e.target.value); };       // 2way binding (sync change)
    const onClear = () => { setText(''); };
    const onSearch = () => { };

    return (
        <div style={defStyle} >
            <Search
                id=""
                text={text}
                disabled={false}
                onSearch={onSearch}
                onClear={onClear}
                onChange={onChange}
                />
        </div>
    )
};

export const DisabledSearch = () => {
    const dummyCbFn = () => {};

    return (
        <div style={defStyle} >
            <Search
                id=""
                text=""
                disabled={true}
                onSearch={dummyCbFn}
                onClear={dummyCbFn}
                onChange={dummyCbFn}
                />
        </div>
    )
};