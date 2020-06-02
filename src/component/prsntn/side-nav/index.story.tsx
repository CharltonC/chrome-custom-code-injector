import React, {useState} from 'react';
import { SideNav } from '.';

export default {
    title: 'Side Nav',
    component: SideNav,
};

const defStyle = {};


export const DefaultComponent = () => {
    const sampleList = [
        {id: 'Host Id 1', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
        {id: 'Host Id 2', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
        {id: 'Host Id 3', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]}
    ];

    const [ list ] = useState(sampleList);

    // const onClick = () => {
    //     setList([
    //         {id: 'Host Id 3', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]}
    //     ]);
    // };

    return (
        <div style={defStyle} >
            <SideNav list={list} />
        </div>
    )
};