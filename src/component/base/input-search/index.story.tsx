import React, { useState } from 'react';
import { SearchInput } from '.';

export default {
    title: 'Base/Form - Input/Search',
    component: SearchInput,
};

const defStyle = {backgroundColor: '#5AB3AD', padding: '15px', color: 'white'};

export const DefaultSearch = () => {
    return (
        <div style={defStyle} >
            <SearchInput id="" />
        </div>
    )
};

export const DisabledSearch = () => {
    return (
        <div style={defStyle} >
            <SearchInput id="" disabled />
        </div>
    )
};

export const WithPassedValue = () => {
    const [ text, setText ] = useState('lorem');
    const onChange = ({ value }) => setText(value);         // 2-way binding
    const onClear = () => { setText(''); };

    return (
        <div style={defStyle} >
            <p>Text passed to search component: {text}</p>
            <br/>
            <SearchInput id="lorem" value={text} onInputChange={onChange} onInputClear={onClear}/>
        </div>
    )
};