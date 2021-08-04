import React from 'react';
import { modals } from '../../../constant/modals';
import { dataHandle } from '../../../data/handler';

import { MemoComponent } from '../../extendable/memo-component';
import { DataGrid } from '../../widget/data-grid';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SortBtn } from '../../base/btn-sort';
import { TbRow } from './tb-row';

import * as TSortHandle from '../../../handle/sort/type';
import { IProps } from './type';

export class OptionListView extends MemoComponent<IProps> {
    render() {
        const {
            onPaginate,
            onSort,
            onRowsSelectToggle,

            onModal,
            onDelHostsModal,
        } = this.appStateHandler;

        const { rules, localState } = this.appState;
        const { pgnOption, pgnState, sortOption, selectState } = this.dataGridState;

        // Data
        const { searchText } = localState.listView;
        const data = dataHandle.getFilteredRules(rules, searchText);

        // Pagination
        const {  increment, incrementIdx } = pgnOption;
        const { curr: page } = pgnState;
        const paginateOption = { page, increment, incrementIdx };
        const expandOption = { onePerLevel: true };

        // Select
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
        const partiallySelected = !!Object.entries(selectedRowKeyCtx).length;
        const isPartiallySelected = !areAllRowsSelected && partiallySelected;
        const hasSelected = areAllRowsSelected || partiallySelected;

        const $selectAll = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartiallySelected ? 'partial' : ''}
                disabled={!data.length}
                checked={hasSelected}
                onChange={onRowsSelectToggle}
                />
        );
        const $title = this.getColRenderFn('TITLE', hasSelected);
        const $address = this.getColRenderFn('ADDRESS', hasSelected);
        const $addHost = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                title="add host rule"
                disabled={hasSelected}
                onClick={() => onModal({
                    id: modals.addHost.id
                })}
                />
        );
        const $delHosts = srcRules => (
            <IconBtn
                icon="delete"
                theme="gray"
                disabled={!hasSelected}
                onClick={() => onDelHostsModal({ srcRules })}
                />
        );
        const headerOption = [
            { title: $selectAll as any },
            { title: 'HTTPS' },
            { title: $title as any, sortKey: 'title' },
            { title: $address as any, sortKey: 'value' },
            { title: 'SCRIPT EXECUTION' },
            { title: 'JS' },
            { title: 'CSS' },
            { title: 'LIBRARY' },
            { title: $addHost as any },
            { title: '' },
            { title: $delHosts as any }
        ];

        return (
            <DataGrid
                type="table"
                rowKey="title"
                expand={expandOption}
                data={data}
                component={{
                    rows: [
                        [ TbRow ],
                        [ 'paths', TbRow ]
                    ],
                    commonProps: this.props
                }}
                header={headerOption}
                sort={sortOption}
                paginate={paginateOption}
                callback={{
                    onPaginateChange: onPaginate,
                    onSortChange: onSort,
                }}
                />
        );
    }

    getColRenderFn(title: string, disabled: boolean) {
        return (data, sortBtnProps: TSortHandle.ICmpSortBtnAttr) => <>
            <span>{title}</span>
            <SortBtn
                {...sortBtnProps}
                disabled={disabled}
                />
        </>;
    }

    get appState() {
        return this.props.appState;
    }

    get appStateHandler() {
        return this.props.appStateHandler;
    }

    get dataGridState() {
        return this.appState.localState.listView.dataGrid;
    }
}