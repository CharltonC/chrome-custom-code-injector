import { StateHandle } from '../../../handle/state';
import { IAppState } from '../../model/type';
import { TextInputState } from '../../model/text-input-state';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { RowSelectHandle } from '../../../handle/row-select';
import { dataHandle } from '../../../data/handler';
import * as TPgn from '../../../handle/pagination/type';
import * as TSort from '../../../handle/sort/type';

const rowSelectHandle = new RowSelectHandle();

export class OptionListViewHandler extends StateHandle.BaseStateHandler {
    //// DATA GRID
    onSearchTextChange({ localState }: IAppState, payload): Partial<IAppState> {
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

    onSearchTextClear({ localState }: IAppState) {
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

    onPaginate({ localState}: IAppState, payload: { pgnOption: TPgn.IOption, pgnState: TPgn.IState }) {
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

    onSort({ localState }: IAppState, payload: { sortOption: TSort.IOption, sortState: TSort.IState }): Partial<IAppState> {
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

    onRowSelectToggle({ localState }: IAppState, payload) {
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

    onRowExpand({ localState }: IAppState, expdState: Record<string, number>) {
        const { dataGrid } = localState.listView;
        const { expdRowId } = dataGrid;
        const [ id ]: string[] = Object.getOwnPropertyNames(expdState);

        return {
            localState: {
                ...localState,
                listView: {
                    ...localState.listView,
                    dataGrid: {
                        ...dataGrid,
                        expdRowId: id === expdRowId ? null : id
                    }
                }
            }
        };
    }

    onEditView({ rules, localState }: IAppState, payload): Partial<IAppState> {
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
}