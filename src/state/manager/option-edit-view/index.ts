import { dataManager } from '../../../data/manager';
import { StateHandle } from '../../../handle/state';
import { RowSelectHandle } from '../../../handle/row-select';

import { TextInputState } from '../../model/text-input-state';
import { DataGridState } from '../../model/data-grid-state';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import * as TTextInput from '../../../component/base/input-text/type';
import { IAppState } from '../../model/type';
import { AHostPathRule } from '../../../data/manager/type';

const rowSelectHandle = new RowSelectHandle();

export class OptionEditViewStateManager extends StateHandle.BaseStateManager {
    //// HEADER
    onListView({ localState }: IAppState) {
        // Not required to reset Edit View state as already covered by `onEditView`
        return {
            localState: {
                ...localState,
                isListView: true,
            }
        }
    }

    //// SIDE BAR
    onActiveRuleChange({ rules, localState }: IAppState, payload): Partial<IAppState> {
        const { item, parentIdx, isChild} = payload;
        const { id, title, value } = item;

        // Rule Id context
        const hostId = isChild ? rules[parentIdx].id : id;
        const pathId = isChild ? id : null;
        const ruleIdCtx = new RuleIdCtxState({ hostId, pathId });

        // Text input
        const titleInput = new TextInputState({ value: title });
        const valueInput = new TextInputState({ value: value });

        // Library grid
        const dataGrid = new DataGridState();

        return {
            localState: {
                ...localState,
                editView: {
                    ...localState.editView,
                    ruleIdCtx,
                    titleInput,
                    valueInput,
                    dataGrid,
                }
            }
        };
    }

    //// TEXT INPUTS
    onActiveTitleInput({ rules, localState }: IAppState, payload: TTextInput.IOnInputChangeArg) {
        const { isValid, val, errMsg } = payload;
        const { editView } = localState;
        const { ruleIdCtx } = editView;
        const baseState = {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    titleInput: new TextInputState({
                        isValid,
                        errMsg,
                        value: val
                    })
                }
            }
        };

        // If not vaild, we only update the temporary value of the input
        if (!isValid) return baseState;

        // If valid value, set/sync the item title
        dataManager.setTitle(rules, ruleIdCtx, val);
        return {
            ...baseState,
            rules: [...rules], // force rerender for Side Nav
        }
    }

    onActiveValueInput({ rules, localState }: IAppState, payload: TTextInput.IOnInputChangeArg) {
        const { isValid, val, errMsg } = payload;
        const { editView } = localState;
        const { ruleIdCtx } = editView;
        const baseState = {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    valueInput: new TextInputState({
                        isValid,
                        errMsg,
                        value: val
                    })
                }
            }
        };

        // If not vaild, we only update the temporary value of the input
        if (!isValid) return baseState;

        // If valid value, set/sync the item value
        dataManager.setValue(rules, ruleIdCtx, val);
        return {
            ...baseState,
            rules: [...rules], // force rerender for Side Nav
        }
    }

    onRegexToggle({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        dataManager.toggleExactSwitch(rules, payload);
        return {};
    }

    //// TABS
    onActiveTabChange({ rules }: IAppState, payload) {
        const { ruleIdCtx, idx } = payload;
        const item = dataManager.getRuleFromIdCtx(rules, ruleIdCtx) as AHostPathRule;
        item.activeTabIdx = idx;
        return {};
    }

    onTabToggle({ rules }: IAppState, payload) {
        const { ruleIdCtx, tab } = payload;
        const id = `is${tab.id}On`;
        const item = dataManager.getRuleFromIdCtx(rules, ruleIdCtx) as AHostPathRule;
        item[id] = !item[id];
        return {};
    }

    onCodeChange({ rules }: IAppState, payload) {
        const { ruleIdCtx, codeKey, codeMirrorArgs } = payload;
        const [,,value] = codeMirrorArgs;
        const item = dataManager.getRuleFromIdCtx(rules, ruleIdCtx) as AHostPathRule;
        item[codeKey] = value;
        return {};
    }

    //// DATA GRID FOR LIBRARIES
    onLibSort({ localState }: IAppState, payload) {
        const { sortOption } = payload;
        const { editView } = localState;
        return {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    dataGrid: {
                        ...editView.dataGrid,
                        sortOption
                    }
                }
            }
        }
    }

    onLibRowSelectToggle({ localState }: IAppState, payload): Partial<IAppState> {
        const { libs, id } = payload;
        const { editView } = localState;
        const { dataGrid } = editView;
        const selectState = rowSelectHandle.getState({
            isAll: false,
            currState: dataGrid.selectState,
            rowsCtx: {
                rows: libs,
                rowKey: id,
            }
        });

        return {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    dataGrid: {
                        ...dataGrid,
                        selectState
                    }
                }
            }
        };
    }

    onLibRowsSelectToggle({ localState }: IAppState): Partial<IAppState> {
        const { editView } = localState;
        const { dataGrid } = editView;
        const selectState = rowSelectHandle.getState({
            isAll: true,
            currState: dataGrid.selectState
        });

        return {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    dataGrid: {
                        ...dataGrid,
                        selectState
                    }
                }
            }
        };
    }

    onLibAsyncToggle({ rules, localState }: IAppState, payload: {id: string}): Partial<IAppState> {
        dataManager.toggleLibAsyncSwitch(rules, {
            ...localState.editView.ruleIdCtx,
            libId: payload.id
        });
        return {};
    }

    onLibIsOnToggle({ rules,  localState }: IAppState, payload: {id: string}): Partial<IAppState> {
        dataManager.toggleLibIsOnSwitch(rules, {
            ...localState.editView.ruleIdCtx,
            libId: payload.id
        });
        return {};
    }
}