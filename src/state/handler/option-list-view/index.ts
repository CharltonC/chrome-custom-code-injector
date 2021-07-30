import { StateHandle } from '../../../handle/state';
import { AppState } from '../../model';
import { HostRuleConfig } from '../../../data/model/rule-config';
import { TextInputState } from '../../model/text-input-state';
import { ActiveRuleState } from '../../model/active-rule-state';
import { RowSelectHandle } from '../../../handle/row-select';
import { HandlerHelper } from '../helper';
import { DataCrudHandle } from '../../../data/handler';
import * as TPgn from '../../../handle/pagination/type';
import * as TSort from '../../../handle/sort/type';
import { IStateHandler } from '../type';

const { defState: rowSelectDefState } = new RowSelectHandle();
const rowSelectHandle = new RowSelectHandle();

export class OptionListViewHandler extends StateHandle.BaseStateHandler {
    //// DATA GRID
    onSearchTextChange({ localState }: AppState, val: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                searchedText: val,
            }
        };
    }

    onSearchTextClear({ localState }: AppState) {
        return {
            localState: {
                ...localState,
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

    onPaginate({ localState}: AppState, payload: { pgnOption: TPgn.IOption, pgnState: TPgn.IState }) {
        return {
            localState: {
                ...localState,

                ruleDataGrid: {
                    ...localState.ruleDataGrid,

                    // clear all selections
                    selectState: {
                        areAllRowsSelected: false,
                        selectedRowKeyCtx: {},
                    },

                    // Update pagination
                    ...payload
                }
            }
        };
    }

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

    onRowSelectToggle({ rules, localState }: AppState, id: string, totalRules: number) {
        const { ruleDataGrid } = localState;
        const { selectState } = ruleDataGrid;
        const rowSelectState = rowSelectHandle.getState({
            isAll: false,
            currState: selectState,
            rowsCtx: {
                rows: rules,
                rowKey: id,
             }
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
        const { selectState } = ruleDataGrid;
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: selectState
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

    onEditView({ rules, localState }: AppState, payload): Partial<AppState> {
        const { type, hostId, pathId } = payload;

        // Find the index in rules
        const activeRule = new ActiveRuleState({ type, hostId, pathId });

        // Get the title and value of the item to be used in input placeholders
        const { hostIdx, pathIdx } = DataCrudHandle.getRuleIdxCtx({ rules, type, hostId, pathId });
        const { title, value } = DataCrudHandle.getRuleFromIdx({ rules, type, hostIdx, pathIdx });
        const activeTitleInput = new TextInputState({ value: title });
        const activeValueInput = new TextInputState({ value });

        return {
            localState: {
                ...localState,

                // Edit Mode & active item, item states
                isListView: false,
                activeRule,
                activeTitleInput,
                activeValueInput,

                // clear the row select state ready for use for DataGrid component in Edit View]
                ruleDataGrid: {
                    ...localState.ruleDataGrid,
                    selectState: rowSelectDefState,
                }
            }
        };
    }

    //// REMOVE HOST/PATH
    onListViewDelModal(state: AppState, payload) {
        const { localState, setting } = state;
        const { showDeleteModal } = setting;
        const { reflect } = this as unknown as IStateHandler;
        const baseLocalState = {
            ...localState,
            activeModalId: removeConfirm.id,
            delRule: new DelRuleState(payload),
        };

        return showDeleteModal
            ? { localState: baseLocalState }
            : reflect.onListViewDelModalOk({
                ...state,
                localState: baseLocalState,
            });
    }

    onListViewDelModalOk(state: AppState) {
        const { rules, localState } = state;
        const { ruleDataGrid, delRule } = localState;

        if (isMultiple) {
            const { areAllRowsSelected, selectedRowKeyCtx } = ruleDataGrid.selectState;
            if (areAllRowsSelected) {
                DataCrudHandle.rmvAllHosts({
                    rules,
                    dataGridRules,
                    ruleDataGrid,
                });
            } else {
                DataCrudHandle.rmvPartialHosts({
                    rules,
                    dataGridRules,
                    selectedRowKeyCtx
                });
            }

        } else {
            if (Number.isInteger(pathIdx)) {
                reflect.rmvListViewPath({ hostItem, pathIdx });
            } else {
                reflect.rmvListViewHost({
                    rules,
                    hostItem
                });
            }
        }

        const resetLocalState: LocalState = {
            ...reflect.onModalCancel(state).localState,
            ruleDataGrid: {
                ...ruleDataGrid,
                pgnState: {
                    ...ruleDataGrid.pgnState,
                    curr: 0,
                    startIdx: 0,
                    endIdx: null
                },
                selectState: {              // in case of side-effect on `selectedRowKeyCtx` state
                    areAllRowsSelected: false,
                    selectedRowKeyCtx: {},
                }
            }
        };

        return {
            localState: {
                ...localState,
                ...resetLocalState,
            }
        };
    }

    // Search context here
    onAddHostModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                activeModalId: editHost.id
            }
        };
    }

    // Search context here
    onAddHostModalOk(state: AppState) {
        const { localState, rules, setting } = state;

        const { modalTitleInput, modalValueInput } = localState;
        const title: string = modalTitleInput.value;
        const host: string = modalValueInput.value;
        const hostRule = new HostRuleConfig(title, host);
        Object.assign(hostRule, setting.defRuleConfig);
        rules.push(hostRule);

        const modalResetState = this.reflect.onModalCancel(state);
        return {
            ...modalResetState,
            rules: rules.concat([])
        };
    }

    onListViewAddPathModal({ localState }: AppState, payload) {
        // TODO: List view OR Edit view
        const { hostId } = payload;
        return {
            localState: {
                ...localState,
                activeModalId: modals.editPath.id,
                // TODO: which host to add
            }
        };
    }

    onListViewAddPathModalOk(state: AppState) {
        // TODO: List view OR Edit view
        const { localState, rules, setting } = state;
        const {
            modalTitleInput, modalValueInput, modalRuleIdx,
            isListView, activeRule,
        } = localState;

        // Add new path to the target rule
        const title: string = modalTitleInput.value;
        const path: string = modalValueInput.value;
        const pathRule = new PathRuleConfig(title, path);
        Object.assign(pathRule, setting.defRuleConfig);
        const { paths } = rules[modalRuleIdx];
        const lastPathIdx = paths.length;   // get last index where the new path will be located/added
        paths.push(pathRule);

        // If it is Edit View, Make the added path as current active item
        const activeItemState = isListView ? {} : {
            activeRule: new ActiveRuleState({
                ...activeRule,
                isHost: false,
                pathIdx: lastPathIdx
            }),
            activeTitleInput: new TextInputState({ value: title }),
            activeValueInput: new TextInputState({ value: path }),
        };

        const resetState = this.reflect.onModalCancel(state);
        return {
            localState: {
                ...resetState.localState,
                ...activeItemState
            },
            rules: [...rules]
        };
    }
}