import { IOption, IState, ISelectedRowKeyCtx, IRowCtx, IDistillState } from './type';

export class RowSelectHandle {
    getState(option: Partial<IOption> = {}): IState {
        const { isAll, rowsCtx, currState } = Object.assign(this.defOption, option);
        return isAll ? this.toggleSelectAll(currState) : this.toggleSelectOne(currState, rowsCtx);
    }

    distillState(state: IState): IDistillState {
        const { areAllRowsSelected, selectedRowKeyCtx } = state;
        const isPartiallySelected = !areAllRowsSelected && !!Object.entries(selectedRowKeyCtx).length;
        const hasSelected = areAllRowsSelected || isPartiallySelected;
        return { isPartiallySelected, hasSelected };
    }

    /**
     * Toggle Selection (checkboxes) for all rows:
     * - if 1 or more rows are already selected, Unselect them all
     * - if all rows are selected, Unselect them all
     * - if no rows are selected, Select them all
     */
    toggleSelectAll({ areAllRowsSelected, selectedRowKeyCtx }: IState): IState {
        const isPartiallySelected = selectedRowKeyCtx ? Object.getOwnPropertyNames(selectedRowKeyCtx).length : false;
        return {
            areAllRowsSelected: isPartiallySelected ? false : !areAllRowsSelected,
            selectedRowKeyCtx: {},
        };
    }

    toggleSelectOne({ areAllRowsSelected, selectedRowKeyCtx }: IState, { rows, rowKey }: IRowCtx): IState {
        const { toggleSelect } = this;
        const isRowSelected = selectedRowKeyCtx[rowKey];
        const rowsTotal = rows.length;

        // Add the rest of checkboxes to selected except current one
        if (areAllRowsSelected) {
            rows.forEach(({ id }) => {
                const isTargetRow = id === rowKey;
                if (isTargetRow) return;
                this.toggleSelect(selectedRowKeyCtx, id);
            });
            return { areAllRowsSelected: false, selectedRowKeyCtx };

        // Toggle the current checkbox
        } else {
            toggleSelect(selectedRowKeyCtx, rowKey, !isRowSelected);
            const areAllSelected = rowsTotal === Object.entries(selectedRowKeyCtx).length;
            return areAllSelected
                ? { areAllRowsSelected: true, selectedRowKeyCtx: {} }
                : { areAllRowsSelected: false, selectedRowKeyCtx };
        }
    }

    toggleSelect(selectedRowKeyCtx: ISelectedRowKeyCtx, rowKey: string, doSelect = true) {
        selectedRowKeyCtx[rowKey] = doSelect ? true : null;
        if (!doSelect) delete selectedRowKeyCtx[rowKey];
    }

    get defState(): IState {
        return {
            areAllRowsSelected: false,
            selectedRowKeyCtx: {}
        };
    }

    get defOption(): IOption {
        return {
            isAll: true,
            rowsCtx: null,
            currState: this.defState
        };
    }
}