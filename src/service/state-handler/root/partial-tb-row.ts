import { RowSelectHandle } from '../../handle/row-select';
import { StateHandle } from '../../handle/state';
import { AppState } from '../../model/app-state';
import { HostRuleConfig } from '../../model/rule-config';
import { resultsPerPage } from '../../constant/result-per-page';

export class TbRowStateHandler extends StateHandle.BaseStoreHandler {
    rowSelectHandle = new RowSelectHandle();

    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const { areAllRowsSelected, selectedRowKeys } = localState;

        const rowSelectState = this.rowSelectHandle.getState({
            isAll: true,
            currState: { areAllRowsSelected, selectedRowKeys }
        });

        return {
            localState: { ...localState, ...rowSelectState }
        };
    }

    onRowSelectToggle({ localState, rules }: AppState, rowIdx: number) {
        const { areAllRowsSelected, searchedRules, selectedRowKeys, pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx } = localState;
        const totalRules: number = searchedRules?.length || rules.length;

        const { startRowIdx, endRowIdx } = this.reflect.getRowIndexCtx({
            totalRules,
            pgnIncrmIdx,
            pgnItemStartIdx,
            pgnItemEndIdx
        });

        const rowSelectState = this.rowSelectHandle.getState({
            isAll: false,
            currState: { areAllRowsSelected, selectedRowKeys },
            rowsCtx: { startRowIdx, endRowIdx, rowIdx }
        });

        return {
            localState: { ...localState, ...rowSelectState }
        };
    }

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

    onRowSwitchToggle({ rules }: AppState, idx: number, key: string): Partial<AppState> {
        const clone = rules.slice();
        const value = clone[idx][key];
        clone[idx][key] = !value;
        return { rules: clone };
    }

    onRowEdit(state: AppState, targetItem): Partial<AppState> {
        const { localState } = state;
        return {
            localState: {
                ...localState,
                targetItem,
                currView: 'EDIT'
            }
        };
    }

    onRowRmv({ localState }: AppState, idx: number, parentIdx?: number) {
        const { sortedData } = localState;
        const modItems = Number.isInteger(parentIdx) ? sortedData[parentIdx].paths : sortedData;
        modItems.splice(idx, 1);

        return {
            rules: sortedData,
            localState: {
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    onSearchedRowRmv(appState: AppState, idx: number, parentIdx?: number) {
        const { localState: currLocalState, rules: currRules } = appState;
        const { searchedRules } = currLocalState;
        const searchedRulesCopy = searchedRules.concat();
        const isRmvSubRow = Number.isInteger(parentIdx);

        // Remove the matching item in global rules
        if (isRmvSubRow) {
            // Since both searchRules & rules points to the same array item and since we only modifying its array children,
            // we dont need to copy the rules
            const modRow = searchedRulesCopy[parentIdx];
            modRow.paths.splice(idx, 1);
            return { ...appState };

        } else {
            const rmvRow = searchedRulesCopy[idx];
            const idxInRules = currRules.indexOf(rmvRow, 0);

            // Remove the matching item in global rules
            const { rules, localState } = this.reflect.onRowRmv({
                ...appState,
                localState: {
                    ...currLocalState,
                    sortedData: currRules     // modify the global rules instead of  `sortedData` (which is eqv. to searched rules)
                }
            }, idxInRules, null);

            // We only need to modify the searched rule if it is NOT a child item, in order to async with the global rules
            searchedRulesCopy.splice(idx, 1);

            return {
                rules,
                localState: {
                    ...localState,
                    searchedRules: searchedRulesCopy,
                }
            }
        }
    }

    onRowsRmv({ localState }: AppState) {
        const { getRowIndexCtx } = this.reflect;
        const { areAllRowsSelected, selectedRowKeys, pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, sortedData } = localState;
        const totalRules = sortedData.length;
        const { startRowIdx, totalVisibleRows } = getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules });
        let modRules: HostRuleConfig[] = sortedData.concat();

        // For all rows selected
        if (areAllRowsSelected) {
            // - if only 1 page regardless of pagination or not, remove all items
            // - if not, then only remove all items at that page
            const hsOnlyOnePage = totalRules <= totalVisibleRows;
            if (hsOnlyOnePage) {
                modRules = [];
            } else {
                modRules.splice(startRowIdx, totalVisibleRows);
            }

        // For partial rows selected
        } else {
            const rowIndexes: [string, boolean][] = Object.entries(selectedRowKeys);
            const selectedRowsTotal: number = rowIndexes.length - 1;

            // Remove the item from the end of array so that it doesnt effect the indexes from the beginning
            for (let i = selectedRowsTotal; i >= 0; i--) {
                const rowIdx: number = Number(rowIndexes[i][0]);
                modRules.splice(rowIdx, 1);
            }
        }

        return {
            rules: modRules,
            localState: {
                areAllRowsSelected: false,
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    onSearchedRowsRmv({ localState, rules }: AppState) {
        const { searchedRules,
            areAllRowsSelected, selectedRowKeys,
            pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx,
            sortedData
        } = localState;

        // Contextual to Searched Rules (not the global rules)
        const totalRules = sortedData.length;
        const { startRowIdx, totalVisibleRows } = this.reflect.getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules });
        let modSearchedRules: HostRuleConfig[] = sortedData.concat();
        let modRules: HostRuleConfig[];

        // For all rows selected
        if (areAllRowsSelected) {
            const hsOnlyOnePage = totalRules <= totalVisibleRows;

            // If only 1 page, i.e. all selected
            if (hsOnlyOnePage) {
                modSearchedRules = [];
                modRules = rules.filter((rule) => {
                    // exclude all the rules that are in `searchRules` (i.e. the removed ones in `modSearchedRules`)
                    return !searchedRules.includes(rule);
                });

            // If > 1 page, i.e. only all selected at that page
            } else {
                const rmvRules = searchedRules.slice(startRowIdx, pgnItemEndIdx);
                modSearchedRules.splice(startRowIdx, totalVisibleRows);
                modRules = rules.filter((rule) => !rmvRules.includes(rule));
            }

        // For partial rows selected
        } else {
            const rowIndexes: [string, boolean][] = Object.entries(selectedRowKeys);
            const selectedRowsTotal: number = rowIndexes.length - 1;

            // Remove the item from the end of array so that it doesnt effect the indexes from the beginning
            for (let i = selectedRowsTotal; i >= 0; i--) {
                const rowIdx: number = Number(rowIndexes[i][0]);
                modSearchedRules.splice(rowIdx, 1);
            }

            // Update the global rules
            modRules = rules.filter((rule) => modSearchedRules.includes(rule));
        }

        // TODO: clear pagination index as well
        return {
            rules: modRules,
            localState: {
                searchedRules: modSearchedRules,
                areAllRowsSelected: false,
                selectedRowKeys: {},     // in case of side-effect on `selectedRowKeys` state
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
    getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules }) {
        // either the total no. of results per page OR the total results
        // - e.g. 10 per page, 5 total results --> max no. of items shown on that page is 5
        // - e.g. 5 per page, 10 results --> max no. of items shown on that page is 5
        const totalVisibleRowsAllowed: number = Math.min(totalRules, resultsPerPage[pgnIncrmIdx]);

        // Find in the actual end index of the row in the actual data based on the pagination context
        const assumeEndIdx: number = pgnItemStartIdx + (Number.isInteger(pgnItemEndIdx) ? pgnItemEndIdx : totalVisibleRowsAllowed);
        const endRowIdx: number = assumeEndIdx <= totalRules ? assumeEndIdx : totalRules;

        return {
            startRowIdx: pgnItemStartIdx,
            endRowIdx,
            totalVisibleRows: endRowIdx - pgnItemStartIdx,
            totalVisibleRowsAllowed
        };
    }
}