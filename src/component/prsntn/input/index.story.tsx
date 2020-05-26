import React from 'react';
import { Input } from '.';

export default {
    title: 'Text Input',
    component: Input,
};

const defStyle = {padding: '10px', width: '300px'};

export const DefaultInput = () => {
    const validationRules = [
        {rule: val => !!val, msg: 'must not be empty' },
        {rule: val => val.length >=3 , msg: 'must be more than or equal to 3 characters' },
        {rule: /(abc)/g , msg: 'must contain character `ab`'},
    ];

    return (
        <div style={defStyle} >
            <Input id="lorem" placeholder="some text" validate={validationRules} />
        </div>
    )
};