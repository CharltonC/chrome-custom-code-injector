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
    const [ activeIdx, setActiveIdx ] = useState(0);
    const [ activeChildIdx, setActiveChildIdx ] = useState(0);

    // e.g. we click 2nd item in `sampleList` (either itself or its child), then we change the list via `onClick` to change the list
    // - the active item will still persist
    const changeList = () => {
        list[1].nestList.push({id: 'Path ID 3'});
        setList([
            list[0],
            list[1]
        ]);
    };

    // TODO: Move to internal method + external handler pass through
    const onItemClick = (e, { idx, parentCtxIdx }) => {
        console.log(parentCtxIdx, idx);
        const isParent = typeof parentCtxIdx === 'undefined';
        if (isParent) {
            setActiveIdx(idx);
            setActiveChildIdx(null);
        } else {
            setActiveChildIdx(idx);
        }
    }

    return (
        <div style={defStyle} >
            <button type="button" onClick={changeList}>change list</button>
            <SideNav
                list={list}
                itemKeys={[ 'id', 'id' ]}
                childKey="nestList"
                activeIdx={activeIdx}
                activeChildIdx={activeChildIdx}
                onItemClick={onItemClick}
                />
        </div>
    )
};