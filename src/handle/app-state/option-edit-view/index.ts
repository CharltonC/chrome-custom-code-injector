import { dataHandle } from '../../data';
import { StateHandle } from '../../state';
import { RowSelectHandle } from '../../row-select';
import { chromeHandle } from '../../chrome';

import { TextInputState } from '../../../model/text-input-state';
import { DataGridState } from '../../../model/data-grid-state';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { AppState } from '../../../model/app-state';
import { IStateHandle } from '../type';
import * as TTextInput from '../../../component/base/input-text/type';
import * as TSortHandle from '../../sort/type';
import {
    IOnActiveRuleChangePayload,
    IOnActiveTabChangePayload,
    IOnLibRowSelectTogglePayload,
    IOnLibTypeChangePayload,
    IOnTabTogglePayload,
    IOnCodeChangePayload,
} from './type';

const rowSelectHandle = new RowSelectHandle();

export class OptionEditViewStateHandle extends StateHandle.BaseStateManager<IStateHandle> {
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
            rules
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
            rules
        }
    }

    //// TABS
    onActiveTabChange({ rules }: AppState, payload: IOnActiveTabChangePayload): Partial<AppState> {
        const { ruleIdCtx, idx } = payload;
        dataHandle.setLastActiveTab(rules, ruleIdCtx, idx);
        chromeHandle.saveState({rules});
        return { rules };
    }

    onTabToggle({ rules }: AppState, payload: IOnTabTogglePayload): Partial<AppState> {
        const { ruleIdCtx, tab } = payload;
        switch (tab.id) {
            case 'js':
                dataHandle.toggleJsSwitch(rules, ruleIdCtx);
                break;
            case 'css':
                dataHandle.toggleCssSwitch(rules, ruleIdCtx);
                break;
            case 'lib':
                dataHandle.toggleLibSwitch(rules, ruleIdCtx);
                break;
            default:
                return {};
        }
        chromeHandle.saveState({rules});
        return { rules };
    }

    onCodeChange({ rules }: AppState, payload: IOnCodeChangePayload): Partial<AppState> {
        const { ruleIdCtx, codeMode, codeMirrorArgs } = payload;
        const [,,value] = codeMirrorArgs;
        switch (codeMode) {
            case 'js':
                dataHandle.setJsCode(rules, ruleIdCtx, value);
                break;
            case 'css':
                dataHandle.setCssCode(rules, ruleIdCtx, value);
                break;
            default:
                return {};
        }
        chromeHandle.saveState({rules});
        return { rules };
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
        return { rules };
    }

    onLibAsyncToggle({ rules, localState }: AppState, payload: {id: string}): Partial<AppState> {
        dataHandle.toggleLibAsyncSwitch(rules, {
            ...localState.editView.ruleIdCtx,
            libId: payload.id
        });
        chromeHandle.saveState({rules});
        return { rules };
    }

    onLibIsOnToggle({ rules, localState }: AppState, payload: {id: string}): Partial<AppState> {
        dataHandle.toggleLibIsOnSwitch(rules, {
            ...localState.editView.ruleIdCtx,
            libId: payload.id
        });
        chromeHandle.saveState({rules});
        return { rules };
    }
}