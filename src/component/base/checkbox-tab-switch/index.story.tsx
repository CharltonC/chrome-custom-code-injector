import React, { useState } from 'react';
import { TabSwitch } from '.';

export default {
    title: 'Checkbox - Tab Switch',
    component: TabSwitch,
};

const defStyle = {padding: '15px'};

export const SampleTabs = () => {
    const list = [
        {id: 'js' , isEnabled: true},
        {id: 'css', isEnabled: false},
        {id: 'lib', isEnabled: true},
    ];
    return (
        <div style={defStyle} >
            <TabSwitch list={list} id="test" tabEnableKey="isEnabled" />
        </div>
    )
};

export const SampleTabsWithActiveIndex = () => {
    const [ atvIdx, setAtvIdx ]  = useState(1);

    const [ list, setList ] = useState([
        {id: 'js' , isEnabled: true},
        {id: 'css', isEnabled: false},
        {id: 'lib', isEnabled: true},
    ]);

    return (
        <div style={defStyle} >
            <TabSwitch
                id="test"
                list={list}
                tabEnableKey="isEnabled"
                activeTabIdx={atvIdx}
                onTabActive={(evt, checkedTab, idx) => setAtvIdx(idx)}
                onTabEnable={(evt, tab, idx) => {
                    const listClone = list.concat();
                    listClone[idx].isEnabled =  !tab.isEnabled;
                    setList(listClone);
                }}
                />
        </div>
    )
};