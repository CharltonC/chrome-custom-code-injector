import { IOption, IState, ISelectedRowIndexes, IRowsContext } from './type';

export class RowSelectHandle {
    readonly ROW_IDX_ERR: string = '`rowIdx` value must be larger than or equal to `startRowIdx` and smaller than `endRowIdx`';

    getState(option: Partial<IOption> = {}): IState {
        const { isAll, rowsCtx, currState } = Object.assign(this.defOption, option);
        return isAll ? this.toggleSelectAll(currState) : this.toggleSelectOne(currState, rowsCtx);
    }

    toggleSelectAll({ areAllRowsSelected }: IState): IState {
        return {
            areAllRowsSelected: !areAllRowsSelected,
            selectedRowsIndexes: {},
        };
    }

    toggleSelectOne({ areAllRowsSelected, selectedRowsIndexes }: IState, { startRowIdx, endRowIdx, rowIdx }: IRowsContext): IState {
        const { toggleSelect, ROW_IDX_ERR } = this;
        const totalItems: number = endRowIdx - startRowIdx;             // since `endRowIdx` is not inclusive
        const selectedRowsIndexesCopy = { ...selectedRowsIndexes };
        const isRowSelected = selectedRowsIndexes[rowIdx];

        if (rowIdx < startRowIdx || rowIdx >= endRowIdx) throw new Error(ROW_IDX_ERR);

        // Add the rest of checkboxes to selected except current one
        if (areAllRowsSelected) {
            for (let i = startRowIdx; i < endRowIdx; i++) {
                const isCurrRow = i === rowIdx;
                const isSelected = i in selectedRowsIndexesCopy;
                const isCurrRowSelected = isCurrRow && isSelected;
                const isUnselectedNonCurrRow = !isCurrRow && !isSelected;

                if (isCurrRowSelected) {
                    toggleSelect(selectedRowsIndexesCopy, i, false);

                } else if (isUnselectedNonCurrRow) {
                    toggleSelect(selectedRowsIndexesCopy, i);
                }
            }

        // Toggle the current checkbox
        } else {
            toggleSelect(selectedRowsIndexesCopy, rowIdx, !isRowSelected);
        }

        // if All checkboxes are selected at that page AFTER the abv operation
        const wereAllSelected = Object.entries(selectedRowsIndexesCopy).length === totalItems;

        return {
            areAllRowsSelected: wereAllSelected ? true : (areAllRowsSelected ? false : areAllRowsSelected),
            selectedRowsIndexes: wereAllSelected ? {} : selectedRowsIndexesCopy
        };
    }

    toggleSelect(selectedRowsIndexes: ISelectedRowIndexes, rowIdx: number, doSelect: boolean = true) {
        selectedRowsIndexes[rowIdx] = doSelect ? true : null;
        if (!doSelect) delete selectedRowsIndexes[rowIdx];
    }

    get defOption(): IOption {
        return {
            isAll: true,
            rowsCtx: null,
            currState: {
                areAllRowsSelected: false,
                selectedRowsIndexes: {},
            }
        };
    }
}