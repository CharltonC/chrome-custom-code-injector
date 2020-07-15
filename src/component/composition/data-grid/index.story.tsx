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

const sampleData: any[] = [
    {

        name: 'Zack',
        age: '21',
        id: 'A1',
        isCollapsed: false,
        lvl1key: [
            {

                name: 'John',
                age: '21',
                id: 'A1-B1',
                isCollapsed: false,
                lvl2key: [
                    {

                        name: 'John',
                        age: '21',
                        id: 'A1-B1-C1',
                        isCollapsed: false,
                        lvl3key: [
                            {

                                name: 'John',
                                age: '21',
                                id: 'A1-B1-C1-D1',
                                isCollapsed: false,
                                lvl4key: [
                                    {
                                        name: 'John',
                                        age: '21',
                                        id: 'A1-B1-C1-D1-E1'},
                                    {
                                        name: 'John',
                                        age: '21',
                                        id: 'A1-B1-C1-D1-E2'},
                                ]
                            },
                            {
                                name: 'John',
                                age: '21',
                                id: 'A1-B1-C2-D2'},
                            {
                                name: 'John',
                                age: '21',
                                id: 'A1-B1-C1-D3'},
                            {
                                name: 'John',
                                age: '21',
                                id: 'A1-B1-C2-D4'}
                        ]
                    },
                    {
                        name: 'John',
                        age: '21',
                        id: 'A1-B1-C2'}
                ]
            },
            {

                name: 'John',
                age: '21',
                id: 'A1-B2',
                lvl2key: [
                    {
                        name: 'John',
                        age: '21',
                        id: 'A1-B2-C1'},
                    {
                        name: 'John',
                        age: '21',
                        id: 'A1-B2-C2'}
                ]
            }
        ]
    },
    {

        name: 'Jane',
        age: '10',
        id: 'A2',
        lvl1key: [
            {

                name: 'John',
                age: '21',
                id: 'A2-B1',
                lvl2key: [
                    {
                        name: 'John',
                        age: '21',
                        id: 'A2-B1-C1'},
                    {
                        name: 'John',
                        age: '21',
                        id: 'A2-B1-C2'}
                ]
            },
            {

                name: 'John',
                age: '21',
                id: 'A2-B2',
                lvl2key: [
                    {
                        name: 'John',
                        age: '21',
                        id: 'A2-B2-C1'},
                    {
                        name: 'John',
                        age: '21',
                        id: 'A2-B2-C2'}
                ]
            }
        ]
    },
    {
        name: 'Michael',
        age: '16',
        id: 'A3',
        lvl1key: [
            {

                name: 'John',
                age: '21',
                id: 'A3-B1',
            }
        ]
    }
];

export const ViaInternalGeneratedCollapsibleState = () => {
    const TrCmp = ({idx, item, itemPath, itemLvl, nestedItems, nestedTb, isNestedOpen, onCollapseChanged, isExpd, onExpdChange}) => {

        return <>
            <tr>
                <td>{ (itemLvl === 0 ? '' : `Level ${itemLvl} - `) + `Item ${idx+1}`}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.id}</td>
                <td>{
                    nestedItems &&
                    <button type="button" onClick={onExpdChange}>
                        {isExpd ? '-' : '+' }
                    </button>
                }</td>
            </tr>
            {
                nestedItems && isExpd &&
                <tr>
                    <td colSpan={5}>
                        {nestedTb}
                    </td>
                </tr>
            }
        </>;
    };

    const [data, setData] = useState(sampleData);

    const addData = () => {
        const newData = data.slice(0);
        newData.push({
            name: 'Zoe',
            age: '21',
            id: 'A2',
        });
        setData(newData);
    };

    return (
        <div style={defStyle}>
            <button type="button" onClick={addData}>add data</button>
            <DataGrid
                data={data}
                rowKey="id"
                rows={[
                    [TrCmp],
                    ['lvl1key', TrCmp],
                    ['lvl2key', TrCmp],
                    ['lvl3key', TrCmp],
                    ['lvl4key', TrCmp]
                ]}
                type={'table'}
                header={[
                    {title: 'level'},
                    {title: 'last name', sortKey: 'name'},
                    {title: 'age', sortKey: 'age'},
                    {title: 'id', sortKey: 'id'},
                    {title: ''},
                ]}
                expand={{
                    showInitial: 'NONE',
                    // showOnePerLvl: true
                }}
                sort={{
                    key: 'name',
                    isAsc: true
                }}
                paginate={{
                    page: 0,
                    increment: [10, 1],
                }}
                callback={{
                    onPaginateChange: (modState) => console.log(modState)
                }}
                 // show one only at a time
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