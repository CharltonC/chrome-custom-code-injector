import { IOption, IState, ISelectedRowIndexes, IRowsContext } from './type';

export class RowSelectHandle {
    readonly ROW_IDX_ERR: string = '`rowIdx` value must be larger than or equal to `startRowIdx` and smaller than `endRowIdx`';

    getState(option: Partial<IOption> = {}): IState {
        const { isAll, rowsCtx, currState } = Object.assign(this.defOption, option);
        return isAll ? this.toggleSelectAll(currState) : this.toggleSelectOne(currState, rowsCtx);
    }

    toggleSelectAll({ areAllSelected }: IState): IState {
        return {
            areAllSelected: !areAllSelected,
            selectedIndexes: {},
        };
    }

    toggleSelectOne({ areAllSelected, selectedIndexes }: IState, { startRowIdx, endRowIdx, rowIdx }: IRowsContext): IState {
        const { toggleSelect, ROW_IDX_ERR } = this;
        const totalItems: number = endRowIdx - startRowIdx;             // since `endRowIdx` is not inclusive
        const selectedIndexesCopy = { ...selectedIndexes };
        const isRowSelected = selectedIndexes[rowIdx];

        if (rowIdx < startRowIdx || rowIdx >= endRowIdx) throw new Error(ROW_IDX_ERR);

        // Add the rest of checkboxes to selected except current one
        if (areAllSelected) {
            for (let i = startRowIdx; i < endRowIdx; i++) {
                const isCurrRow = i === rowIdx;
                const isSelected = i in selectedIndexesCopy;
                const isCurrRowSelected = isCurrRow && isSelected;
                const isUnselectedNonCurrRow = !isCurrRow && !isSelected;

                if (isCurrRowSelected) {
                    toggleSelect(selectedIndexesCopy, i, false);

                } else if (isUnselectedNonCurrRow) {
                    toggleSelect(selectedIndexesCopy, i);
                }
            }

        // Toggle the current checkbox
        } else {
            toggleSelect(selectedIndexesCopy, rowIdx, !isRowSelected);
        }

        // if All checkboxes are selected at that page AFTER the abv operation
        const wereAllSelected = Object.entries(selectedIndexesCopy).length === totalItems;

        return {
            areAllSelected: wereAllSelected ? true : (areAllSelected ? false : areAllSelected),
            selectedIndexes: wereAllSelected ? {} : selectedIndexesCopy
        };
    }

    toggleSelect(selectedIndexes: ISelectedRowIndexes, rowIdx: number, doSelect: boolean = true) {
        selectedIndexes[rowIdx] = doSelect ? true : null;
        if (!doSelect) delete selectedIndexes[rowIdx];
    }

    get defOption(): IOption {
        return {
            isAll: true,
            rowsCtx: null,
            currState: {
                areAllSelected: false,
                selectedIndexes: {},
            }
        };
    }
}