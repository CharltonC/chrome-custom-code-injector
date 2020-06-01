import React from 'react';
import { SideNav } from '.';

export default {
    title: 'Side Nav',
    component: SideNav,
};

const defStyle = {};

export const DefaultComponent = () => {
    return (
        <div style={defStyle} >
            <SideNav />
        </div>
    )
};