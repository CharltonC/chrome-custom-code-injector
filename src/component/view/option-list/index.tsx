import React from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { DataGrid } from '../../widget/data-grid';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SortBtn } from '../../base/btn-sort';
import { TbRow } from './tb-row';
import * as TDataGrid from '../../widget/data-grid/type';
import * as TSortHandle from '../../../handle/sort/type';
import { IProps } from './type';

export class OptionListView extends MemoComponent<IProps> {
    dataGridBaseProps: Partial<TDataGrid.IProps>;

    constructor(props: IProps) {
        super(props);
        const { onPaginate, onSort } = props.appStateHandler;

        // Constant props for DataGrid component
        this.dataGridBaseProps = {
            type: 'table',
            rowKey: 'title',
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
        const { props, dataGridBaseProps, headerProps } = this;
        const { rules, localState } = props.appState;
        const { ruleDataGrid } = localState;
        const { pgnOption, pgnState, sortOption } = ruleDataGrid;
        const { curr: page, increment, incrementIdx } = { ...pgnOption, ...pgnState };

        // TODO: Filter rules if search text exists
        return (<>
            <DataGrid
                {...dataGridBaseProps}
                data={rules}
                component={{
                    rows: [
                        [ TbRow ],
                        [ 'paths', TbRow ]
                    ],
                    commonProps: props
                }}
                header={headerProps}
                sort={sortOption}
                paginate={{ page, increment, incrementIdx }}
                />
        </>);
    }

    get headerProps() {
        const { props } = this;
        const { appState, appStateHandler } = props;
        const { rules, localState } = appState;
        const { ruleDataGrid } = localState;
        const { onRowsSelectToggle, onAddHostModal } = appStateHandler;

        // TODO: Filter rules if search text exists
        const hsDataSrc = !!rules.length;
        const { areAllRowsSelected, selectedRowKeyCtx } = ruleDataGrid.selectState;
        const totalSelected: number = Object.entries(selectedRowKeyCtx).length;
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

        const $id = this.getHeaderColRenderFn('ID', hsSelected);
        const $addr = this.getHeaderColRenderFn('ADDRESS', hsSelected);

        const $addHostRule = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                title="add host rule"
                disabled={hsSelected}
                onClick={onAddHostModal}
                />
        );

        const $delAllHeader = dataSrc => (
            <IconBtn
                icon="delete"
                theme="gray"
                disabled={!hsSelected}
                />
        );

        return [
            { title: $selectAllHeader as any },
            { title: 'HTTPS' },
            { title: $id as any, sortKey: 'title' },
            { title: $addr as any, sortKey: 'value' },
            { title: 'SCRIPT EXECUTION' },
            { title: 'JS' },
            { title: 'CSS' },
            { title: 'LIBRARY' },
            { title: $addHostRule as any },
            { title: '' },
            { title: $delAllHeader as any }
        ];
    }

    getHeaderColRenderFn(title: string, disabled: boolean) {
        return (data, sortBtnProps: TSortHandle.ICmpSortBtnAttr) => <>
            <span>{title}</span>
            <SortBtn {...sortBtnProps} disabled={disabled} />
        </>;
    }
}