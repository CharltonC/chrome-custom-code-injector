import React from 'react';
import { TextBtn } from '.';

export default {
    title: 'Text Button',
    component: TextBtn,
};

export const Default = () => (
    <>
        <TextBtn outline title="outline" />
        <TextBtn title="filled" style={{marginLeft: 20}}/>
    </>
);