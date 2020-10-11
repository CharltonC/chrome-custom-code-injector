import React from 'react';
import { ListView } from '.';

export default {
    title: 'View - List',
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