import React, { useState } from 'react';
import { SliderSwitch } from '.';

export default {
    title: 'Slider Switch',
    component: SliderSwitch,
};

export const InternalState = () => {
    return (
        <SliderSwitch
            id="lorem"
            label="lorem"
            onChange={() => {}}
            />
    )
};

export const ExternalState = () => {
    const [ checked, setChecked ] = useState(true);

    return (
        <SliderSwitch
            id="sum"
            label="sum"
            checked={checked}
            onClick={() => setChecked(!checked)}
            />
    )
};

export const Disabled = () => {
    return (
        <SliderSwitch
            id="sum"
            label="sum"
            disabled
            />
    )
};

export const NoLabel = () => {
    return (
        <SliderSwitch
            id="sum"
            label=""
            onChange={() => {}}
            />
    )
};