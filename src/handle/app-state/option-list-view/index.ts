import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig } from '../../../model/rule-config';
import { HandlerHelper } from '../helper';
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
        const { startRowIdx, endRowIdx } = HandlerHelper.getRowIndexCtx(totalRules, pgnOption, pgnState);

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
        const { title, value } = HandlerHelper.getActiveItem({
            rules,
            ...activeRule,
            isActiveItem: true,
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
}