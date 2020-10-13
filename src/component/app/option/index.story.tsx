import React from 'react';
import { OptionApp } from '.';

export default {
    title: 'App - Option',
    component: OptionApp,
};

const defStyle = {};

export const Default = () => {
    return (
        <div style={defStyle} >
            <OptionApp />
        </div>
    )
};