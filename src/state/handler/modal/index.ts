import { HostRuleConfig, PathRuleConfig } from '../../../data/model/rule-config';
import { StateHandle } from '../../../handle/state';
import { FileHandle } from '../../../handle/file';
import { dataHandle } from '../../../data/handler';
import { IAppState } from '../../model/type';
import { SettingState } from '../../model/setting-state';
import * as TSelectDropdown from '../../../component/base/select-dropdown/type';
import * as TFileInput from  '../../../component/base/input-file/type';
import * as TTextInput from '../../../component/base/input-text/type';
import { modals } from '../../../constant/modals';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { DataGridState } from '../../model/data-grid-state';
import { PgnHandle } from '../../../handle/pagination';
import { ModalState } from '../../model/modal-state';

const fileHandle = new FileHandle();
const pgnHandle = new PgnHandle();

export class ModalStateHandler extends StateHandle.BaseStateHandler {
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

    //// SETTING IMPORT/EXPORT
    async onImportSettingModalOk(state: IAppState): Promise<Partial<IAppState>> {
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

    onExportSettingModalOk(state: IAppState): Partial<IAppState> {
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
    onAddHostModalOk(state: IAppState): Partial<IAppState> {
        const { reflect } = this;
        const { localState, rules, setting } = state;
        const { titleInput, valueInput } = localState.modal;

        const title = titleInput.value;
        const url = valueInput.value;
        const host = new HostRuleConfig(title, url);
        Object.assign(host, setting.defRuleConfig);
        dataHandle.addHost(rules, host);

        const { modal: resetModal } = reflect.onModalCancel(state).localState;
        return {
            localState: {
                ...localState,
                modal: resetModal
            }
        };
    }

    onAddPathModal({ localState }: IAppState, payload: {hostId: string}): Partial<IAppState> {
        const { hostId } = payload;
        const { isListView, listView, modal } = localState;
        const baseLocalState = {
            ...localState,
            modal: {
                ...modal,
                currentId: modals.addPath.id
            },
        };

        return isListView
            ? {
                localState: {
                    ...baseLocalState,
                    listView: {
                        ...listView,
                        ruleIdCtx: { hostId }
                    },
                }
            }
            // Edit View already has a relative context via `ruleIdCtx` hence empty
            : {
                localState: baseLocalState
            };
    }

    onAddPathModalOk(state: IAppState): Partial<IAppState> {
        const { localState, rules, setting } = state;
        const { modal, listView } = localState;
        const { titleInput, valueInput } = modal;
        const { ruleIdCtx, dataGrid } = listView;
        const { pgnOption } = dataGrid;

        // Add host
        const title = titleInput.value;
        const urlPath = valueInput.value;
        const path = new PathRuleConfig(title, urlPath);
        Object.assign(path, setting.defRuleConfig);
        dataHandle.addPath(rules, ruleIdCtx, path);

        // Update pagination state after addition
        const { length } = rules;
        const pgnState = pgnHandle.getState(length, pgnOption);

        return {
            localState: {
                ...localState,
                modal: new ModalState(),
                listView: {
                    ...listView,
                    dataGrid: {
                        ...dataGrid,
                        pgnState
                    }
                }
            }
        };
    }

    onDelHostOrPathModal(state: IAppState, payload: {hostId: string; pathId?: string}): Partial<IAppState> {
        const { reflect } = this;
        const { localState, setting } = state;
        const { hostId, pathId } = payload;
        const { isListView, listView, modal } = localState;
        const baseLocalState = {
            ...localState,
            modal: {
                ...modal,
                currentId: modals.delHostOrPath.id
            },
        };
        const newState = isListView
            ? {
                localState: {
                    ...baseLocalState,
                    listView: {
                        ...listView,
                        ruleIdCtx: { hostId, pathId }
                    },
                }
            }
            // Edit View already has a relative context via `ruleIdCtx` hence empty
            : {
                localState: baseLocalState
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

        // List View only
        const { searchText: currSearchText, dataGrid, } = listView;
        const { pgnOption } = dataGrid;

        // List View & Edit View: Get the ID context (host, path) depending on the view
        const { ruleIdCtx } = isListView ? listView : editView;
        ruleIdCtx.pathId
            ? dataHandle.rmvPath(rules, ruleIdCtx)
            : dataHandle.rmvHost(rules, ruleIdCtx);

        // List View only: Clear the Search only if text exists + all hosts are removed
        const { length: totalRecord } = rules;
        const searchText = currSearchText
            ? totalRecord
                ? currSearchText
                : ''
            : currSearchText ;

        const newLocalState = {
            ...localState,
            modal: {
                ...modal,
                currentId: null
            }
        };

        // List View only: If a host is removed, Update new pagination state after rules removal (depends on total no. of hosts)
        const isHost = !ruleIdCtx.pathId;
        const dataGridState = isHost
            ? new DataGridState({ totalRecord, pgnOption })
            : dataGrid;

        return isListView
            ? {
                localState: {
                    ...newLocalState,
                    listView: {
                        ...listView,
                        searchText,
                        ruleIdCtx: new RuleIdCtxState(),
                        dataGrid: dataGridState
                    },
                },
            }
            : {
                localState: {
                    ...newLocalState,
                    editView: {
                        ...editView,
                        // TODO: ruleIdCtx (for the next active item)
                    }
                }
            }
    }

    onDelHostsModal(state: IAppState): Partial<IAppState> {
        const { reflect } = this;
        const { localState, setting } = state;
        const { modal } = localState;

        const newState = {
            localState: {
                ...localState,
                modal: {
                    ...modal,
                    currentId: modals.delHosts.id
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

        const { selectState, pgnOption, sortedData, pgnState } = dataGrid;
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;

        // Check to see if sorting exists for the DataGrid, if so use the sorted data as Source of truth
        const dataGridSrc = sortedData || rules;
        const { startIdx, endIdx } = pgnState;

        // Get Ids of hosts to be deleted from the set of rules we use: sorted data
        // - Sorted Data takes priority if exists (since it is inclusive of search)
        // - else we fall back to `rules` (if search doesnt exists) or search rules (if search text exists)
        const delIds = sortedData
            ? dataGridSrc.slice(startIdx, endIdx).map(({ id }) => id)
            : dataHandle.getFilteredRules(rules, currSearchText).map(({id}) => id);

        areAllRowsSelected
            ? dataHandle.rmvHostsFromIds(rules, delIds)
            : dataHandle.rmvPartialHosts(rules, selectedRowKeyCtx);

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