import { StateHandle } from '../../../handle/state';
import { AppState } from '../../model';
import { TextInputState } from '../../model/text-input-state';
import { DataGridState } from '../../model/data-grid-state';
import { LibRuleConfig } from '../../../data/model/rule-config';
import { ActiveRuleState } from '../../model/active-rule-state';
import { DataCrudHandle } from '../../../data/handler';
import { RowSelectHandle } from '../../../handle/row-select';
import { HandlerHelper } from '../helper';

const rowSelectHandle = new RowSelectHandle();

export class OptionEditViewHandler extends StateHandle.BaseStateHandler {
    //// SIDE BAR
    onSidebarItemClick({ rules, localState }: AppState, payload): Partial<AppState> {
        const { type, hostId, pathId } = payload;

        // Find the index in rules
        const activeRule = new ActiveRuleState({ type, hostId, pathId });

        // Get the title and value of the item to be used in input placeholders
        const ruleIdxCtx = DataCrudHandle.getRuleIdxCtx({
            rules,
            type,
            hostId,
            pathId,
            libId: null
        });
        const { title, value } = DataCrudHandle.getRuleFromIdx({
            rules,
            type,
            ...ruleIdxCtx,
        });
        const resetInputState = new TextInputState();
        const resetLibDatagridState = new DataGridState<LibRuleConfig>();

        return {
            localState: {
                ...localState,
                activeRule,
                activeTitleInput: {
                    ...resetInputState,
                    value: title,
                },
                activeValueInput: {
                    ...resetInputState,
                    value
                },
                libDataGrid: resetLibDatagridState
            }
        };
    }

    // No Search context involved here
    onRmvActiveItem({ rules, localState }: AppState) {
        const { activeRule } = localState;
        const { isHost, ruleIdx, pathIdx } = activeRule;

        // Remove either Host or Path Rule
        isHost
            ? rules.splice(ruleIdx, 1)
            : rules[ruleIdx].paths.splice(pathIdx, 1);

        // Move the current index & value of input placeholder to previous item (if exist)
        const hasRules = !!rules.length;
        const nextRuleIdx = isHost ? (hasRules ? 0 : null ) : ruleIdx;
        const nextPathIdx = isHost ? pathIdx : (rules[0]?.paths.length ? 0 : null);
        const isNextItemHost = Number.isInteger(nextRuleIdx) && !Number.isInteger(nextPathIdx);
        const nextItem = isNextItemHost ? rules[nextRuleIdx] : rules[nextRuleIdx]?.paths[nextPathIdx];
        const activeItemState = {
            activeRule: new ActiveRuleState({
                isHost: isNextItemHost,
                item: nextItem,
                ruleIdx: nextRuleIdx,
                pathIdx: nextPathIdx
            }),
            activeTitleInput: new TextInputState(
                nextItem
                ? { value: nextItem.title }
                : {}
            ),
            activeValueInput: new TextInputState(
                nextItem
                ? { value: nextItem.value }
                : {}
            ),
        };

        // If there are no more rules, go back to List View
        const viewState = hasRules ? {} : { isListView: true };

        return {
            rules: [...rules],
            localState: {
                ...localState,
                ...activeItemState,
                ...viewState,
                libDataGrid: new DataGridState<LibRuleConfig>()
            }
        };
    }

