import React, { useState } from 'react';
import { TextInput } from '.';

export default {
    title: 'Input - Text Input',
    component: TextInput,
};

const defStyle = { padding: '20px', width: '500px', border: '1px solid gray'};

const validationRules = [
    {rule: val => !!val, msg: 'must not be empty' },
    {rule: val => val.length >=3 , msg: 'must be more than or equal to 3 characters' },
    {rule: /(abc)/g , msg: 'must contain character `abc`'},
];

export const WithValidationAndFixedPosErrMsg = () => {
    return (
        <div style={defStyle} >
            <TextInput
                id="lorem1"
                placeholder="some text"
                validate={validationRules}
                />
        </div>
    )
};

export const WithPassedInput  = () => {
    // Ext state & 2way binding
    const [ text, setText ] = useState('lorem sum');
    const onInputChange = ({evt, val}) => setText(val);

    return (
        <div style={defStyle} >
            <TextInput
                id="lorem2"
                placeholder="some text"
                defaultValue={text}
                onInputChange={onInputChange}
                />
        </div>
    )
};

export const WithLabelAndRequiredAndFixedPosErrMsg = () => {
    // Ext state & 2way binding
    const [ text, setText ] = useState('lorem sum');
    const onInputChange = ({evt, val}) => setText(val);

    return (
        <div style={defStyle} >
            <TextInput
                id="lorem2"
                label="label"
                value={text}
                required
                validate={validationRules}
                fixedPosErrMsg
                onInputChange={onInputChange}
                />
        </div>
    );
};

export const WithPassedInputAndValidation  = () => {
    // Ext state & 2way binding
    const [ text, setText ] = useState('lorem sum');
    const onInputChange = ({ evt, val }) => setText(val);

    return (
        <div style={defStyle} >
            <p>Passed input: {text}</p>
            <TextInput
                id="lorem3"
                placeholder="some text"
                label="label"
                defaultValue={text}
                onInputChange={onInputChange}
                validate={validationRules}
                />
        </div>
    )
};