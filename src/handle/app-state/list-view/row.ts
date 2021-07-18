import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig } from '../../../model/rule-config';
import * as TPgn from '../../pagination/type';

const rowSelectHandle = new RowSelectHandle();

export class TbRowStateHandler extends StateHandle.BaseStateHandler {
    onRowExpand({ localState }: AppState, expdState: Record<string, number>) {
        const { expdRowId } = localState;
        const [ id ]: string[] = Object.getOwnPropertyNames(expdState);

        return {
            localState: {
                ...localState,
                expdRowId: id === expdRowId ? null : id
            }
        };
    }

    onRowJsStageChange({ rules }: AppState, idx: number, modIdx): Partial<AppState> {
        const clone = rules.slice();
        clone[idx].jsExecPhase = modIdx;
        return { rules: clone };
    }

    onRowSwitchToggle(state: AppState, { item, key }): Partial<AppState> {
        item[key] = !item[key];
        return {};
    }

    onRowEdit(state: AppState, editViewTarget): Partial<AppState> {
        const { localState } = state;
        return {
            localState: {
                ...localState,
                editViewTarget,
                selectState: rowSelectHandle.defState,      // clear the row select state ready for use for DataGrid component in Edit View
            }
        };
    }

    //// HELPER (used only in `reflect`)
    /**
     * Remove row or sub row
     */
    rmvRow({ localState }: AppState, idx: number, parentIdx?: number) {
        const { dataSrc } = localState;      // set by `onDelModal`
        const isSubRow = Number.isInteger(parentIdx);
        const modItems = isSubRow ? dataSrc[parentIdx].paths : dataSrc;
        modItems.splice(idx, 1);

        return {
            rules: dataSrc,
            localState: {}
        };
    }

    rmvSearchedRow(state: AppState, idx: number, parentIdx?: number) {
        const { reflect } = this;
        const { rules: currRules, localState } = state;
        const { searchedRules: currSearchedRules } = localState;
        const isSubRow = Number.isInteger(parentIdx);

        // Remove either row or sub row for searched rules
        const { rules: searchedRules } = reflect.rmvRow(state, idx, parentIdx);

        // If Not sub row, Remove corresponding row in global rules as well
        const ruleIdx = isSubRow ? null : currRules.indexOf(currSearchedRules[idx]);
        const modRules = isSubRow ? currRules : reflect.rmvRow({
            ...state,
            localState: {
                ...localState,
                dataSrc: currRules       // replace the ref & point to global rules
            }
        }, ruleIdx, null).rules;

        return {
            rules: modRules,
            localState: {
                searchedRules
            }
        };
    }

    rmvRows(state: AppState) {
        const { areAllRowsSelected } = state.localState.selectState;
        const { reflect } = this;
        return areAllRowsSelected ? reflect.rmvAllRows(state) : reflect.rmvPartialRows(state);
    }

    rmvAllRows({ localState }: AppState) {
        const { dataSrc, pgnOption, pgnState } = localState;
        const totalRules = dataSrc.length;
        const { startRowIdx, totalVisibleRows } = this.reflect.getRowIndexCtx(totalRules, pgnOption, pgnState);
        let modRules: HostRuleConfig[] = dataSrc.concat();

        // - if only 1 page regardless of pagination or not, remove all items
        // - if not, then only remove all items at that page
        if (totalRules <= totalVisibleRows) {
            modRules = [];

        } else {
            modRules.splice(startRowIdx, totalVisibleRows);
        }

        return {
            rules: modRules,
            localState: {}
        };
    }

    rmvPartialRows({ localState }: AppState ) {
        const { selectState, dataSrc } = localState;
        const rowIndexes: [string, boolean][] = Object.entries(selectState.selectedRowKeys);
        const selectedRowsTotal: number = rowIndexes.length - 1;
        let modRules: HostRuleConfig[] = dataSrc.concat();

        // Remove the item from the end of array so that it doesnt effect the indexes from the beginning
        for (let i = selectedRowsTotal; i >= 0; i--) {
            const rowIdx: number = Number(rowIndexes[i][0]);
            modRules.splice(rowIdx, 1);
        }

        return {
            rules: modRules,
            localState: {}
        };
    }

    rmvSearchedRows(state: AppState) {
        const { reflect } = this;
        const { localState, rules } = state;
        const { searchedRules } = localState;

        // Update the searched rules
        const { rules: modSearchedRules } = reflect.rmvRows(state);

        // Update corresponding global rules by Excluding all removed searched rows
        const removedSearchedRules = searchedRules.filter(rule => !modSearchedRules.includes(rule));
        const modRules: HostRuleConfig[] = rules.filter(rule => !removedSearchedRules.includes(rule));

        return {
            rules: modRules,
            localState: {
                searchedRules: modSearchedRules
            }
        };
    }

    /**
     *
     * Formula for calculating a row's end index used for rows removal at a specific page when all rows are selected
     * - e.g.
     * Total Rows | Per Page | Start Row Index | Removal Indexes | End Index (which needs to be calculated)
     * -----------------------------------------------------------------
     * 3          | 2        | 0               | 0-1             | 2
     * 3          | 2        | 2               | 2               | 3
     * 5          | 10       | 0               | 0-4             | 5
     * 2          | 1        | 0               | 0               | 1
     * 2          | 1        | 1               | 1               | 2
     */
    getRowIndexCtx(totalRules: number, pgnOption: TPgn.IOption, pgnState: TPgn.IState) {
        const { increment, incrementIdx } = pgnOption;
        const { startIdx, endIdx } = pgnState;

        // either the total no. of results per page OR the total results
        // - e.g. 10 per page, 5 total results --> max no. of items shown on that page is 5
        // - e.g. 5 per page, 10 results --> max no. of items shown on that page is 5
        const totalVisibleRowsAllowed: number = Math.min(totalRules, increment[incrementIdx]);

        // Find in the actual end index of the row in the actual data based on the pagination context
        const assumeEndIdx: number = startIdx + (Number.isInteger(endIdx) ? endIdx : totalVisibleRowsAllowed);
        const endRowIdx: number = assumeEndIdx <= totalRules ? assumeEndIdx : totalRules;

        return {
            startRowIdx: startIdx,
            endRowIdx,
            totalVisibleRows: endRowIdx - startIdx,
            totalVisibleRowsAllowed
        };
    }
}