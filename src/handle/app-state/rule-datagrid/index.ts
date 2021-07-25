import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig } from '../../../model/rule-config';
import { HandlerHelper } from '../helper';
import * as TPgn from '../../pagination/type';
import * as TSort from '../../sort/type';

const rowSelectHandle = new RowSelectHandle();

export class RuleDatagridStateHandler extends StateHandle.BaseStateHandler {
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
        const { hsText } = HandlerHelper;
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

                ruleDataGrid: {
                    ...localState.ruleDataGrid,

                    // clear all selections
                    selectState: {
                        areAllRowsSelected: false,
                        selectedRowKeys: {},
                    },

                    // Update pagination
                    ...payload
                }
            }
        };
    }

    //// Row
    onSort({ localState }: AppState, { sortOption }: { sortOption: TSort.IOption, sortState: TSort.IState }) {
        return {
            localState: {
                ...localState,
                ruleDataGrid: {
                    ...localState.ruleDataGrid,
                    sortOption
                }
            }
        };
    }

    onRowSelectToggle({ localState }: AppState, rowIdx: number, totalRules: number) {
        const { ruleDataGrid } = localState;
        const { pgnOption, pgnState, selectState } = ruleDataGrid;
        const { startRowIdx, endRowIdx } = HandlerHelper.getRowIndexCtx(totalRules, pgnOption, pgnState);

        const rowSelectState = rowSelectHandle.getState({
            isAll: false,
            currState: selectState,
            rowsCtx: { startRowIdx, endRowIdx, rowIdx }
        });

        return {
            localState: {
                ...localState,
                ruleDataGrid: {
                    ...ruleDataGrid,
                    selectState: rowSelectState
                }
            }
        };
    }

    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const { ruleDataGrid } = localState;
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: ruleDataGrid.selectState
        });

        return {
            localState: {
                ...localState,
                ruleDataGrid: {
                    ...ruleDataGrid,
                    selectState: rowSelectState
                }
            }
        };
    }

    onRowExpand({ localState }: AppState, expdState: Record<string, number>) {
        const { ruleDataGrid } = localState;
        const { expdRowId } = ruleDataGrid;
        const [ id ]: string[] = Object.getOwnPropertyNames(expdState);

        return {
            localState: {
                ...localState,
                ruleDataGrid: {
                    ...ruleDataGrid,
                    expdRowId: id === expdRowId ? null : id
                }
            }
        };
    }
}