import React, { useState } from 'react';
import { inclStaticIcon } from '../../static/icon';
import { DataGrid } from '.';

export default {
    title: 'Data Grid',
    component: DataGrid,
};

const defStyle = {};
const headerStyle = {
    fontSize: '18px',
    fontStyle: 'bold'
};
const nestedUlStyle = {
    padding: 15,
    listStyle: 'disc'
};

export const DefaultComponent = () => {
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
                                        {id: 'A1-B1-C1-D1-E1'},
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

    const [ data, setData ] = useState(sampleData);

    const ListItemCmp = ({item, idx, nestLvlIdx, nestedRows, ctx, getUpadedCollapsedData}) => {
        const { isCollapsed } = item;
        const showCollapseBtn = nestedRows && typeof isCollapsed !== 'undefined';
        const showNestedRows = nestedRows && (isCollapsed === false || typeof isCollapsed === 'undefined');
        const onCollapseChange = () => {
            const newData = getUpadedCollapsedData(data, ctx, 'isCollapsed');
            setData(newData);
        };

        return (<li>
            Level {nestLvlIdx}-{idx} ({item.id})
            {
                showCollapseBtn &&
                <button type="button" onClick={onCollapseChange}>
                    {item.isCollapsed ? dnArwIconElem : upArwIconElem}
                </button>
            }
            {
                showNestedRows &&
                <ul style={nestedUlStyle}>{nestedRows}</ul>
            }
        </li>);
    };

    return (
        <div style={defStyle} >
            <DataGrid
                data={data}
                row={[
                    [ListItemCmp, 'nestRowLvl1Key'],
                    [ListItemCmp, 'nestRowLvl2Key'],
                    [ListItemCmp, 'nestRowLvl3Key'],
                    [ListItemCmp, 'nestRowLvl4Key'],
                    [ListItemCmp]
                ]}
                /* collapseKey={'isCollapsed'} */
                />
        </div>
    )
};