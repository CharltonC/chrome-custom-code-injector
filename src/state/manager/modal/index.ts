import { StateHandle } from '../../../handle/state';
import { FileHandle } from '../../../handle/file';
import { PgnHandle } from '../../../handle/pagination';
import { dataManager } from '../../../data/manager';
import { modalSet } from '../../../constant/modal-set';

import { HostRuleConfig, PathRuleConfig, LibRuleConfig } from '../../../data/model/rule-config';
import { SettingState } from '../../model/setting-state';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { DataGridState } from '../../model/data-grid-state';
import { ModalState } from '../../model/modal-state';
import * as TSelectDropdown from '../../../component/base/select-dropdown/type';
import * as TFileInput from  '../../../component/base/input-file/type';
import * as TTextInput from '../../../component/base/input-text/type';
import { IAppState } from '../../model/type';
import { IOnDelHostsModalPayload } from '../type';
import { TextInputState } from '../../model/text-input-state';

// TODO: property
const fileHandle = new FileHandle();
const pgnHandle = new PgnHandle();

export class ModalStateManager extends StateHandle.BaseStateManager {
    //// BASE
    // used ONLY WHEN setting modal Id is the only thing required to be altered
    onModal({ localState }: IAppState, payload: {id: string}): Partial<IAppState> {
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

    onModalCancel({ localState }: IAppState): Partial<IAppState> {
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
    onImportDataModal(state: IAppState): Partial<IAppState> {
        return this.reflect.onModal(state, {
            id: modalSet.importConfig.id
        });
    }

    async onImportDataModalOk(state: IAppState): Promise<Partial<IAppState>> {
        const { modal } = state.localState;
        const { importFileInput } = modal;

        try {
            const rules = (await fileHandle.readJson(importFileInput)) as HostRuleConfig[];
            const { localState } = this.reflect.onModalCancel(state);
            return { rules, localState };
        } catch (e) {
            // TODO: show error state and dont close the modal
            return {};
        }
    }

    onExportDataModal(state: IAppState): Partial<IAppState> {
        return this.reflect.onModal(state, {
            id: modalSet.exportConfig.id
        });
    }

    onExportDataModalOk(state: IAppState): Partial<IAppState> {
        const { rules, localState } = state;
        const { value } = localState.modal.exportFileInput;
        fileHandle.saveJson(rules, value, true);
        return this.reflect.onModalCancel(state);
    }

    onImportFileInputChange({ localState }, payload: TFileInput.IOnFileChange) {
        const { evt, isValid } = payload;
        return {
            localState: {
                ...localState,
                modalImportFileInput: evt.target.files.item(0),
                isModalConfirmBtnEnabled: isValid
            }
        };
    }

    onExportInputChange({ localState }: IAppState, payload: TTextInput.IOnInputChangeArg): Partial<IAppState> {
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
    onSettingModal(state: IAppState): Partial<IAppState> {
        return this.reflect.onModal(state, {
            id: modalSet.defSetting.id
        });
    }

    onResultsPerPageChange({ setting }: IAppState, payload: TSelectDropdown.IOnSelectArg): Partial<IAppState> {
        const { selectValueAttrVal } = payload;
        return {
            setting: {
                ...setting,
                resultsPerPageIdx: selectValueAttrVal
            }
        };
    }

    onResetAll(): Partial<IAppState> {
        return {
            setting: new SettingState()
        };
    }

    onDefHttpsToggle({ setting }: IAppState): Partial<IAppState> {
        const { defRuleConfig } = setting;
        const { isHttps } = defRuleConfig;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isHttps: !isHttps
                }
            }
        };
    }

