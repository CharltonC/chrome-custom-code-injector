import React, { useState } from 'react';
import { Dropdown } from  '.';

export default {
    title: 'Base/Form/Select/Dropdown',
    component: Dropdown ,
};

const defStyle = {padding: '20px'};
const list = ['a', 'b', 'c'];

export const WithoutBorder = () => {
    return (
        <div style={defStyle} >
            <Dropdown id="1" list={list} label="label" />
            <br/>
            <Dropdown id="2" list={list} label="label" ltLabel />
            <br/>
            <Dropdown id="3" list={list} label="disabled" disabled />
            <br/>
            <Dropdown id="4" list={list} label="disabled" ltLabel disabled />
        </div>
    )
};

export const WithBorder = () => {
    return (
        <div style={defStyle} >
            <Dropdown id="1" list={list} border={true} label="label" />
            <br/>
            <Dropdown id="2" list={list} border={true} label="label" ltLabel />
            <br/>
            <Dropdown id="3" list={list} border={true} label="disabled" disabled />
            <br/>
            <Dropdown id="4" list={list} border={true} label="disabled" ltLabel disabled />
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