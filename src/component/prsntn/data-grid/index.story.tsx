import React, { useState } from 'react';
import { inclStaticIcon } from '../../static/icon';
import { DataGrid } from '.';

export default {
    title: 'Data Grid',
    component: DataGrid,
};

const defStyle = {};
const headerStyle = { fontSize: '18px', fontStyle: 'bold', color: 'gray' };
const nestedUlStyle = { padding: 15, listStyle: 'disc' };

const dnArwIconElem = inclStaticIcon('arrow-dn', true);
const upArwIconElem = inclStaticIcon('arrow-up', true);

const sampleData = [
    {
        id: 'A1',
        isCollapsed: false,
        nestRowLvl1Key: [
            {
                id: 'A1-B1',
                isCollapsed: false,
                nestRowLvl2Key: [
                    {
                        id: 'A1-B1-C1',
                        isCollapsed: false,
                        nestRowLvl3Key: [
                            {
                                id: 'A1-B1-C1-D1',
                                isCollapsed: false,
                                nestRowLvl4Key: [
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
                nestRowLvl2Key: [
                    {id: 'A1-B2-C1'},
                    {id: 'A1-B2-C2'}
                ]
            }
        ]
    },
    {
        id: 'A2',
        nestRowLvl1Key: [
            {
                id: 'A2-B1',
                nestRowLvl2Key: [
                    {id: 'A2-B1-C1'},
                    {id: 'A2-B1-C2'}
                ]
            },
            {
                id: 'A2-B2',
                nestRowLvl2Key: [
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
            {`Level ${itemLvl+1} - Item ${idx+1}`}
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
            <h1 style={headerStyle}>via a collapsible key `isCollapsed` in the passed data array</h1>
            <DataGrid
                data={data}
                rows={[
                    [ListItemCmp],
                    ['nestRowLvl1Key', ListItemCmp],
                    ['nestRowLvl2Key', ListItemCmp],
                    ['nestRowLvl3Key', ListItemCmp],
                    ['nestRowLvl4Key', ListItemCmp]
                ]}
                />
        </div>
    )
};