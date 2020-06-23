import React, { useState } from 'react';
import { inclStaticIcon } from '../../static/icon';
import { DataGrid } from '.';

export default {
    title: 'Data Grid',
    component: DataGrid,
};

const defStyle = { padding: 20 };
const headerStyle = { fontSize: '18px', fontStyle: 'bold', color: 'gray' };
const nestedUlStyle = { padding: 15, listStyle: 'disc' };

const dnArwIconElem = inclStaticIcon('arrow-dn', true);
const upArwIconElem = inclStaticIcon('arrow-up', true);

const sampleData = [
    {
        id: 'A1',
        isCollapsed: false,
        lvl1key: [
            {
                id: 'A1-B1',
                isCollapsed: false,
                lvl2key: [
                    {
                        id: 'A1-B1-C1',
                        isCollapsed: false,
                        lvl3key: [
                            {
                                id: 'A1-B1-C1-D1',
                                isCollapsed: false,
                                lvl4key: [
                                    {id: 'A1-B1-C1-D1-E1'},
                                    {id: 'A1-B1-C1-D1-E2'},
                                ]
                            },
                            {id: 'A1-B1-C2-D2'},
                            {id: 'A1-B1-C1-D3'},
                            {id: 'A1-B1-C2-D4'}
                        ]
                    },
                    {id: 'A1-B1-C2'}
                ]
            },
            {
                id: 'A1-B2',
                lvl2key: [
                    {id: 'A1-B2-C1'},
                    {id: 'A1-B2-C2'}
                ]
            }
        ]
    },
    {
        id: 'A2',
        lvl1key: [
            {
                id: 'A2-B1',
                lvl2key: [
                    {id: 'A2-B1-C1'},
                    {id: 'A2-B1-C2'}
                ]
            },
            {
                id: 'A2-B2',
                lvl2key: [
                    {id: 'A2-B2-C1'},
                    {id: 'A2-B2-C2'}
                ]
            }
        ]
    }
];

export const ViaACollapsibleKey = () => {
    const [ data, setData ] = useState(sampleData);

    const ListItemCmp = ({idx, item, itemCtx, itemLvl, nestedItems}) => {
        const onCollapseChange = () => {
            item.isCollapsed = !item.isCollapsed;
            setData(data.slice(0));     // force render when data value changes
        };

        return (<li>
            { (itemLvl === 0 ? '' : `Level ${itemLvl} - `) + `Item ${idx+1}`}
            {
                nestedItems &&
                <button type="button" onClick={onCollapseChange}>
                    {item.isCollapsed ? dnArwIconElem : upArwIconElem}
                </button>
            }
            {
                nestedItems && !item.isCollapsed &&
                <ul style={nestedUlStyle}>{nestedItems}</ul>
            }
        </li>);
    };

    return (
        <div style={defStyle} >
            <DataGrid
                data={data}
                rows={[
                    [ListItemCmp],
                    ['lvl1key', ListItemCmp],
                    ['lvl2key', ListItemCmp],
                    ['lvl3key', ListItemCmp],
                    ['lvl4key', ListItemCmp]
                ]}
                />
        </div>
    );
};

export const ViaInternalGeneratedCollapsibleState = () => {
    const ListItemCmp = ({idx, item, itemCtx, itemLvl, nestedItems, isCollapsed, onClpsChange}) => {
        return (<li>
            { (itemLvl === 0 ? '' : `Level ${itemLvl} - `) + `Item ${idx+1}`}
            {
                nestedItems &&
                <button type="button" onClick={onClpsChange}>
                    {isCollapsed ? dnArwIconElem : upArwIconElem}
                </button>
            }
            {
                nestedItems && !isCollapsed &&
                <ul style={nestedUlStyle}>{nestedItems}</ul>
            }
        </li>);
    };

    return (
        <div style={defStyle}>
            <DataGrid
                data={sampleData}
                rows={[
                    [ListItemCmp],
                    ['lvl1key', ListItemCmp],
                    ['lvl2key', ListItemCmp],
                    ['lvl3key', ListItemCmp],
                    ['lvl4key', ListItemCmp]
                ]}
                showCollapse={'0/lvl1key:0'}                     // show one only at a time
                // showCollapse={'NONE'}                           // hide all
                // showCollapse={'ALL'}                            // show all (def)
                // showCollapse={[                                     // show specific level (incl. its parent)
                //     '0/lvl1key:0/lvl2key:0/',            // show 1st item's level 2 nested list (incl. its parent)
                //     '1/lvl1key:1/',                      // show 2nd item's level 1 nested list (incl. its parent)
                // ]}
                />
        </div>
    );

};