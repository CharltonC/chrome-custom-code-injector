import React, { useState } from 'react';
import { TabSwitch } from '.';

export default {
    title: 'Base/Form - Checkbox/Tab Switch',
    component: TabSwitch,
};

const defStyle = {padding: '15px'};

export const TabsWithArrayData = () => {
    const list = [
        {id: 'js' , isEnabled: true},
        {id: 'css', isEnabled: false},
        {id: 'lib', isEnabled: true},
    ];
    return (
        <div style={defStyle} >
            <TabSwitch data={list} id="test" tabEnableKey="isEnabled" />
        </div>
    )
};

export const TabsWithActiveIndexWithArrayData = () => {
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
                data={list}
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

export const TabsWithObjectData = () => {
    return (
        <div style={defStyle} >
            <TabSwitch
                data={{
                    isJsOn: true,
                    isCssOn: false,
                    isLibOn: false
                }}
                dataKeyMap={[
                    ['js', 'isJsOn'],
                    ['css', 'isCssOn'],
                    ['lib', 'isLibOn']
                ]}
                />
        </div>
    )
};