import { StateHandle } from '../handle/state';
import { AView } from '../model/local-state/type';
import { AppState } from '../model/app-state';
import { LocalState } from '../model/local-state';
import { HostRuleConfig } from '../model/rule-config';
import { modals } from '../constant/modals';
import { Setting } from '../model/setting';
import { settings } from 'cluster';

const { SETTING, IMPORT_SETTING, EXPORT_SETTING, DELETE, ADD_HOST, ADD_PATH, ADD_LIB, EDIT_LIB } = modals;

export class StateHandler extends StateHandle.BaseStoreHandler {
    //// Router/Views
    onListView(state: AppState): Partial<AppState> {
        const { currView } = this.reflect.setView(state, 'LIST').localState;
        const resetLocalState = new LocalState();
        return {
            localState: {
                ...resetLocalState,
                currView,
            }
        };
    }

    onEditView(state: AppState) {
        return this.reflect.setView(state, 'EDIT');
    }

    setView({ localState }: AppState, currView: AView): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currView
            }
        };
    }

    //// DataGrid rows
    onAllRowsToggle({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                isAllRowsSelected: !localState.isAllRowsSelected
            }
        };
    }

    onHttpsToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isHttps');
    }

    onJsToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isJsOn');
    }

    onCssToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isCssOn');
    }

    onLibToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isLibOn');
    }

    onJsExecStageChange({ rules }: AppState, idx: number, modIdx): Partial<AppState> {
        const clone = rules.slice();
        clone[idx].jsExecPhase = modIdx;
        return { rules: clone };
    }

    onItemEdit(state: AppState, currListItem): Partial<AppState> {
        const { localState } = state;
        const { currView } = this.reflect.onEditView(state).localState;

        return {
            localState: {
                ...localState,
                currListItem,
                currView
            }
        };
    }

    onItemRmv({ rules }: AppState, idx: number, parentIdx?: number) {
        const cloneRules = rules.concat();
        const modItems = typeof parentIdx !== 'undefined' ?
            cloneRules[parentIdx].paths :
            cloneRules;

        modItems.splice(idx, 1);
        return { rules: cloneRules };
    }

    onListItemClick({ localState }: AppState, ...[, { item }]) {
        return {
            localState: {
                ...localState,
                currListItem: item,
            }
        };
    }

    toggleTbRowSwitch({ rules }: AppState, idx: number, key: string): Partial<AppState> {
        const clone = rules.slice();
        const value = clone[idx][key];
        clone[idx][key] = !value;
        return { rules: clone };
    }

    //// Search
    // TODO: debounce
    onSearch({ localState, rules }: AppState, evt, val: string, gte3Char: boolean): Partial<AppState> {
        const baseLocalState = {
            ...localState,
            searchedText: val
        };

        if (!val) return {
            localState: {
                ...baseLocalState,
                searchedRules: null,
            }
        };

        if (!gte3Char) return { localState: baseLocalState };

        const searchedRules: HostRuleConfig[] = val
            .split(/\s+/)
            .reduce((filteredRules: HostRuleConfig[], text: string) => {
                return filteredRules.filter(({ id, value, paths }: HostRuleConfig) => {
                    const isIdMatch = id.indexOf(text) !== -1;
                    if (isIdMatch) return true;

                    const isValMatch = value.indexOf(text) !== -1;
                    if (isValMatch) return true;

                    return paths.some(({ id: childId, value: childValue}) => {
                        return (childId.indexOf(text) !== -1) || (childValue.indexOf(text) !== -1);
                    });
                });
            }, rules);

        return {
            localState: {
                ...baseLocalState,
                searchedRules,
            }
        };
    }

    onSearchClear({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                searchedRules: null,
                searchedText: ''
            }
        };
    }

    //// Settings
    onResultsPerPageChange({ setting }: AppState, resultsPerPageIdx: number) {
        return {
            setting: {
                ...setting,
                resultsPerPageIdx
            }
        };
    }

    onResetAll() {
        return {
            setting: new Setting()
        };
    }

    onDefHostRuleToggle({ setting }: AppState, key: string) {
        const { defRuleConfig } = setting;
        const isValid: boolean = key in defRuleConfig && typeof defRuleConfig[key] === 'boolean';
        if (!isValid) throw new Error('key is not valid');
        const val: boolean = defRuleConfig[key];

        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    [key]: !val
                }
            }
        };
    }

    onDefJsExecStageChange({ setting }: AppState, evt, idx: number) {
        const { defRuleConfig } = setting;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    jsExecPhase: idx
                }
            }
        };
    }

    //// Modals
    // Generic
    openModal({ localState }: AppState, currModalId: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId
            }
        };
    }

    hideModal({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId: null
            }
        };
    }

    // Setting
    onSettingModal(state: AppState) {
        return this.reflect.openModal(state, SETTING.id);
    }

    onImportSettingModal(state: AppState) {
        return this.reflect.openModal(state, IMPORT_SETTING.id);
    }

    onExportSettingModal(state: AppState) {
        return this.reflect.openModal(state, EXPORT_SETTING.id);
    }

    // Delete
    onDelModal(appState: AppState, idx: number, parentIdx?: number) {
        const { localState, setting } = appState;

        if (!setting.showDeleteModal) {
            return this.reflect.onItemRmv(appState, idx, parentIdx);

        } else {
            return {
                localState: {
                    ...localState,
                    currModalId: DELETE.id,
                    targetRmvItemIdx: idx,
                    targetRmvItemParentIdx: parentIdx
                }
            };
        }
    }

    onDelModalConfirm(appState: AppState) {
        const { localState } = appState;
        const { targetRmvItemIdx, targetRmvItemParentIdx } = localState;
        const { rules } = this.reflect.onItemRmv(appState, targetRmvItemIdx, targetRmvItemParentIdx);

        return {
            rules,
            localState: {
                ...localState,
                currModalId: null,
                targetRmvItemIdx: null,
                targetRmvItemParentIdx: null
            }
        };
    }

    onDelConfirmToggle({ setting }: AppState) {
        return {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
    }

    // Add/Edit Host/Path
    onAddHostModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                currModalId: ADD_HOST.id,
                targetEditItem: new HostRuleConfig('', '')
            }
        };
    }

    onAddHostCancel({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                currModalId: null,
                targetEditItem: null,
            }
        };
    }

    onAddHostConfirm({ localState, rules, setting }: AppState) {
        const cloneRules = rules.concat();
        const { targetEditItem } = localState;

        // merge with user config before added
        Object.assign(targetEditItem, setting.defRuleConfig);
        cloneRules.push(localState.targetEditItem);

        return {
            rules: cloneRules,
            localState: {
                ...localState,
                currModalId: null,
                targetEditItem: null,
            }
        };
    }

    onEditItemIdChange({ localState }: AppState, { val, validState }) {
        const { targetEditItem, isTargetEditItemValValid } = localState;
        return {
            localState: {
                ...localState,
                isTargetEditItemIdValid: validState.isValid,
                allowModalConfirm: isTargetEditItemValValid && validState.isValid,
                targetEditItem: {
                    ...targetEditItem,
                    id: val
                },
            }
        };
    }

    onEditItemAddrChange({ localState }: AppState, { val, validState }) {
        const { targetEditItem, isTargetEditItemIdValid } = localState;
        return {
            localState: {
                ...localState,
                isTargetEditItemValValid: validState.isValid,
                allowModalConfirm: isTargetEditItemIdValid && validState.isValid,
                targetEditItem: {
                    ...targetEditItem,
                    value: val
                },
            }
        };
    }
}