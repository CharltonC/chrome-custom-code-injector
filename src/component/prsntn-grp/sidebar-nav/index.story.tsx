import React from 'react';
import { SidebarNav } from '.';

export default {
    title: 'Sidebar Nav',
    component: SidebarNav,
};

const defStyle = {};

export const DefaultComponent = () => {
    return (
        <div style={defStyle} >
            <SidebarNav />
        </div>
    )
};