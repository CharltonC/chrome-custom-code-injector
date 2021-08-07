import { StateHandle } from '../../../handle/state';
import { RowSelectHandle } from '../../../handle/row-select';
import { dataManager } from '../../../data/manager';

import { TextInputState } from '../../model/text-input-state';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { IAppState } from '../../model/type';
import { IOnPaginatePayload, IOnSortPayload, IOnRowSelectTogglePayload, IOnJsExecStepChangePayload } from '../type';

const rowSelectHandle = new RowSelectHandle();

export class OptionListViewStateManager extends StateHandle.BaseStateManager {
    //// DATA GRID
    onSearchTextChange({ localState }: IAppState, payload: {value: string}): Partial<IAppState> {
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

    onSearchTextClear({ localState }: IAppState): Partial<IAppState> {
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

    onPaginate({ localState}: IAppState, payload: IOnPaginatePayload): Partial<IAppState> {
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

    onSort({ localState }: IAppState, payload: IOnSortPayload): Partial<IAppState> {
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

    onRowSelectToggle({ localState }: IAppState, payload: IOnRowSelectTogglePayload): Partial<IAppState> {
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

    onRowsSelectToggle({ localState }: IAppState): Partial<IAppState> {
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

    onRowExpand({ localState }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
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

    onEditView({ rules, localState }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const { editView } = localState;

        // Get the title and value of the item to be used in input placeholders
        const { title, value } = dataManager.getRuleFromIdCtx(rules, payload);
        const titleInput = new TextInputState({ value: title });
        const valueInput = new TextInputState({ value });

        return {
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
    onHttpsToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        dataManager.toggleHttpsSwitch(rules, payload);
        return {};
    }

    // Shared btw List & Edit View
    onJsExecStepChange({ rules }: IAppState, payload: IOnJsExecStepChangePayload): Partial<IAppState> {
        const { selectValueAttrVal, ...ruleIdCtx } = payload;
        dataManager.toggleJsExecStep(rules, ruleIdCtx, selectValueAttrVal);
        return {};
    }

    onJsToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        dataManager.toggleJsSwitch(rules, payload);
        return {};
    }

    onCssToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        dataManager.toggleCssSwitch(rules, payload);
        return {};
    }

    onLibToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        dataManager.toggleLibSwitch(rules, payload);
        return {};
    }
}