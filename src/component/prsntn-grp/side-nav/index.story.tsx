import React from 'react';
import { SideNav } from '.';

export default {
    title: 'Side Nav',
    component: SideNav,
};

const defStyle = {};

const sampleList = [
    {name: 'Host Id 1', nestedList: ['Path ID 1', 'Path ID 2']},
    {name: 'Host Id 2', nestedList: ['Path ID 1', 'Path ID 2']},
    {name: 'Host Id 3', nestedList: ['Path ID 1', 'Path ID 2', 'Path ID 3']}
];

export const DefaultComponent = () => {
    return (
        <div style={defStyle} >
            <SideNav list={sampleList}/>
        </div>
    )
};