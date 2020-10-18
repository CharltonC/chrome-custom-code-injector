import React, { memo } from 'react';
import { TbRow } from './tb-row';
import { DataGrid } from '../../widget/data-grid';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';

const dataGridConfig: any = {
    type: "table",
    component: {
        rows: [
            [ TbRow ],
            [ 'paths', TbRow ]
        ]
    },
    rowKey: "id",
    header: [
        { title: <Checkbox id="check-all" /> },
        { title: 'HTTPS' },
        { title: 'ID', sortKey: 'id' },
        { title: 'ADDRESS', sortKey: 'addr' },
        { title: 'SCRIPT EXECUTION' },
        { title: 'JS' },
        { title: 'CSS' },
        { title: 'LIBRARY' },
        { title: '' },
        { title: '' },
        { title: <IconBtn icon="delete" theme="gray" /> }
    ],
    expand:{
        onePerLevel: true
    },
    sort: {
        key: 'name',
        isAsc: true,
        reset: true,
    },
    paginate:{
        page: 0,
        increment: [10, 25, 50],
    }
};

export const OptionListView = memo(({ data }: any) => {
    return (<>
        <DataGrid {...dataGridConfig} data={data} />
    </>);
});
