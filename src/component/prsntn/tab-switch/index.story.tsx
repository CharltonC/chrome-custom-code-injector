import React, { useState } from 'react';
import { TabSwitch } from '.';

export default {
    title: 'Tab Switch',
    component: TabSwitch,
};

const defStyle = {padding: '15px'};

export const SampleTabs = () => {
    const list = [
        {name: 'js' , isEnable: true},
        {name: 'css', isEnable: false},
        {name: 'lib', isEnable: true},
    ];
    return (
        <div style={defStyle} >
            <TabSwitch list={list} id="test"/>
        </div>
    )
};

export const SampleTabsWithActiveIndex = () => {
    const [ atvIdx, setAtvIdx ]  = useState(1);

    const [ list, setList ] = useState([
        {name: 'js' , isEnable: true},
        {name: 'css', isEnable: false},
        {name: 'lib', isEnable: true},
    ]);

    return (
        <div style={defStyle} >
            <TabSwitch
                id="test"
                list={list}
                activeIdx={atvIdx}
                onTabActive={(evt, checkedTab, idx) => setAtvIdx(idx)}
                onTabEnable={(evt, tab, idx, isTabAtv, isEnable) => {
                    Object.assign(list[idx], {isEnable});
                    setList(list);
                }}
                />
        </div>
    )
};