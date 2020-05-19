import React, { useState } from 'react';
import { Search } from '.';

export default {
    title: 'Search',
    component: Search,
};

const defStyle = {backgroundColor: '#5AB3AD', padding: '15px', color: 'white'};

export const DefaultSearch = () => {
    return (
        <div style={defStyle} >
            <Search id="" />
        </div>
    )
};

export const DisabledSearch = () => {
    return (
        <div style={defStyle} >
            <Search id="" disabled />
        </div>
    )
};

export const WithPassedValue = () => {
    const [ text, setText ] = useState('lorem');
    const onChange = (evt: Event, val: string) => setText(val);         // 2-way binding
    const onClear = (evt: Event, val: string) => { setText(''); };

    return (
        <div style={defStyle} >
            <p>Text passed to search component: {text}</p>
            <br/>
            <Search id="lorem" text={text} onChange={onChange} onClear={onClear}/>
        </div>
    )
};