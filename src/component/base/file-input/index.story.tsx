import React from 'react';
import { FileInput } from '.';

export default {
    title: 'Form - File Input',
    component: FileInput,
};

const defStyle = { padding: 15 };

export const Default = () => {
    return (
        <div style={defStyle} >
            <FileInput id="demo" fileType="image/jpeg" />
        </div>
    )
};

export const Disabled = () => {
    return (
        <div style={defStyle} >
            <FileInput id="demo2" fileType="image/jpeg" disabled />
        </div>
    )
};