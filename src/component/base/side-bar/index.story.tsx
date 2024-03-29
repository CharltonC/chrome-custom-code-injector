import React, {useState} from 'react';
import { SideBar } from '.';

export default {
    title: 'Base/Side Nav',
    component: SideBar,
};

const defStyle = {};


export const ActiveListItemRemainsActiveWhenListChanges = () => {
    const sampleList = [
      { title: "Host Id 1", list: [{ title: "1-1" }, { title: "1-2" }] },
      { title: "Host Id 2", list: [{ title: "2-1" }, { title: "2-2" }] },
      { title: "Host Id 3", list: [{ title: "3-1" }, { title: "3-2" }] },
      {
        title: "Host Id 4",
        list: [
          { title: "4-1" },
          { title: "4-2" },
          { title: "4-1" },
          { title: "4-2" },
          { title: "4-1" },
          { title: "4-2" },
          { title: "4-1" },
          { title: "4-2" },
          { title: "4-1" },
          { title: "4-2" },
        ],
      },
    ];

    const [ list, setList ] = useState(sampleList);
    const [ activeIdx, setActiveIdx ] = useState(0);
    const [ activeChildIdx, setActiveChildIdx ] = useState(0);

    // e.g. we click 2nd item in `sampleList` (either itself or its child), then we change the list via `onClick` to change the list
    // - the active item will still persist
    const changeList = () => {
        list[1].list.push({title: 'Path ID 3'});
        setList([
            list[0],
            list[1]
        ]);
    };

    const onClick = ({ idx, isChild }) => {
        if (isChild) return setActiveChildIdx(idx);
        setActiveIdx(idx);
        setActiveChildIdx(null);
    }

    return (
        <div style={defStyle} >
            <button type="button" onClick={changeList}>change list</button>
            <SideBar
                list={list}
                activeItemIdx={activeIdx}
                activeChildItemIdx={activeChildIdx}
                onClick={onClick}
                />
        </div>
    )
};