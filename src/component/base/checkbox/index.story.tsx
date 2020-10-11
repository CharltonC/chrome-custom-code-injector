import React, { useState } from 'react';
import { Checkbox } from '.';

export default {
    title: 'Checkbox',
    component: Checkbox,
};

const defStyle = {};

export const Default = () => {
    return (
        <div style={defStyle} >
            <Checkbox id="lorem" label="checkbox" />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle} >
            <Checkbox id="lorem" label="checkbox" disabled />
        </div>
    )
};

export const ExternalState = () => {
    const [ checked, setChecked ] = useState(true);

    return (
        <div style={defStyle} >
            <Checkbox
                id="lorem"
                label="checkbox"
                defaultChecked={checked}
                onClick={() => setChecked(!checked)}
                />
        </div>
    )
};