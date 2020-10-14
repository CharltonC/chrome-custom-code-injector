import React from 'react';
import { IconSwitch } from '.';

export default {
    title: 'Icon Switch',
    component: IconSwitch,
};

const defStyle = { padding: 10 };

export const Default = () => {
    return (
        <div style={defStyle} >
            <IconSwitch id="setting" icon="setting" defaultChecked theme="gray" />
            <IconSwitch id="setting" icon="setting" theme="gray" />
            <IconSwitch id="setting2" icon="setting" disabled />
        </div>
    )
};