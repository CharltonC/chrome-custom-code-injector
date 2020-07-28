import React, { useState } from 'react';
import { TableHeader } from '.';

export default {
    title: 'Table Header',
    component: TableHeader,
};

const defStyle = {};

export const WithoutSortButton = () => {
    const sampleThRowsContext = [
        [ {title: 'A', colSpan: 2}, {title: 'B', rowSpan: 2} ],
        [ {title: 'A1'}, {title: 'A2'} ]
    ];

    return (
        <table style={defStyle} >
            <TableHeader thRowsContext={sampleThRowsContext} />
        </table>
    );
};

export const WithSortButton = () => {
    const [ sortState, setSortState ] = useState({
        isAsc: true,
        key: 'name'
    });

    const sampleThRowsContext = [
        [ {title: 'A', sortKey: 'name'}, {title: 'B', sortKey: 'age'} ]
    ];

    const sortBtnProps = (sortKey) => {
        return {
            isAsc: sortState.key === sortKey ? sortState.isAsc : null,
            onClick: () => setSortState({
                key: sortKey,
                isAsc: sortState.key === sortKey ? !sortState.isAsc : true
            })
        };
    }

    return (
        <table style={defStyle} >
            <TableHeader
                thRowsContext={sampleThRowsContext}
                sortBtnProps={sortBtnProps}
                />
        </table>
    );
};