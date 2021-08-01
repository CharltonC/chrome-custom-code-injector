import { HostRuleConfig, PathRuleConfig } from '../../../data/model/rule-config';
import { StateHandle } from '../../../handle/state';
import { FileHandle } from '../../../handle/file';
import { dataHandle } from '../../../data/handler';
import { AppState } from '../../model';
import { LocalState } from '../../model/local-state';
import { SettingState } from '../../model/setting-state';
import * as TSelectDropdown from '../../../component/base/select-dropdown/type';
import * as TFileInput from  '../../../component/base/input-file/type';
import * as TTextInput from '../../../component/base/input-text/type';
import { modals } from '../../../constant/modals';
import { ActiveRuleState } from '../../model/active-rule-state';
import { DataGridState } from '../../model/data-grid-state';
import { PgnHandle } from '../../../handle/pagination';

const fileHandle = new FileHandle();
const pgnHandle = new PgnHandle();

export class ModalStateHandler extends StateHandle.BaseStateHandler {
    //// BASE
    onModal({ localState }: AppState, payload) {
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

    onModalCancel({ localState }: AppState) {
        // Reset modal state
        const { modal } = new LocalState();
        return {
            localState: {
                ...localState,
                modal
            }
        };
    }

    //// SETTING IMPORT/EXPORT
    async onImportSettingModalOk(state: AppState) {
        const { modal } = state.localState;
        const { importFileInput } = modal;

        try {
            const rules = await fileHandle.readJson(importFileInput);
            const { localState } = this.reflect.onModalCancel(state);
            return { rules, localState };
        } catch (e) {
            // TODO: show error state and dont close the modal
            return {};
        }
    }

    onExportSettingModalOk(state: AppState) {
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

    onExportInputChange({ localState }: AppState, payload) {
        const { isGte3, validState, val } = payload;
        const isValid = isGte3 && validState?.isValid;

        return {
            localState: {
                ...localState,
                modalExportFileInput: {
                    value: val,
                    isValid,
                    errMsg: validState?.errMsg,
                },
                isModalConfirmBtnEnabled: isValid,
            }
        };
    }

    //// SETTINGS
    onResultsPerPageChange({ setting }: AppState, payload: TSelectDropdown.IOnSelectArg) {
        const { selectValueAttrVal } = payload;
        return {
            setting: {
                ...setting,
                resultsPerPageIdx: selectValueAttrVal
            }
        };
    }

    onResetAll() {
        return {
            setting: new SettingState()
        };
    }

    onDefHttpsToggle({ setting }: AppState) {
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

    onDefJsToggle({ setting }: AppState) {
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

    onDefCssToggle({ setting }: AppState) {
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

    onDefLibToggle({ setting }: AppState) {
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

    onDefJsExecStageChange({ setting }: AppState, payload: TSelectDropdown.IOnSelectArg) {
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

    onDelConfirmDialogToggle({ setting }: AppState) {
        return {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
    }

    //// RULE CRUD
    onAddHostModalOk(state: AppState): Partial<AppState> {
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

    onAddPathModal({ localState }: AppState, payload): Partial<AppState> {
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

    onAddPathModalOk(state: AppState): Partial<AppState> {
        const { reflect } = this;
        const { localState, rules, setting } = state;
        const { modal, listView } = localState;
        const { titleInput, valueInput } = modal;
        const { ruleIdCtx } = listView;

        const title = titleInput.value;
        const urlPath = valueInput.value;
        const path = new PathRuleConfig(title, urlPath);
        Object.assign(path, setting.defRuleConfig);
        dataHandle.addPath(rules, ruleIdCtx, path);

        const { modal: resetModal } = reflect.onModalCancel(state).localState;
        return {
            localState: {
                ...localState,
                modal: resetModal
            }
        };
    }

    onDelHostOrPathModal(state: AppState, payload): Partial<AppState> {
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
                    // TODO; searchText clear if any?
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

    onDelHostOrPathModalOk(state: AppState): Partial<AppState> {
        const { rules, localState } = state;
        const { isListView, listView, editView, modal } = localState;
        const { searchText: currSearchText } = listView;

        // Get the ID context (host, path) depending on the view
        const { ruleIdCtx } = isListView ? listView : editView;
        ruleIdCtx.pathId
            ? dataHandle.rmvPath(rules, ruleIdCtx)
            : dataHandle.rmvHost(rules, ruleIdCtx);

        // Clear the Search after rules are altered (List view only)
        const searchText = currSearchText
            ? rules.length
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

        return isListView
            ? {
                localState: {
                    ...newLocalState,
                    listView: {
                        ...listView,
                        searchText,
                        ruleIdCtx: new ActiveRuleState()
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

    onDelHostsModal(state: AppState): Partial<AppState> {
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

    onDelHostsModalOk(state: AppState): Partial<AppState> {
        const { rules, localState } = state;
        const { listView, modal } = localState;
        const { dataGrid, searchText: currSearchText } = listView;

        const { selectState, pgnOption, sortedData, pgnState: currPgnState } = dataGrid;
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;

        // Check to see if sorting exists for the DataGrid, if so use the sorted data as Source of truth
        const dataGridSrc = sortedData || rules;

        // In case is there is pagination, we need to find out the range of data it is showing
        // (i.e. start and end index, not necessary all the data but only at the page)
        // hence use it to get the IDs of all selected rows and remove them
        const pgnState = currPgnState
            ? currPgnState
            : pgnHandle.createState(dataGridSrc, pgnOption);
        const { startIdx, endIdx } = pgnState;
        const delIds = dataGridSrc.slice(startIdx, endIdx).map(({ id }) => id);
        areAllRowsSelected
            ? dataHandle.rmvHostsFromIds(rules, delIds)
            : dataHandle.rmvPartialHosts(rules, selectedRowKeyCtx);

        // Clear the Search after rules are altered (List view only)
        const searchText = currSearchText
            ? rules.length
                ? currSearchText
                : ''
            : currSearchText ;

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
                    dataGrid: {
                        ...new DataGridState(),
                        pgnState,
                        pgnOption
                    }
                }
            }
        };
    }

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
}