import React, { useState } from 'react';
import { Dropdown } from  './';

export default {
    title: 'Dropdown',
    component: Dropdown ,
};

const defStyle = {padding: '20px'};
const list = ['a', 'b', 'c'];

export const WithoutBorder = () => {
    return (
        <div style={defStyle} >
            <Dropdown id="" list={list} />
        </div>
    )
};

export const WithBorder = () => {
    return (
        <div style={defStyle} >
            <Dropdown id="" list={list} border={true} />
        </div>
    )
};

export const WithSelectedIndexAndCallback = () => {
    const [ optionIdx, setOptionIdx ] = useState(2);
    const onSelect = (evt, idx) => {
        setOptionIdx(idx);
    };

    return (
        <div style={defStyle} >
            <p>selected option index: {optionIdx}</p>
            <p>selected option value: {list[optionIdx]}</p>
            <Dropdown id=""
                list={list}
                selectIdx={optionIdx}
                onSelect={onSelect} />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle} >
            <Dropdown id="" list={list} border={true} disabled={true} />
        </div>
    )
};


