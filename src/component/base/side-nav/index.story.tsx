import React, {useState} from 'react';
import { SideNav } from '.';

export default {
    title: 'Base/Side Nav',
    component: SideNav,
};

const defStyle = {};


export const ActiveListItemRemainsActiveWhenListChanges = () => {
    const sampleList = [
        {id: 'Host Id 1', nestList: [{id: '1-1'}, {id: '1-2'}]},
        {id: 'Host Id 2', nestList: [{id: '2-1'}, {id: '2-2'}]},
        {id: 'Host Id 3', nestList: [{id: '3-1'}, {id: '3-2'}]},
        {id: 'Host Id 4', nestList: [{id: '4-1'}, {id: '4-2'},{id: '4-1'}, {id: '4-2'},{id: '4-1'}, {id: '4-2'},{id: '4-1'}, {id: '4-2'},{id: '4-1'}, {id: '4-2'}]}
    ];

    const [ list, setList ] = useState(sampleList);
    const [ activeItem, setActiveItem ] = useState(list[1]);

    // e.g. we click 2nd item in `sampleList` (either itself or its child), then we change the list via `onClick` to change the list
    // - the active item will still persist
    const changeList = () => {
        list[1].nestList.push({id: 'Path ID 3'});
        setList([
            list[0],
            list[1]
        ]);
    };

    const onItemClick = (e, { item }) => {
        setActiveItem(item);
    }

    return (
        <div style={defStyle} >
            <button type="button" onClick={changeList}>change list</button>
            <SideNav
                list={list}
                itemKeys={[ 'id', 'id' ]}
                childKey="nestList"
                activeItem={activeItem}
                onItemClick={onItemClick}
                />
        </div>
    )
};