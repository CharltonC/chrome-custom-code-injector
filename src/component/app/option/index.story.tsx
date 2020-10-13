import React from 'react';
import { ListView } from '.';

export default {
    title: 'App - Option',
    component: ListView,
};

const defStyle = {};

export const Default = () => {
    return (
        <div style={defStyle} >
            <ListView />
        </div>
    )
};