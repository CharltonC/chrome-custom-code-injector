import React, {useState} from 'react';
import { SideNav } from '.';

export default {
    title: 'Side Nav',
    component: SideNav,
};

const defStyle = {};


export const ActiveListItemRemainsActiveWhenListChanges = () => {
    const sampleList = [
        {id: 'Host Id 1', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
        {id: 'Host Id 2', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
        {id: 'Host Id 3', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'}]},
        {id: 'Host Id 4', nestList: [{id: 'Path ID 1'}, {id: 'Path ID 2'},{id: 'Path ID 1'}, {id: 'Path ID 2'},{id: 'Path ID 1'}, {id: 'Path ID 2'},{id: 'Path ID 1'}, {id: 'Path ID 2'},{id: 'Path ID 1'}, {id: 'Path ID 2'}]}
    ];

    const [ list, setList ] = useState(sampleList);

    // e.g. we click 2nd item in `sampleList` (either itself or its child), then we change the list via `onClick` to change the list
    // - the active item will still persist
    const onClick = () => {
        list[1].nestList.push({id: 'Path ID 3'});
        setList([
            list[0],
            list[1]
        ]);
    };

    return (
        <div style={defStyle} >
            <button type="button" onClick={onClick}>change list</button>
            <SideNav
                list={list}
                itemKeys={[ 'id', 'id' ]}
                childKey="nestList"
                />
        </div>
    )
};