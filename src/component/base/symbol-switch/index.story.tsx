import React, { useState } from 'react';
import { SymbolSwitch } from '.';

export default {
    title: 'Symbol Switch',
    component: SymbolSwitch,
};

export const Default = () => {
    return (
        <SymbolSwitch
            id="js"
            label="Js"
        />
    )
};

export const Disabled = () => {
    return (
        <SymbolSwitch
            id="js"
            label="Js"
            disabled
        />
    )
};


export const WithExternalState = () => {
    const [ checked, setChecked ] = useState(true);
    return (
        <SymbolSwitch
            id="js"
            label="Js"
            defaultChecked={checked}
            onClick={() => setChecked(!checked)}
        />
    )
};