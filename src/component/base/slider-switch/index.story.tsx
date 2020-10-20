import React, { useState } from 'react';
import { SliderSwitch } from '.';

export default {
    title: 'Form - Slider Switch',
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

export const RightLabel = () => {
    return (
        <div style={defStyle}>
            <SliderSwitch
                id="lorem"
                label="lorem"
                rtLabel
                />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle}>
            <SliderSwitch
                id="sum"
                label="sum"
                disabled
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