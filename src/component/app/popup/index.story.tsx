import React from 'react';
import { PopupApp } from '.';

export default {
    title: 'View - Popup',
    component: PopupApp
};

const defStyle = {
};

export const Default = () => {
    return (
        <div style={defStyle} >
            <PopupApp />
        </div>
    )
};