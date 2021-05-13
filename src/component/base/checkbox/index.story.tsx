import React, { useState } from 'react';
import { Checkbox } from '.';

export default {
    title: 'Base/Form - Checkbox/Default Checkbox',
    component: Checkbox,
};

const defStyle = { padding: 15 };

export const Default = () => {
    return (
        <div style={defStyle} >
            <Checkbox id="1" label="left-label" />
            <br/>
            <Checkbox id="2" label="right-label" ltLabel />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle} >
            <Checkbox id="1" label="left-label-disabled" disabled />
            <br/>
            <Checkbox id="2" label="right-label-disabled" disabled ltLabel />
        </div>
    )
};

export const ExternalState = () => {
    const [ checked, setChecked ] = useState(true);

    return (
        <div style={defStyle} >
            <Checkbox
                id="1"
                label="checkbox"
                defaultChecked={checked}
                onClick={() => setChecked(!checked)}
                />
        </div>
    )
};