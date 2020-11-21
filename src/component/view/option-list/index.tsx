import React from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { DataGrid } from '../../widget/data-grid';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { TbRow } from './tb-row';

import * as TDataGrid from '../../widget/data-grid/type';
import { IProps } from './type';

export class OptionListView extends MemoComponent<IProps> {
    dataGridBaseProps: Partial<TDataGrid.IProps>;

    constructor(props: IProps) {
        super(props);
        const { onPaginate, onSort } = props.storeHandler;

        // Constant props for DataGrid component
        this.dataGridBaseProps = {
            type: 'table',
            rowKey: 'id',
            expand: {
                onePerLevel: true
            },
            callback: {
                onPaginateChange: onPaginate,
                onSortChange: onSort,
            }
        };
    }

    render() {
        const { props, dataGridBaseProps } = this;
        const { rules, localState } = props.store;
        const { searchedRules, pgnOption, pgnState, sortOption, } = localState;
        const { curr: page, increment, incrementIdx } = { ...pgnOption, ...pgnState };
        const { $selectAllHeader, $addHostRule, $delAllHeader } = this.headerElems;

        return (<>
            <DataGrid
                {...dataGridBaseProps}
                data={searchedRules || rules}
                component={{
                    rows: [
                        [ TbRow ],
                        [ 'paths', TbRow ]
                    ],
                    commonProps: props
                }}
                header={[
                    { title: $selectAllHeader as any},
                    { title: 'HTTPS' },
                    { title: 'ID', sortKey: 'id' },
                    { title: 'ADDRESS', sortKey: 'value' },
                    { title: 'SCRIPT EXECUTION' },
                    { title: 'JS' },
                    { title: 'CSS' },
                    { title: 'LIBRARY' },
                    { title: $addHostRule as any },
                    { title: '' },
                    { title: $delAllHeader as any}
                ]}
                sort={sortOption}
                paginate={{ page, increment, incrementIdx }}
                />
        </>);
    }

    // Dynamic react elements based on current state
    get headerElems() {
        const { props } = this;
        const { store, storeHandler } = props;
        const { rules, localState } = store;
        const { searchedRules, selectState } = localState;
        const { onRowsSelectToggle, onAddHostModal, onDelModal } = storeHandler;

        const hsDataSrc = !!(searchedRules ? searchedRules : rules).length;
        const { areAllRowsSelected, selectedRowKeys } = selectState;
        const totalSelected: number = Object.entries(selectedRowKeys).length;
        const hsSelected: boolean = areAllRowsSelected || !!totalSelected;
        const isPartialSelected = !areAllRowsSelected && !!totalSelected;

        const $selectAllHeader = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartialSelected ? 'partial' : ''}
                disabled={!hsDataSrc}
                checked={hsSelected}
                onChange={onRowsSelectToggle}
                />
        );

        const $addHostRule = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                title="add host rule"
                disabled={hsSelected}
                onClick={onAddHostModal}
                />
        );

        const $delAllHeader = (dataSrc) => (
            <IconBtn
                icon="delete"
                theme="gray"
                disabled={!hsSelected}
                onClick={() => onDelModal({ dataSrc })}
                />
        );

        return { $selectAllHeader, $addHostRule, $delAllHeader };
    }
}