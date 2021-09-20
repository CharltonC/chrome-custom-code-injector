import { cloneDeep } from 'lodash';
import { StateHandle } from '../../state';
import { RowSelectHandle } from '../../row-select';
import { dataHandle } from '../../data';
import { chromeHandle } from '../../chrome';

import { HostRule } from '../../../model/rule';
import { TextInputState } from '../../../model/text-input-state';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { AppState } from '../../../model/app-state';
import { IOnPaginatePayload, IOnSortPayload, IOnRowSelectTogglePayload, IOnJsExecStepChangePayload } from './type';

const rowSelectHandle = new RowSelectHandle();

export class OptionListViewStateHandle extends StateHandle.BaseStateManager {
    //// DATA GRID
    onSearchTextChange({ localState }: AppState, payload: {value: string}): Partial<AppState> {
        const { value } = payload;
        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    searchText: value,
                }
            }
        };
    }

    onSearchTextClear({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    searchText: ''
                }
            }
        };
    }

    onPaginate({ localState}: AppState, payload: IOnPaginatePayload): Partial<AppState> {
        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    dataGrid: {
                        ...localState.listView.dataGrid,

                        // clear all selections
                        selectState: {
                            areAllRowsSelected: false,
                            selectedRowKeyCtx: {},
                        },

                        // Update pagination
                        ...payload
                    }
                }
            }
        };
    }

    onSort({ localState }: AppState, payload: IOnSortPayload): Partial<AppState> {
        const { sortOption } = payload;
        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    dataGrid: {
                        ...localState.listView.dataGrid,
                        sortOption,
                    }
                }
            }
        };
    }

    onRowSelectToggle({ localState }: AppState, payload: IOnRowSelectTogglePayload): Partial<AppState> {
        const { dataSrc, hostId } = payload;
        const { dataGrid } = localState.listView;
        const {
            pgnState,
            selectState: currSelectState,
        } = dataGrid;

        // Rows select state based on the datagrid source and pagination (if any)
        const { startIdx, endIdx } = pgnState;
        const selectState = rowSelectHandle.getState({
            isAll: false,
            currState: currSelectState,
            rowsCtx: {
                // This is relative to data passed to DataGrid component (could be sorted, paginationed)
                rows: dataSrc.slice(startIdx, endIdx),
                rowKey: hostId,
             }
        });

        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    dataGrid: {
                        ...dataGrid,
                        pgnState,
                        selectState,
                    }
                }
            }
        };
    }

    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const { dataGrid } = localState.listView;
        const { selectState } = dataGrid;
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: selectState
        });
        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    dataGrid: {
                        ...dataGrid,
                        selectState: rowSelectState
                    }
                }
            }
        };
    }

    onRowExpand({ localState }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const { hostId } = payload;
        const { dataGrid } = localState.listView;
        const { expdRowId } = dataGrid;

        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    dataGrid: {
                        ...dataGrid,
                        expdRowId: hostId === expdRowId ? null : hostId
                    }
                }
            }
        };
    }

    onEditView({ rules: _rules, localState }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const { editView } = localState;

        // Get the title and value of the item to be used in input placeholders
        const rules: HostRule[] = cloneDeep(_rules);
        const { title, value } = dataHandle.getRuleFromIdCtx(rules, payload);
        const titleInput = new TextInputState({ value: title });
        const valueInput = new TextInputState({ value });

        return {
            rules,
            localState: {
                ...localState,

                // Edit Mode & active item, item states
                isListView: false,

                editView: {
                    ...editView,
                    ruleIdCtx: payload,
                    titleInput,
                    valueInput,
                }
            }
        };
    }

    // Shared btw List & Edit View
    onHttpsToggle({ rules: _rules }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const rules: HostRule[] = cloneDeep(_rules);
        dataHandle.toggleHttpsSwitch(rules, payload);
        chromeHandle.saveState({rules});
        return { rules };
    }

    // Shared btw List & Edit View
    onExactMatchToggle({ rules: _rules }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const rules: HostRule[] = cloneDeep(_rules);
        dataHandle.toggleExactSwitch(rules, payload);
        chromeHandle.saveState({rules});
        return { rules };
    }

    // Shared btw List & Edit View
    onJsExecStepChange({ rules: _rules }: AppState, payload: IOnJsExecStepChangePayload): Partial<AppState> {
        const { selectValueAttrVal, ...ruleIdCtx } = payload;
        const rules: HostRule[] = cloneDeep(_rules);
        dataHandle.toggleJsExecStep(rules, ruleIdCtx, selectValueAttrVal);
        chromeHandle.saveState({rules});
        return { rules };
    }

    onJsToggle({ rules: _rules }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const rules: HostRule[] = cloneDeep(_rules);
        dataHandle.toggleJsSwitch(rules, payload);
        chromeHandle.saveState({rules});
        return { rules };
    }

    onCssToggle({ rules: _rules }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const rules: HostRule[] = cloneDeep(_rules);
        dataHandle.toggleCssSwitch(rules, payload);
        chromeHandle.saveState({rules});
        return { rules };
    }

    onLibToggle({ rules: _rules }: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const rules: HostRule[] = cloneDeep(_rules);
        dataHandle.toggleLibSwitch(rules, payload);
        chromeHandle.saveState({rules});
        return { rules };
    }
}