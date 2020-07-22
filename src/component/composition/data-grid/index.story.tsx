import React from 'react';
import { TableHeader as TableHeaderCmp } from '../../prsntn-grp/table-header';
import { Pagination as PaginationCmp } from '../../prsntn-grp/pagination';
import { DataGrid } from './';


export default {
    title: 'Data Grid',
    component: DataGrid,
};

const defStyle = { padding: 20 };
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
    const TrCmp = ({idx, rowType, item, itemLvl, nestedItems, toggleProps}) => {
        const { isOpen, onToggle }: any = nestedItems ? toggleProps : {};
        return <>
            <tr className={`kz-datagrid__row kz-datagrid__row--${rowType}`}>
                <td>{ (itemLvl === 0 ? '' : `Level ${itemLvl} - `) + `Item ${idx+1}`}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.id}</td>
                <td>{ nestedItems &&
                    <button type="button" onClick={onToggle}>
                        {isOpen ? '-' : '+' }
                    </button>}
                </td>
            </tr>{ nestedItems && isOpen &&
            <tr className="kz-datagrid__nested-row">
                <td colSpan={5}>
                    {nestedItems}
                </td>
            </tr>}
        </>;
    };

    return (
        <div style={defStyle}>
            <DataGrid
                data={sampleData}
                type={'table'}
                rowKey="id"
                header={[
                    { title: 'level' },
                    { title: 'last name', sortKey: 'name' },
                    { title: 'age', sortKey: 'age' },
                    { title: 'id', sortKey: 'id' },
                    { title: '' },
                ]}
                component={{
                    header: TableHeaderCmp,
                    pagination: PaginationCmp,
                    rows: [
                        [TrCmp],
                        ['lvl1key', TrCmp],
                        ['lvl2key', TrCmp],
                        ['lvl3key', TrCmp],
                        ['lvl4key', TrCmp]
                    ]
                }}
                expand={{
                    showInitial: 'NONE',
                    showOnePerLvl: true
                }}
                sort={{
                    key: 'name',
                    isAsc: true,
                    reset: true,
                }}
                paginate={{
                    page: 0,
                    increment: [10, 1],
                }}
                callback={{
                    onPaginateChange: (modState) => console.log(modState),
                    onSortChange: (modState) => console.log(modState),
                    onExpandChange: (modState) => console.log(modState)
                }}
                />
        </div>
    );
};