import React from 'react';
import { dataManager } from '../../../data/manager';

import { MemoComponent } from '../../extendable/memo-component';
import { DataGrid } from '../../widget/data-grid';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SortBtn } from '../../base/btn-sort';
import { TbRow } from './tb-row';

import * as TSortHandle from '../../../handle/sort/type';
import { HostRuleConfig } from '../../../data/model/rule-config';
import { IProps } from './type';

export class OptionListView extends MemoComponent<IProps> {
    render() {
        const {
            onPaginate,
            onSort,
            onRowsSelectToggle,

            onAddHostModal,
            onDelHostsModal,
        } = this.appStateManager;

        const { rules, localState } = this.appState;
        const { pgnOption, pgnState, sortOption, selectState } = this.dataGridState;

        // Data
        const { searchText } = localState.listView;
        const data = dataManager.getFilteredRules(rules, searchText);

        // Pagination
        const { increment, incrementIdx } = pgnOption;
        const { curr: page } = pgnState;

        // Select
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
        const partiallySelected = !!Object.entries(selectedRowKeyCtx).length;
        const isPartiallySelected = !areAllRowsSelected && partiallySelected;
        const hasSelected = areAllRowsSelected || partiallySelected;

        // Sort
        const isSortDisabled = hasSelected || data.length <= 1;

        // Header
        const $selectAll = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartiallySelected ? 'partial' : ''}
                disabled={!data.length}
                checked={hasSelected}
                onChange={onRowsSelectToggle}
                />
        );
        const $title = (data: HostRuleConfig[], sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>TITLE</span>
                <SortBtn {...sortBtnProps} disabled={isSortDisabled} />
            </>
        );
        const $address = (data: HostRuleConfig[], sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>ADDRESS</span>
                <SortBtn {...sortBtnProps} disabled={isSortDisabled} />
            </>
        );
        const $addHost = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                title="add host rule"
                disabled={hasSelected}
                onClick={onAddHostModal}
                />
        );
        const $delHosts = (srcRules: HostRuleConfig[], btnProps, pgnState) => {
            const { startIdx, endIdx } = pgnState;
            const sliceIdxCtx = { startIdx, endIdx };
            return (
                <IconBtn
                    icon="delete"
                    theme="gray"
                    disabled={!hasSelected}
                    onClick={() => onDelHostsModal({
                        srcRules,
                        sliceIdxCtx
                    })}
                    />
            );
        };

        return (
            <DataGrid
                type="table"
                rowKey="title"
                expand={{ onePerLevel: true }}
                data={data}
                component={{
                    rows: [
                        [ TbRow ],
                        [ 'paths', TbRow ]
                    ],
                    commonProps: this.props
                }}
                header={[
                    { title: $selectAll },
                    { title: 'HTTPS' },
                    { title: $title, sortKey: 'title' },
                    { title: $address, sortKey: 'value' },
                    { title: 'CODE EXECUTION' },
                    { title: 'JS' },
                    { title: 'CSS' },
                    { title: 'LIBRARY' },
                    { title: $addHost },
                    { title: '' },
                    { title: $delHosts }
                ]}
                sort={sortOption}
                paginate={{ page, increment, incrementIdx }}
                callback={{
                    onPaginateChange: onPaginate,
                    onSortChange: onSort,
                }}
                />
        );
    }

    get appState() {
        return this.props.appState;
    }

    get appStateManager() {
        return this.props.appStateManager;
    }

    get dataGridState() {
        return this.appState.localState.listView.dataGrid;
    }
}