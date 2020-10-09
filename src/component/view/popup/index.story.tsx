import React from 'react';
import { PopupView } from '.';

export default {
    title: 'View - Popup',
    component: PopupView
};

const defStyle = {
};

export const DefaultComponent = () => {
    return (
        <div style={defStyle} >
            <PopupView />
        </div>
    )
};