import React from 'react';
import { DataList } from '.';

export default {
    title: 'DataList',
    component: DataList,
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
    const sampleData = [
        {
            id: 'A1',
            list: [
                {
                    id: 'A1-B1',
                    list: [
                        {
                            id: 'A1-B1-C1',
                            list: [
                                {id: 'A1-B1-C1-D1'},
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
                    list: [
                        {id: 'A1-B2-C1'},
                        {id: 'A1-B2-C2'}
                    ]
                }
            ]
        },
        {
            id: 'A2',
            list: [
                {
                    id: 'A2-B1',
                    list: [
                        {id: 'A2-B1-C1'},
                        {id: 'A2-B1-C2'}
                    ]
                },
                {
                    id: 'A2-B2',
                    list: [
                        {id: 'A2-B2-C1'},
                        {id: 'A2-B2-C2'}
                    ]
                }
            ]
        }
    ];

    const SampleLvl1Cmp = ({item, idx, nestedRows}) => (
        <li>
            Level 1 item {idx}
            { nestedRows && <ul className="lvl-2" style={nestedUlStyle}>{nestedRows}</ul>}
        </li>
    );

    const SampleLvl2Cmp = ({item, idx, nestedRows}) => (
        <li>
            Level 2 item {idx}
            { nestedRows && <ul className="lvl-3" style={nestedUlStyle}>{nestedRows}</ul>}
        </li>
    );

    const SampleLvl3Cmp = ({item, idx, nestedRows}) => (
        <li>
            Level 3 item {idx}
            { nestedRows && <ul className="lvl-4" style={nestedUlStyle}>{nestedRows}</ul>}
        </li>
    );

    const SampleLvl4Cmp = ({item, idx, nestedRows}) => (
        <li>
            Level 4 item {idx}
            { nestedRows && <ul className="lvl-4" style={nestedUlStyle}>{nestedRows}</ul>}
        </li>
    );

    return (
        <div style={defStyle} >
            <DataList
                data={sampleData}
                row={[
                    ['list',  SampleLvl1Cmp],
                    ['list', SampleLvl2Cmp],
                    ['list', SampleLvl3Cmp],
                    ['list', SampleLvl4Cmp]
                ]}
                />
        </div>
    )
};