import React, { useState } from 'react';
import { SliderSwitch } from '.';

export default {
    title: 'Checkbox - Slider Switch',
    component: SliderSwitch,
};

const defStyle = { padding: 20 };

export const InternalState = () => {
    return (
        <div style={defStyle}>
            <SliderSwitch
                id="lorem"
                label="lorem"
                onChange={() => {}}
                />
        </div>
    )
};

export const ExternalState = () => {
    const [ checked, setChecked ] = useState(true);

    return (
        <div style={defStyle}>
            <SliderSwitch
                id="sum"
                label="sum"
                defaultChecked={checked}
                onClick={() => setChecked(!checked)}
                />
        </div>
    )
};

export const LeftLabel = () => {
    return (
        <div style={defStyle}>
            <SliderSwitch
                id="lorem"
                label="lorem"
                ltLabel
                />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle}>
            <SliderSwitch
                id="1"
                label="sum"
                disabled
                />
            <br/>
            <SliderSwitch
                id="2"
                label="sum"
                disabled
                ltLabel
                />
        </div>
    )
};

export const NoLabel = () => {
    return (
        <div style={defStyle}>
            <SliderSwitch
                id="sum"
                label=""
                onChange={() => {}}
                />
        </div>
    )
};