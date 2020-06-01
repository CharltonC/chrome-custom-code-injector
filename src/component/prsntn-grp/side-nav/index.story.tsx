import React from 'react';
import { SideNav } from '.';

export default {
    title: 'Side Nav',
    component: SideNav,
};

const defStyle = {};

const sampleList = [
    {id: 'Host Id 1', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
    {id: 'Host Id 2', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
    {id: 'Host Id 3', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]}
];

export const DefaultComponent = () => {
    return (
        <div style={defStyle} >
            <SideNav list={sampleList}/>
        </div>
    )
};