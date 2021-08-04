import { StateHandle } from '../../../handle/state';
import { RowSelectHandle } from '../../../handle/row-select';
import { dataHandle } from '../../../data/handler';

import { TextInputState } from '../../model/text-input-state';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { HostRuleConfig } from '../../../data/model/rule-config';

import * as TRuleConfig from '../../../data/model/rule-config/type';
import * as TData from '../../../data/handler/type';
import { IAppState } from '../../model/type';
import { IOnPaginatePayload, IOnSortPayload, IOnRowSelectTogglePayload, IOnJsExecStepChangePayload } from '../type';

const rowSelectHandle = new RowSelectHandle();

export class OptionListViewHandler extends StateHandle.BaseStateHandler {
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
        const { hostId, pathId } = payload;
        const { editView } = localState;

        // Find the index in rules
        const ruleIdCtx = new RuleIdCtxState({ hostId, pathId });

        // Get the title and value of the item to be used in input placeholders
        const { title, value } = dataHandle.getRuleFromIdCtx(rules, { hostId, pathId });
        const titleInput = new TextInputState({ value: title });
        const valueInput = new TextInputState({ value });

        return {
            localState: {
                ...localState,

                // Edit Mode & active item, item states
                isListView: false,

                editView: {
                    ...editView,
                    ruleIdCtx,
                    titleInput,
                    valueInput,
                }
            }
        };
    }

    onHttpsToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const item = dataHandle.getRuleFromIdCtx(rules, payload) as HostRuleConfig;
        const { isHttps } = item;
        item.isHttps = !isHttps;
        return {};
    }

    onJsExecStepChange({ rules }: IAppState, payload: IOnJsExecStepChangePayload): Partial<IAppState> {
        const { selectValueAttrVal, ...ruleIdCtx } = payload;
        const item = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx) as TData.AHostPathRule;
        item.jsExecPhase = selectValueAttrVal as TRuleConfig.AJsExecPhase;
        return {};
    }

    onJsToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const item = dataHandle.getRuleFromIdCtx(rules, payload) as TData.AHostPathRule;
        const { isJsOn } = item;
        item.isJsOn = !isJsOn;
        return {};
    }

    onCssToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const item = dataHandle.getRuleFromIdCtx(rules, payload) as TData.AHostPathRule;
        const { isCssOn } = item;
        item.isCssOn = !isCssOn;
        return {};
    }

    onLibToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const item = dataHandle.getRuleFromIdCtx(rules, payload) as TData.AHostPathRule;
        const { isLibOn } = item;
        item.isLibOn = !isLibOn;
        return {};
    }
}