    onDefJsToggle({ setting }: IAppState): Partial<IAppState> {
        const { defRuleConfig } = setting;
        const { isJsOn } = defRuleConfig;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isJsOn: !isJsOn
                }
            }
        };
    }

    onDefCssToggle({ setting }: IAppState): Partial<IAppState> {
        const { defRuleConfig } = setting;
        const { isCssOn } = defRuleConfig;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isCssOn: !isCssOn
                }
            }
        };
    }

    onDefLibToggle({ setting }: IAppState): Partial<IAppState> {
        const { defRuleConfig } = setting;
        const { isLibOn } = defRuleConfig;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    isLibOn: !isLibOn
                }
            }
        };
    }

    onDefJsExecStageChange({ setting }: IAppState, payload: TSelectDropdown.IOnSelectArg): Partial<IAppState> {
        const { selectValueAttrVal } = payload;
        const { defRuleConfig } = setting;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    jsExecPhase: selectValueAttrVal
                }
            }
        };
    }

    onDelConfirmDialogToggle({ setting }: IAppState): Partial<IAppState> {
        return {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
    }

    //// RULE CRUD
    // Add
    onAddHostModal(state: IAppState) {
        return this.reflect.onModal(state, {
            id: modalSet.addHost.id
        });
    }

    onAddHostModalOk(state: IAppState): Partial<IAppState> {
        const { localState, rules, setting } = state;
        const { titleInput, valueInput } = localState.modal;

        const title = titleInput.value;
        const url = valueInput.value;
        const host = new HostRuleConfig(title, url);
        Object.assign(host, setting.defRuleConfig);
        dataManager.addHost(rules, host);

        return {
            localState: {
                ...localState,
                modal: new ModalState()
            }
        };
    }

    onAddPathModal({ localState }: IAppState, payload?: RuleIdCtxState): Partial<IAppState> {
        const { isListView, listView, modal } = localState;
        const baseLocalState = {
            ...localState,
            modal: {
                ...modal,
                currentId: modalSet.addPath.id
            },
        };

        return isListView
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
                localState: baseLocalState
            };
    }

    onAddPathModalOk({ localState, rules, setting }: IAppState): Partial<IAppState> {
        const { modal, isListView, listView, editView } = localState;
        const { ruleIdCtx } = isListView ? listView : editView;
        const { titleInput, valueInput } = modal;

        // Add host
        const title = titleInput.value;
        const urlPath = valueInput.value;
        const path = new PathRuleConfig(title, urlPath);
        Object.assign(path, setting.defRuleConfig);
        dataManager.addPath(rules, ruleIdCtx, path);

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
                rules: [...rules],
                localState: resetLocalState
            };
        }
    }

    onAddLibModal({ localState }: IAppState) {
        const { modal } = localState;
        return {
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    currentId: modalSet.addLib.id
                }
            }
        };
    }

    onAddLibModalOk({ rules, localState }: IAppState) {
        const { modal, editView } = localState;
        const { titleInput, valueInput } = modal;
        const { ruleIdCtx } = editView;
        const { value: title } = titleInput;
        const { value } = valueInput;
        const lib = new LibRuleConfig(title, value);
        dataManager.addLib(rules, ruleIdCtx, lib);

        return {
            localState: {
                ...localState,
                modal: new ModalState()
            }
        }
    }

    // Delete
    onDelHostOrPathModal(state: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const { reflect } = this;
        const { localState, setting } = state;
        const { isListView, listView, editView, modal } = localState;
        const baseLocalState = {
            ...localState,
            modal: {
                ...modal,
                currentId: modalSet.delHostOrPath.id
            },
        };
        const newState: Partial<IAppState> = isListView
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

    onDelHostOrPathModalOk(state: IAppState): Partial<IAppState> {
        const { rules, localState } = state;
        const { isListView, listView, editView, modal } = localState;

        // Get the ID context (host, path) depending on the view
        const { ruleIdCtx } = isListView ? listView : editView;
        const isHost = !ruleIdCtx.pathId;
        const { hostIdx, pathIdx } = dataManager.getRuleIdxCtxFromIdCtx(rules, ruleIdCtx);

        // Delete Host or Path
        ruleIdCtx.pathId
            ? dataManager.rmvPath(rules, ruleIdCtx)
            : dataManager.rmvHost(rules, ruleIdCtx);

        const hasRules = !!rules.length;
        const resetLocalState = {
            ...localState,
            modal: {
                ...modal,
                currentId: null
            }
        };

        // If delete from List view
        if (isListView) {
            const { searchText: currSearchText, dataGrid, } = listView;
            const { pgnOption } = dataGrid;

            // Clear the Search only if text exists + all hosts are removed
            const { length: totalRecord } = rules;
            const searchText = currSearchText
                ? totalRecord
                    ? currSearchText
                    : ''
                : currSearchText ;

            // If a host is removed, Update new pagination state after rules removal (depends on total no. of hosts)
            const dataGridState = isHost
                ? new DataGridState({ totalRecord, pgnOption })
                : dataGrid;

            return {
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
                localState: {
                    ...resetLocalState,
                    isListView: true
                }
            };

        // If Edit view but has rules remained
        } else {
            // If a host is deleted, set the active host back to the 1st, else use the existing active host (if path is deleted)
            const nextHostIdx = isHost ? 0 : hostIdx;
            const nextHost = rules[nextHostIdx];
            const hostId = nextHost.id;

            // Get the next path Id, if paths remain in the next host
            const nextPaths = nextHost.paths;
            const nextPathIdx = isHost ? pathIdx : (nextPaths.length ? 0 : null);
            const pathId = nextPaths[nextPathIdx]?.id;

            return {
                localState: {
                    ...resetLocalState,
                    editView: {
                        ...editView,
                        ruleIdCtx: new RuleIdCtxState({ hostId, pathId })
                    }
                }
            };
        }
    }

    onDelHostsModal(state: IAppState, payload: IOnDelHostsModalPayload): Partial<IAppState> {
        const { reflect } = this;
        const { localState, setting } = state;
        const { modal, listView } = localState;
        const { srcRules, sliceIdxCtx } = payload;

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
            : reflect.onDelHostsModalOk({
                ...state,
                ...newState
            });
    }

    onDelHostsModalOk(state: IAppState): Partial<IAppState> {
        const { rules, localState } = state;
        const { listView, modal } = localState;
        const { dataGrid, searchText: currSearchText } = listView;

        // Remove based on specifid IDs
        const { selectState, pgnOption, srcRules, sliceIdxCtx } = dataGrid;
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
        const { startIdx, endIdx } = sliceIdxCtx;
        const delIds = srcRules.slice(startIdx, endIdx).map(({ id }) => id)
        areAllRowsSelected
            ? dataManager.rmvHostsFromIds(rules, delIds)
            : dataManager.rmvPartialHosts(rules, selectedRowKeyCtx);

        // Clear the Search after rules are altered (List view only)
        const { length: totalRecord } = rules;
        const searchText = currSearchText
            ? totalRecord
                ? currSearchText
                : ''
            : currSearchText ;

        // Update new pagination state after rules removal (depends on total no. of hosts)
        const dataGridState = new DataGridState({
            totalRecord,
            pgnOption
        });

        return {
            ...state,
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    currentId: null
                },
                listView: {
                    ...listView,
                    searchText,
                    dataGrid: dataGridState
                }
            }
        };
    }

    onDelLibModal(state: IAppState, payload: {id: string}): Partial<IAppState> {
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

    onDelLibModalOk({ rules, localState }: IAppState): Partial<IAppState> {
        const { editView } = localState;
        const { libRuleIdCtx } = editView;
        dataManager.rmvLib(rules, libRuleIdCtx);

        return {
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

    onDelLibsModal({ localState }: IAppState, payload): Partial<IAppState> {
        return {
            localState: {
                ...localState,
                modal: {
                    ...localState.modal,
                    currentId: modalSet.delLibs.id
                }
            }
        };
    }

    onDelLibsModalOk({ rules, localState }: IAppState): Partial<IAppState> {
        const { editView } = localState;
        const { ruleIdCtx, dataGrid } = editView;
        const { areAllRowsSelected, selectedRowKeyCtx } = dataGrid.selectState;

        areAllRowsSelected
            ? dataManager.rmvAllLibs(rules, ruleIdCtx)
            : dataManager.rmvPartialLibs(rules, selectedRowKeyCtx, ruleIdCtx);

        return {
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
    onEditLibModal({ rules, localState }: IAppState, payload: {id: string}): Partial<IAppState> {
        const { id } = payload;
        const { editView, modal } = localState;

        const libRuleIdCtx = { ...editView.ruleIdCtx, libId: id };
        const { title, value } = dataManager.getRuleFromIdCtx(rules, libRuleIdCtx);
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

    onEditLibModalOk({ rules, localState }: IAppState) {
        const { modal, editView } = localState;
        const { titleInput, valueInput } = modal;
        const { libRuleIdCtx } = editView;
        const { value: title } = titleInput;
        const { value } = valueInput;
        dataManager.setProps(rules, libRuleIdCtx, {
            title,
            value
        });

        return {
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
    onModalTitleInput({ localState }: IAppState, payload: TTextInput.IOnInputChangeArg): Partial<IAppState> {
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

    onModalValueInput({ localState }: IAppState, payload: TTextInput.IOnInputChangeArg): Partial<IAppState>  {
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
}