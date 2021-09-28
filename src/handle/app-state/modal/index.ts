import { StateHandle } from '../../state';
import { FileHandle } from '../../file';
import { PgnHandle } from '../../pagination';
import { dataHandle } from '../../data';
import { chromeHandle } from '../../chrome';
import { modalSet } from '../../../constant/modal-set';

import { HostRule, PathRule, LibRule } from '../../../model/rule';
import { SettingState } from '../../../model/setting-state';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { DataGridState } from '../../../model/data-grid-state';
import { ModalState } from '../../../model/modal-state';
import { AppState } from '../../../model/app-state';
import { IOnDelHostsModalPayload } from './type';
import { TextInputState } from '../../../model/text-input-state';
import * as TSelectDropdown from '../../../component/base/select-dropdown/type';
import * as TFileInput from  '../../../component/base/input-file/type';
import * as TTextInput from '../../../component/base/input-text/type';

const fileHandle = new FileHandle();
const pgnHandle = new PgnHandle();

export class ModalStateHandle extends StateHandle.BaseStateManager {
    //// BASE
    // used ONLY WHEN setting modal Id is the only thing required to be altered
    onModal({ localState }: AppState, payload: {id: string}): Partial<AppState> {
        const { id } = payload;
        const { modal } = localState;
        return {
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    currentId: id
                }
            }
        };
    }

    onModalCancel({ localState }: AppState): Partial<AppState> {
        // Reset modal state
        const modal = new ModalState();
        return {
            localState: {
                ...localState,
                modal
            }
        };
    }

    //// DATA IMPORT/EXPORT
    onImportDataModal(state: AppState): Partial<AppState> {
        return this.reflect.onModal(state, {
            id: modalSet.importConfig.id
        });
    }

    async onImportDataModalOk(state: AppState): Promise<Partial<AppState>> {
        const { modal } = state.localState;
        const { importFileInput } = modal;
        const rules = (await fileHandle.readJson(importFileInput)) as HostRule[];
        const { localState } = this.reflect.onModalCancel(state);
        chromeHandle.saveState({rules});
        return { rules, localState };
    }

    onExportDataModal(state: AppState): Partial<AppState> {
        return this.reflect.onModal(state, {
            id: modalSet.exportConfig.id
        });
    }

    onExportDataModalOk(state: AppState): Partial<AppState> {
        const { rules, localState } = state;
        const { value } = localState.modal.exportFileInput;
        fileHandle.saveJson(rules, value, true);
        return this.reflect.onModalCancel(state);
    }

    onImportFileInputChange({ localState }: AppState, payload: TFileInput.IOnFileChange): Partial<AppState> {
        const { file, isValid } = payload;
        return {
            localState: {
                ...localState,
                modal: {
                    ...localState.modal,
                    isConfirmBtnEnabled: isValid,
                    // Even though it might be invalid, we still showing the file name to user hence setting file
                    importFileInput: file
                }
            }
        };
    }

    onExportInputChange({ localState }: AppState, payload: TTextInput.IOnInputChangeArg): Partial<AppState> {
        const { errMsg, isValid, val } = payload;
        const { modal } = localState;

        return {
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    isConfirmBtnEnabled: isValid,
                    exportFileInput: {
                        value: val,
                        isValid,
                        errMsg: errMsg,
                    },
                }
            }
        };
    }

    //// SETTINGS
    onSettingModal(state: AppState): Partial<AppState> {
        return this.reflect.onModal(state, {
            id: modalSet.defSetting.id
        });
    }

    onResultsPerPageChange({ setting }: AppState, payload: TSelectDropdown.IOnSelectArg): Partial<AppState> {
        const { selectValueAttrVal } = payload;
        const state = {
            setting: {
                ...setting,
                resultsPerPageIdx: selectValueAttrVal
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    onResetAll(): Partial<AppState> {
        const setting = new SettingState();
        chromeHandle.saveState({ setting });
        return { setting };
    }

    onDefHttpsToggle({ setting }: AppState): Partial<AppState> {
        const { defRuleConfig } = setting;
        const { isHttps } = defRuleConfig;
        const state = {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isHttps: !isHttps
                }
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    onDefJsToggle({ setting }: AppState): Partial<AppState> {
        const { defRuleConfig } = setting;
        const { isJsOn } = defRuleConfig;
        const state = {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isJsOn: !isJsOn
                }
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    onDefCssToggle({ setting }: AppState): Partial<AppState> {
        const { defRuleConfig } = setting;
        const { isCssOn } = defRuleConfig;
        const state = {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isCssOn: !isCssOn
                }
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    onDefLibToggle({ setting }: AppState): Partial<AppState> {
        const { defRuleConfig } = setting;
        const { isLibOn } = defRuleConfig;
        const state = {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isLibOn: !isLibOn
                }
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    onDefJsExecStageChange({ setting }: AppState, payload: TSelectDropdown.IOnSelectArg): Partial<AppState> {
        const { selectValueAttrVal } = payload;
        const { defRuleConfig } = setting;
        const state = {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    codeExecPhase: selectValueAttrVal
                }
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    onDelConfirmDialogToggle({ setting }: AppState): Partial<AppState> {
        const state = {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
        chromeHandle.saveState(state);
        return state;
    }

    //// RULE CRUD
    // Add
    onAddHostModal(state: AppState): Partial<AppState> {
        return this.reflect.onModal(state, {
            id: modalSet.addHost.id
        });
    }

    onAddHostModalOk(state: AppState): Partial<AppState> {
        const { localState, rules, setting } = state;
        const { titleInput, valueInput } = localState.modal;

        const title = titleInput.value;
        const url = valueInput.value;
        const host = new HostRule(title, url);
        Object.assign(host, setting.defRuleConfig);
        dataHandle.addHost(rules, host);
        chromeHandle.saveState({ rules });

        return {
            rules,
            localState: {
                ...localState,
                modal: new ModalState()
            }
        };
    }

    onAddPathModal(state: AppState, payload?: RuleIdCtxState): Partial<AppState> {
        const { isListView, listView } = state.localState;
        const baseState = this.reflect.onModal(state, {
            id: modalSet.addPath.id
        });

        return isListView
            ? {
                localState: {
                    ...baseState.localState,
                    listView: {
                        ...listView,
                        ruleIdCtx: payload
                    },
                }
            }
            // Edit View already has a relative context via `ruleIdCtx` hence empty
            : baseState;
    }

    onAddPathModalOk({ localState, rules, setting }: AppState): Partial<AppState> {
        const { modal, isListView, listView, editView } = localState;
        const { ruleIdCtx } = isListView ? listView : editView;
        const { titleInput, valueInput } = modal;

        // Add host
        const title = titleInput.value;
        const urlPath = valueInput.value;
        const path = new PathRule(title, urlPath);
        Object.assign(path, setting.defRuleConfig);
        dataHandle.addPath(rules, ruleIdCtx, path);
        chromeHandle.saveState({ rules });

        const resetLocalState = {
            ...localState,
            modal: new ModalState(),
        };

        if (isListView) {
            // Update pagination state after addition
            const { dataGrid } = listView;
            const { pgnOption } = dataGrid;
            const pgnState = pgnHandle.getState(rules.length, pgnOption);

            return {
                rules,
                localState: {
                    ...resetLocalState,
                    listView: {
                        ...listView,
                        dataGrid: {
                            ...dataGrid,
                            pgnState
                        }
                    }
                }
            };
        } else {
            return {
                rules,
                localState: resetLocalState
            };
        }
    }

    onAddLibModal(state: AppState): Partial<AppState> {
        return this.reflect.onModal(state, {
            id: modalSet.addLib.id
        });
    }

    onAddLibModalOk({ rules, localState }: AppState): Partial<AppState> {
        const { modal, editView } = localState;
        const { titleInput, valueInput } = modal;
        const { ruleIdCtx } = editView;
        const { value: title } = titleInput;
        const { value } = valueInput;
        const lib = new LibRule(title, value);
        dataHandle.addLib(rules, ruleIdCtx, lib);
        chromeHandle.saveState({ rules });

        return {
            rules,
            localState: {
                ...localState,
                modal: new ModalState()
            }
        }
    }

    // Delete
    onDelHostOrPathModal(state: AppState, payload: RuleIdCtxState): Partial<AppState> {
        const { reflect } = this;
        const { localState, setting } = state;
        const { isListView, listView, editView } = localState;

        const baseLocalState = this.reflect.onModal(state, {
            id: modalSet.delHostOrPath.id
        }).localState;

        const newState: Partial<AppState> = isListView
            ? {
                localState: {
                    ...baseLocalState,
                    listView: {
                        ...listView,
                        ruleIdCtx: payload
                    },
                }
            }
            // Edit View already has a relative context via `ruleIdCtx` hence empty
            : {
                localState: {
                    ...baseLocalState,
                    editView: {
                        ...editView,
                        ruleIdCtx: payload
                    }
                }
            };

        return setting.showDeleteModal
            ? newState
            : reflect.onDelHostOrPathModalOk({
                ...state,
                ...newState
            });
    }

    onDelHostOrPathModalOk(state: AppState): Partial<AppState> {
        const { rules, localState } = state;
        const { isListView, listView, editView } = localState;

        // Get the ID context (host, path) depending on the view
        const { ruleIdCtx } = isListView ? listView : editView;
        const isHost = !ruleIdCtx.pathId;

        // Delete Host or Path
        ruleIdCtx.pathId
            ? dataHandle.rmvPath(rules, ruleIdCtx)
            : dataHandle.rmvHost(rules, ruleIdCtx);
        chromeHandle.saveState({ rules });

        const hasRules = !!rules.length;
        const resetLocalState = {
            ...localState,
            modal: new ModalState()
        };

        // If delete from List view
        if (isListView) {
            const { searchText: currSearchText, dataGrid, } = listView;
            const { pgnOption } = dataGrid;

            // Clear the Search only if text exists + all hosts are removed
            const totalRecord = rules.length;
            const searchText = this.reflect.getUpdatedSearchText(currSearchText, totalRecord);

            // If a host is removed, Update new pagination state after rules removal (depends on total no. of hosts)
            const dataGridState = isHost
                ? new DataGridState({ totalRecord, pgnOption })
                : dataGrid;

            return {
                rules,
                localState: {
                    ...resetLocalState,
                    listView: {
                        ...listView,
                        searchText,
                        ruleIdCtx: new RuleIdCtxState(),
                        dataGrid: dataGridState
                    },
                },
            };

        // If Edit View but all rules are deleted
        } else if (!isListView && !hasRules) {
            return {
                rules,
                localState: {
                    ...resetLocalState,
                    isListView: true
                }
            };

        // If Edit view but has rules remained
        } else {
            const newRuleIdCtx = dataHandle.getNextAvailRuleIdCtx(rules, ruleIdCtx);
            return {
                rules,
                localState: {
                    ...resetLocalState,
                    editView: {
                        ...editView,
                        ruleIdCtx: new RuleIdCtxState(newRuleIdCtx)
                    }
                }
            };
        }
    }

    onDelHostsModal(state: AppState, payload: IOnDelHostsModalPayload): Partial<AppState> {
        const { srcRules, sliceIdxCtx } = payload;
        const { localState, setting } = state;
        const { modal, listView } = localState;

        const newState = {
            localState: {
                ...localState,
                listView: {
                    ...listView,
                    dataGrid: {
                        ...listView.dataGrid,
                        srcRules,
                        sliceIdxCtx,
                    },
                },
                modal: {
                    ...modal,
                    currentId: modalSet.delHosts.id
                },
            }
        };
        return setting.showDeleteModal
            ? newState
            : this.reflect.onDelHostsModalOk({
                ...state,
                ...newState
            });
    }

    onDelHostsModalOk(state: AppState): Partial<AppState> {
        const { rules, localState } = state;
        const { listView } = localState;
        const { dataGrid, searchText: currSearchText } = listView;

        // Remove based on specifid IDs
        const { selectState, pgnOption, srcRules, sliceIdxCtx } = dataGrid;
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
        const { startIdx, endIdx } = sliceIdxCtx;
        const delIds = srcRules.slice(startIdx, endIdx).map(({ id }) => id)
        areAllRowsSelected
            ? dataHandle.rmvHostsFromIds(rules, delIds)
            : dataHandle.rmvPartialHosts(rules, selectedRowKeyCtx);
        chromeHandle.saveState({ rules });

        // Clear the Search after rules are altered (List view only)
        const totalRecord = rules.length;
        const searchText = this.reflect.getUpdatedSearchText(currSearchText, totalRecord);

        // Update new pagination state after rules removal (depends on total no. of hosts)
        const dataGridState = new DataGridState({
            totalRecord,
            pgnOption
        });

        return {
            ...state,
            rules,
            localState: {
                ...localState,
                modal: new ModalState(),
                listView: {
                    ...listView,
                    searchText,
                    dataGrid: dataGridState
                }
            }
        };
    }

    onDelLibModal(state: AppState, payload: {id: string}): Partial<AppState> {
        const { localState, setting } = state;
        const { editView } = localState;
        const baseState = {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    libRuleIdCtx: {
                        ...editView.ruleIdCtx,
                        libId: payload.id,
                    }
                },
                modal: {
                    ...localState.modal,
                    currentId: modalSet.delLib.id
                }
            }
        };

        return setting.showDeleteModal
            ? baseState
            : this.reflect.onDelLibModalOk({
                ...state,
                ...baseState
            });
    }

    onDelLibModalOk({ rules, localState }: AppState): Partial<AppState> {
        const { editView } = localState;
        const { libRuleIdCtx } = editView;
        dataHandle.rmvLib(rules, libRuleIdCtx);
        chromeHandle.saveState({ rules });

        return {
            rules,
            localState: {
                ...localState,
                modal: new ModalState(),
                editView: {
                    ...editView,
                    libRuleIdCtx: new RuleIdCtxState()
                }
            }
        };
    }

    onDelLibsModal(state: AppState): Partial<AppState> {
        const { setting } = state;
        const baseState = this.reflect.onModal(state, {
            id: modalSet.delLibs.id
        })

        return setting.showDeleteModal
            ? baseState
            : this.reflect.onDelLibsModalOk({
                ...state,
                ...baseState
            });
    }

    onDelLibsModalOk({ rules, localState }: AppState): Partial<AppState> {
        const { editView } = localState;
        const { ruleIdCtx, dataGrid } = editView;
        const { areAllRowsSelected, selectedRowKeyCtx } = dataGrid.selectState;

        areAllRowsSelected
            ? dataHandle.rmvAllLibs(rules, ruleIdCtx)
            : dataHandle.rmvPartialLibs(rules, selectedRowKeyCtx, ruleIdCtx);
        chromeHandle.saveState({ rules });

        return {
            rules,
            localState: {
                ...localState,
                modal: new ModalState(),
                editView: {
                    ...editView,
                    dataGrid: new DataGridState()
                }
            }
        };
    }

    // Edit
    onEditLibModal({ rules, localState }: AppState, payload: {id: string}): Partial<AppState> {
        const { id } = payload;
        const { editView, modal } = localState;

        const libRuleIdCtx = { ...editView.ruleIdCtx, libId: id };
        const { title, value } = dataHandle.getRuleFromIdCtx(rules, libRuleIdCtx);
        const isValid = true;
        const titleInput = new TextInputState({ value: title, isValid });
        const valueInput = new TextInputState({ value, isValid });

        return {
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    libRuleIdCtx
                },
                modal: {
                    ...modal,
                    currentId: modalSet.editLib.id,
                    titleInput,
                    valueInput,
                    isConfirmBtnEnabled: true,
                }
            }
        };
    }

    onEditLibModalOk({ rules, localState }: AppState): Partial<AppState> {
        const { modal, editView } = localState;
        const { titleInput, valueInput } = modal;
        const { libRuleIdCtx } = editView;
        const { value: title } = titleInput;
        const { value } = valueInput;
        dataHandle.setProps(rules, libRuleIdCtx, {
            title,
            value
        });
        chromeHandle.saveState({ rules });

        return {
            rules,
            localState: {
                ...localState,
                editView: {
                    ...editView,
                    libRuleIdCtx: new RuleIdCtxState()
                },
                modal: new ModalState()
            }
        }
    }

    // Text Input change
    onModalTitleInput({ localState }: AppState, payload: TTextInput.IOnInputChangeArg): Partial<AppState> {
        const { val, isValid, errMsg } = payload;
        const { modal } = localState;
        const isValueValid = modal.valueInput.isValid;
        return {
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    isConfirmBtnEnabled: isValid && isValueValid,
                    titleInput: {
                        isValid,
                        errMsg,
                        value: val
                    }
                }
            }
        };
    }

    onModalValueInput({ localState }: AppState, payload: TTextInput.IOnInputChangeArg): Partial<AppState>  {
        const { val, isValid, errMsg } = payload;
        const { modal } = localState;
        const isTitleValid = modal.titleInput.isValid;
        return {
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    isConfirmBtnEnabled: isValid && isTitleValid,
                    valueInput: {
                        isValid,
                        errMsg,
                        value: val
                    }
                }
            }
        };
    }

    //// HELPER
    getUpdatedSearchText(searchText: string, totalRecord: number) {
        return searchText
            ? totalRecord
                ? searchText
                : ''
            : searchText;
    }
}