    //// TEXT INPUT FOR TITLE & URL/PATH
    // TODO: Renamed this to e.g. `onTitleChange`, `onValueChange`
    onActiveRuleTitleInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg) {
        return HandlerHelper.getTextlInputChangeState({
            ...payload,
            inputKey: 'activeTitleInput',
            key: 'title',
            rules,
            localState,
        });
    }

    onActiveRuleValueInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg) {
        return HandlerHelper.getTextlInputChangeState({
            ...payload,
            inputKey: 'activeValueInput',
            key: 'value',
            rules,
            localState,
        });
    }

    //// DATA GRID
    onLibSort({ localState }: AppState, payload) {
        const { sortOption } = payload;
        return {
            localState: {
                ...localState,
                libDataGrid: {
                    ...localState.libDataGrid,
                    sortOption
                }
            }
        }
    }

    onLibRowSelectToggle({ rules, localState }: AppState, id: string, totalRules: number) {
        const { libDataGrid } = localState;
        const { selectState } = libDataGrid;
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
                libDataGrid: {
                    ...libDataGrid,
                    selectState: rowSelectState
                }
            }
        };
    }

    onLibRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const { libDataGrid } = localState;
        const { selectState } = libDataGrid;
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: selectState
        });

        return {
            localState: {
                ...localState,
                libDataGrid: {
                    ...libDataGrid,
                    selectState: rowSelectState
                }
            }
        };
    }

    //// MODAL
    // No Search context here
    onDelLibModal({ rules, localState, setting } : AppState, payload) {
        const { libIdx, dataSrc } = payload;
        const { reflect } = this as unknown as IStateHandler;
        const { libDataGrid } = localState;
        const { showDeleteModal } = setting;
        const baseState = {
            rules,
            setting,
            localState: {
                ...localState,
                activeModalId: delLib.id,
                modalLibIdx: libIdx,
                libDataGrid: {
                    ...libDataGrid,
                    dataSrc,
                }
            }
        };

        if (showDeleteModal) return baseState;
        return reflect.onDelLibModalConfirm(baseState);
    }

    // No Search context here
    onDelLibModalConfirm(state: AppState) {
        const { reflect } = this as unknown as IStateHandler;
        const { localState, rules } = state;
        const { libDataGrid, activeRule, modalLibIdx } = localState;
        const { areAllRowsSelected, selectedRowKeyCtx } = libDataGrid.selectState;
        const hasSelected = areAllRowsSelected || !!Object.entries(selectedRowKeyCtx).length;

        const item = HandlerHelper.getActiveItem({
            ...activeRule,
            isActiveItem: true,
            rules,
        });
        item.libs = hasSelected
            ? reflect.rmvEditViewLibs(libDataGrid)
            : reflect.rmvEditViewLib(libDataGrid, modalLibIdx);
        const libDataGridState = hasSelected
            ? new DataGridState()
            : { ...libDataGrid, dataSrc: null };

        const resetState = this.reflect.onModalCancel(state);
        return {
            rules: [...rules],
            localState: {
                ...resetState.localState,
                libDataGrid: libDataGridState,
            }
        };
    }

    onAddLibModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                activeModalId: addLib.id
            }
        };
    }

    onAddLibModalConfirm(state: AppState) {
        const { localState, rules } = state;
        const { activeRule, modalTitleInput, modalValueInput } = localState;
        const { libs } = HandlerHelper.getActiveItem({
            ...activeRule,
            rules,
            isActiveItem: true,
        });
        const title = modalTitleInput.value;
        const value = modalValueInput.value;
        const lib = new LibRuleConfig(title, value);
        libs.push(lib);

        const resetState = this.reflect.onModalCancel(state);
        return {
            localState: {
                // Reset modal state
                ...resetState.localState,

                // Maintain active item
                activeRule,
            }
        };
    }

    onEditLibModal({ localState }: AppState, payload) {
        const { lib, libIdx } = payload;
        const { title, value } = lib;
        const isValid = true;
        const modalTitleInput = new TextInputState({
            value: title,
            isValid,
        });
        const modalValueInput = new TextInputState({
            value,
            isValid,
        });

        return {
            localState: {
                ...localState,
                activeModalId: editLib.id,
                modalLibIdx: libIdx,
                modalTitleInput,
                modalValueInput,
            }
        };
    }

    onEditLibModalConfirm(state: AppState) {
        const { rules, localState } = state;
        const {
            activeRule,
            modalLibIdx,
            modalTitleInput,
            modalValueInput
        } = localState;

        const { libs } = HandlerHelper.getActiveItem({
            ...activeRule,
            isActiveItem: true,
            rules,
        });
        const lib = libs[modalLibIdx];
        lib.title = modalTitleInput.value;
        lib.value = modalValueInput.value;

        const resetState = this.reflect.onModalCancel(state);
        return {
            localState: {
                // Reset modal state
                ...resetState.localState,

                // Maintain active item
                activeRule,
            }
        };
    }
}