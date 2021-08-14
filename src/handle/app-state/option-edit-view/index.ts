import { dataHandle } from '../../data';
import { StateHandle } from '../../state';
import { RowSelectHandle } from '../../row-select';
import { chromeHandle } from '../../chrome';

import * as TTextInput from '../../../component/base/input-text/type';
import * as TSortHandle from '../../sort/type';
import * as TDataHandle from '../../data/type';
import { TextInputState } from '../../../model/text-input-state';
import { DataGridState } from '../../../model/data-grid-state';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { AppState } from '../../../model/app-state';
import {
    IOnActiveRuleChangePayload,
    IOnActiveTabChangePayload,
    IOnLibRowSelectTogglePayload,
    IOnLibTypeChangePayload,
    IOnTabTogglePayload,
    IOnCodeChangePayload,
} from './type';

const rowSelectHandle = new RowSelectHandle();

export class OptionEditViewStateHandle extends StateHandle.BaseStateManager {
    //// HEADER
    onListView({ localState }: AppState): Partial<AppState> {
        // Not required to reset Edit View state as already covered by `onEditView`
        return {
            localState: {
                ...localState,
                isListView: true,
            }
        }
    }

    //// SIDE BAR
    onActiveRuleChange({ rules, localState }: AppState, payload: IOnActiveRuleChangePayload): Partial<AppState> {
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
    onActiveTitleInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg): Partial<AppState> {
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
        dataHandle.setTitle(rules, ruleIdCtx, val);
        chromeHandle.saveState({rules});
        return {
            ...baseState,
            rules: [...rules], // force rerender for Side Nav
        }
    }

    onActiveValueInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg): Partial<AppState> {
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
        dataHandle.setValue(rules, ruleIdCtx, val);
        chromeHandle.saveState({rules});
        return {
            ...baseState,
            rules: [...rules], // force rerender for Side Nav
        }
    }

    //// TABS
    onActiveTabChange({ rules }: AppState, payload: IOnActiveTabChangePayload): Partial<AppState> {
        const { ruleIdCtx, idx } = payload;
        const item = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx) as TDataHandle.AHostPathRule;
        item.activeTabIdx = idx;
        chromeHandle.saveState({rules});
        return {};
    }

    onTabToggle({ rules }: AppState, payload: IOnTabTogglePayload): Partial<AppState> {
        const { ruleIdCtx, tab } = payload;
        const id = `is${tab.id}On`;
        const item = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx) as TDataHandle.AHostPathRule;
        item[id] = !item[id];
        chromeHandle.saveState({rules});
        return {};
    }

    onCodeChange({ rules }: AppState, payload: IOnCodeChangePayload): Partial<AppState> {
        const { ruleIdCtx, codeKey, codeMirrorArgs } = payload;
        const [,,value] = codeMirrorArgs;
        const item = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx) as TDataHandle.AHostPathRule;
        item[codeKey] = value;
        chromeHandle.saveState({rules});
        return {};
    }

    //// DATA GRID FOR LIBRARIES
    onLibSort({ localState }: AppState, payload: {sortOption: TSortHandle.IOption}): Partial<AppState> {
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

    onLibRowSelectToggle({ localState }: AppState, payload: IOnLibRowSelectTogglePayload): Partial<AppState> {
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

    onLibRowsSelectToggle({ localState }: AppState): Partial<AppState> {
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

    onLibTypeChange({ rules, localState }: AppState, payload: IOnLibTypeChangePayload): Partial<AppState> {
        const { selectValue, id } = payload;
        dataHandle.setLibType(rules, {
            ...localState.editView.ruleIdCtx,
            libId: id
        }, selectValue);
        chromeHandle.saveState({rules});
        return {};
    }

    onLibAsyncToggle({ rules, localState }: AppState, payload: {id: string}): Partial<AppState> {
        dataHandle.toggleLibAsyncSwitch(rules, {
            ...localState.editView.ruleIdCtx,
            libId: payload.id
        });
        chromeHandle.saveState({rules});
        return {};
    }

    onLibIsOnToggle({ rules,  localState }: AppState, payload: {id: string}): Partial<AppState> {
        dataHandle.toggleLibIsOnSwitch(rules, {
            ...localState.editView.ruleIdCtx,
            libId: payload.id
        });
        chromeHandle.saveState({rules});
        return {};
    }
}