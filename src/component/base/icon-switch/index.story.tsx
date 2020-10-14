import React from 'react';
import { IconSwitch } from '.';

export default {
    title: 'Icon Switch',
    component: IconSwitch,
};

const defStyle = { padding: 10 };

export const ExternalStateIcon = () => {
    return (
        <div style={defStyle} >
            <IconSwitch id="1" label="setting" icon defaultChecked />
        </div>
    )
};

export const InternalStateIcon = () => {
    return (
        <div style={defStyle} >
            <IconSwitch id="2" label="setting" icon />
        </div>
    )
};

export const Text = () => {
    return (
        <div style={defStyle} >
            <IconSwitch id="3" label="(.*)" />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle} >
            <IconSwitch id="4" label="setting" icon disabled />
        </div>
    )
};