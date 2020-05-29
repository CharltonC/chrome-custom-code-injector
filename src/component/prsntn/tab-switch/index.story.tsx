import React from 'react';
import { TabSwitch } from '.';

export default {
    title: 'Tab Switch',
    component: TabSwitch,
};

const defStyle = {padding: '15px'};

export const DefaultComponent = () => {
    const list = [
        {name: 'js' , isEnable: true},
        {name: 'css', isEnable: false},
        {name: 'lib', isEnable: true},
    ];
    return (
        <div style={defStyle} >
            <TabSwitch list={list} id="test"/>
        </div>
    )
};