import React from 'react';
import { FileInput } from '.';

export default {
    title: 'Input - File Input',
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

export const WithValidation = () => {
    const fileType = 'application/json';

    const validateRules = [
        {
            msg: 'file selected is not a json file',
            rule: ({ type }: File) => (type === fileType)
        },
        {
            msg: 'file selected has no content',
            rule: ({ size }: File) => !!size
        }
    ];

    return (
        <div style={defStyle} >
            <FileInput
                id="demo"
                fileType={fileType}
                validate={validateRules}
                />
        </div>
    )
};