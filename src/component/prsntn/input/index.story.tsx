import React, { useState } from 'react';
import { Input } from '.';

export default {
    title: 'Text Input',
    component: Input,
};

const defStyle = {padding: '10px', width: '300px'};

export const WithValidation = () => {
    const validationRules = [
        {rule: val => !!val, msg: 'must not be empty' },
        {rule: val => val.length >=3 , msg: 'must be more than or equal to 3 characters' },
        {rule: /(abc)/g , msg: 'must contain character `abc`'},
    ];

    return (
        <div style={defStyle} >
            <Input id="lorem1" placeholder="some text" validate={validationRules} />
        </div>
    )
};

export const WithPassedInput  = () => {
    // Ext state & 2way binding
    const [ text, setText ] = useState('lorem sum');
    const onInputChange = (evt, val) => setText(val);

    return (
        <div style={defStyle} >
            <Input id="lorem2" placeholder="some text" text={text} onInputChange={onInputChange} />
        </div>
    )
};

export const WithPassedInputAndValidation  = () => {
    const validationRules = [
        {rule: val => !!val, msg: 'must not be empty' },
        {rule: val => val.length >=3 , msg: 'must be more than or equal to 3 characters' },
        {rule: /(abc)/g , msg: 'must contain character `abc`'},
    ];

    // Ext state & 2way binding
    const [ text, setText ] = useState('lorem sum');
    const onInputChange = (evt, val) => setText(val);

    return (
        <div style={defStyle} >
            <Input id="lorem3" placeholder="some text" text={text} onInputChange={onInputChange} validate={validationRules} />
        </div>
    )
};