import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import { IStateHandler } from '../type';
import * as TPgn from '../../pagination/type';
import * as TSort from '../../sort/type';

const rowSelectHandle = new RowSelectHandle();

export class ListViewStateHandler extends StateHandle.BaseStateHandler {
    //// Search
    onSearchTextChange({ localState }: AppState, val: string): Partial<AppState> {
        const { searchedRules } = localState;
        return {
            localState: {
                ...localState,
                searchedText: val,
                searchedRules: val ? searchedRules : null
            }
        };
    }

    onSearchTextClear({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                searchedRules: null,
                searchedText: ''
            }
        };
    }

    onSearchPerform({ localState, rules }: AppState, val: string) {
        const { hsText } = this.reflect;
        const searchedRules: HostRuleConfig[] = val
            .split(/\s+/)
            .reduce((filteredRules: HostRuleConfig[], text: string) => {
                text = text.toLowerCase();

                return filteredRules.filter(({ title, value, paths }: HostRuleConfig) => {
                    // Check Row Id, Value
                    if (hsText([title, value], text)) return true;

                    // Check Sub Row Id, Value
                    return paths.some(({ title: subTitle, value: subValue }) => hsText([subTitle, subValue], text));
                });
            }, rules);

        return {
            localState: {
                ...localState,
                searchedRules,
            }
        };
    }

    //// Pagination
    onPaginate({ localState}: AppState, payload: { pgnOption: TPgn.IOption, pgnState: TPgn.IState }) {
        return {
            localState: {
                ...localState,

                // clear all selections
                selectState: {
                    areAllRowsSelected: false,
                    selectedRowKeys: {},
                },

                // Update pagination
                ...payload
            }
        };
    }

    //// Row
    onSort({ localState }: AppState, { sortOption }: { sortOption: TSort.IOption, sortState: TSort.IState }) {
        return {
            localState: {
                ...localState,
                sortOption
            }
        };
    }

    onRowSelectToggle({ localState }: AppState, rowIdx: number, totalRules: number) {
        const { pgnOption, pgnState } = localState;
        const { getRowIndexCtx } = (this as unknown as IStateHandler).reflect;
        const { startRowIdx, endRowIdx } = getRowIndexCtx(totalRules, pgnOption, pgnState);

        const rowSelectState = rowSelectHandle.getState({
            isAll: false,
            currState: localState.selectState,
            rowsCtx: { startRowIdx, endRowIdx, rowIdx }
        });

        return {
            localState: { ...localState, selectState: rowSelectState }
        };
    }

    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: localState.selectState
        });

        return {
            localState: { ...localState, selectState: rowSelectState }
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

    onItemEdit({ rules, localState }: AppState, { isHost, idx, parentCtxIdx }): Partial<AppState> {
        const activeRule = {
            isHost,
            idx:  isHost ? idx : parentCtxIdx,
            pathIdx: isHost ? null : idx,
        };
        const { title, value } = this.reflect.getListViewActiveItem({
            rules,
            ...activeRule,
        });

        return {
            localState: {
                ...localState,
                isListView: false,
                activeRule,

                // clear the row select state ready for use for DataGrid component in Edit View
                selectState: rowSelectHandle.defState,

                // Input value, validation state
                titleInput: {
                    isValid: null,
                    errMsg: [],
                    value: title,
                },
                hostOrPathInput: {
                    isValid: null,
                    errMsg: [],
                    value
                }
            }
        };
    }

    //// HELPER
    // Search Helper
    hsText(vals: string[], text: string): boolean {
        return vals.some((val: string) => (val.toLowerCase().indexOf(text) !== -1));
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

    // TODO: Common
    getListViewActiveItem({ rules, isHost, idx, pathIdx }): HostRuleConfig | PathRuleConfig {
        const host: HostRuleConfig = rules[idx];
        return isHost ? host : host.paths[pathIdx];
    }
}