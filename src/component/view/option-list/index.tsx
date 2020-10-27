import React, { memo } from 'react';
import { TbRow } from './tb-row';
import { DataGrid } from '../../widget/data-grid';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { IProps } from './type';

export const OptionListView = memo((props: IProps) => {
    const { store, storeHandler } = props;
    const { rules, localState } = store;
    const { isAllRowsSelected, searchedRules } = localState;
    const { onAllRowsToggle } = storeHandler;

    const checkAllHeader = <Checkbox
        id="check-all"
        onClick={onAllRowsToggle}
        />;

    const delAllHeader = <IconBtn
        icon="delete"
        theme="gray"
        disabled={!isAllRowsSelected}
        />;

    return (<>
        <DataGrid
            data={searchedRules || rules}
            type="table"
            component={{
                rows: [
                    [ TbRow ],
                    [ 'paths', TbRow ]
                ],
                commonProps: props
            }}
            rowKey="id"
            header={[
                { title: checkAllHeader as any},
                { title: 'HTTPS' },
                { title: 'ID', sortKey: 'id' },
                { title: 'ADDRESS', sortKey: 'value' },
                { title: 'SCRIPT EXECUTION' },
                { title: 'JS' },
                { title: 'CSS' },
                { title: 'LIBRARY' },
                { title: '' },
                { title: '' },
                { title: delAllHeader as any}
            ]}
            expand={{
                onePerLevel: true
            }}
            sort={{
                key: 'name',
                isAsc: true,
                reset: true,
            }}
            paginate={{
                page: 0,
                increment: [10, 25, 50],
            }}
            />
    </>);
});
