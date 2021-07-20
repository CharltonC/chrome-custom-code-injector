import { StateHandle } from '../../../handle/state';
import { AppState } from '../../model/app-state';
import { Setting } from '../../model/setting';
import { HostRuleConfig, PathRuleConfig } from '../../model/rule-config';
import { modals } from '../../../constant/modals';
import { FileHandle } from '../../../handle/file';
import { LocalState } from '../../model/local-state';
import { RuleValidState } from '../../model/rule-valid-state';
import { modalDelTarget } from '../../model/del-target';
import { IStateHandler } from '../type';
import { TextInputState } from '../../model/text-input';

const { defSetting, importConfig, exportConfig, removeConfirm, editHost, editPath, addLib, editLib } = modals;
const fileHandle = new FileHandle();

export class ModalStateHandler extends StateHandle.BaseStateHandler {
    //// Content: Settings
    onResultsPerPageChange({ setting }: AppState, payload) {
        const { idx } = payload;
        return {
            setting: {
                ...setting,
                resultsPerPageIdx: idx
            }
        };
    }

    onResetAll() {
        return {
            setting: new Setting()
        };
    }

    onDefHostRuleToggle({ setting }: AppState, payload) {
        const { key } = payload;
        const { defRuleConfig } = setting;
        const isValid = key in defRuleConfig && typeof defRuleConfig[key] === 'boolean';
        if (!isValid) throw new Error('key is not valid');

        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    [key]: !defRuleConfig[key]
                }
            }
        };
    }

    onDefJsExecStageChange({ setting }: AppState, payload) {
        const { idx } = payload;
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

    onDelConfirmDialogToggle({ setting }: AppState) {
        return {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
    }

    //// Toggle
    onModalOpen({ localState }: AppState, activeModalId: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                activeModalId
            }
        };
    }

    onModalCancel({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                activeModalId: null,
                isModalConfirmBtnEnabled: false,

                // TODO: remove?
                modalDelTarget: new modalDelTarget(),

                // Reset any text input states including text, validation
                titleInput: new TextInputState(),
                hostOrPathInput: new TextInputState(),
                exportFilenameInput: new TextInputState(),
                hostIdxForNewPath: null,
                importFilePath: null,
            }
        };
    }

    onSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, defSetting.id);
    }

    onDelModal(state: AppState, { dataSrc, ctxIdx, parentCtxIdx }) {
        const { reflect } = this;
        const { localState, setting } = state;
        const { showDeleteModal } = setting;
        const isDelSingleItem = Number.isInteger(ctxIdx);

        const baseModState = {
            ...localState,
            dataSrc: dataSrc.concat(),
            activeModalId: removeConfirm.id,
        };

        const partialModState: Partial<AppState> = {
            localState: isDelSingleItem ? {
                    ...baseModState,
                    modalDelTarget: new modalDelTarget(ctxIdx, parentCtxIdx),
                } : baseModState
        };

        return showDeleteModal ? partialModState : reflect.onDelModalConfirm({...state, ...partialModState});
    }

    onDelModalConfirm(state: AppState) {
        const { reflect } = this as unknown as IStateHandler;
        const { searchedRules, modalDelTarget, pgnState } = state.localState;
        const { ctxIdx, parentCtxIdx } = modalDelTarget;
        const isDelSingleItem = Number.isInteger(ctxIdx);
        const isSearch = searchedRules?.length;

        const resetLocalState: LocalState = {
            ...reflect.onModalCancel(state).localState,
            pgnState: {
                ...pgnState,
                curr: 0,
                startIdx: 0,
                endIdx: null
            },
            dataSrc: null,
            activeModalId: null,
            selectState: {              // in case of side-effect on `selectedRowKeys` state
                areAllRowsSelected: false,
                selectedRowKeys: {},
            }
        };

        const { rules, localState } = isDelSingleItem ?
            ( isSearch ?
                reflect.rmvSearchedRow(state, ctxIdx, parentCtxIdx) :
                reflect.rmvRow(state, ctxIdx, parentCtxIdx) ) :
            ( isSearch ?
                reflect.rmvSearchedRows(state) :
                reflect.rmvRows(state)) ;

        return {
            localState: {
                ...resetLocalState,
                ...localState,
            },
            rules
        };
    }

    //// Add Host/Path
    onAddRuleModalInputChange({ localState }: AppState, payload): Partial<AppState> {
        const { val, validState, isGte3, inputKey } = payload;
        const inputState = localState[inputKey];

        const isValid = isGte3 && validState?.isValid;
        // TODO: err msg constant
        const errMsg = !isGte3
            ? [ 'value must be 3 characters or more' ]
            : validState?.errMsg
                ? validState?.errMsg
                : inputState.errMsg;

        // Check valid state of other text inputs in the same Modal
        // TODO: constant
        const inputKeys = ['titleInput', 'hostOrPathInput'];
        const isModalConfirmBtnEnabled = isValid && inputKeys
            .filter(key => key !== inputKey)
            .every(key => localState[key].isValid);

        return {
            localState: {
                ...localState,
                isModalConfirmBtnEnabled,
                [inputKey]: {
                    isValid,
                    errMsg,
                    value: val
                }
            }
        };
    }
    onAddHostRuleModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                activeModalId: editHost.id
            }
        };
    }

    onAddHostModalRuleConfirm(state: AppState) {
        const { localState, rules, setting } = state;

        const { titleInput, hostOrPathInput } = localState;
        const title: string = titleInput.value;
        const host: string = hostOrPathInput.value;
        const hostRule = new HostRuleConfig(title, host);
        Object.assign(hostRule, setting.defRuleConfig);
        rules.push(hostRule);

        const modalResetState = this.reflect.onModalCancel(state);
        return {
            ...modalResetState,
            rules: rules.concat([])
        };
    }

    onAddPathRuleModal({ localState }: AppState, payload) {
        const { idx } = payload;
        return {
            localState: {
                ...localState,
                activeModalId: editPath.id,
                hostIdxForNewPath: idx,
            }
        };
    }

    onAddPathRuleModalConfirm(state: AppState) {
        const { localState, rules, setting } = state;

        const { titleInput, hostOrPathInput, hostIdxForNewPath } = localState;
        const title: string = titleInput.value;
        const host: string = hostOrPathInput.value;
        const pathRule = new PathRuleConfig(title, host);
        Object.assign(pathRule, setting.defRuleConfig);
        rules[hostIdxForNewPath].paths.push(pathRule);

        const resetState = this.reflect.onModalCancel(state);
        return {
            ...resetState,
            rules: rules.concat([])
        };
    }

    //// Import/Export Json Config
    onImportConfigFileModal(state: AppState) {
        return this.reflect.onModalOpen(state, importConfig.id);
    }

    // TODO: payload object
    onImportConfigFileModalInputChange({ localState }, ...payload) {
        const [ { target }, { isValid } ] = payload;
        return {
            localState: {
                ...localState,
                importFilePath: target.files.item(0),
                isModalConfirmBtnEnabled: isValid
            }
        };
    }


    async onImportConfigFileModalConfirm({ localState }: AppState) {
        // TODO: try/catch for read
        return {
            rules: await fileHandle.readJson(localState.importFilePath),
            localState: {
                ...localState,
                isModalConfirmBtnEnabled: false,
                importFilePath: null,
                activeModalId: null
            }
        };
    }

    onExportConfigFileModal(state: AppState) {
        return this.reflect.onModalOpen(state, exportConfig.id);
    }

    onExportConfigFileModalInputChange({ localState }: AppState, payload) {
        const { isGte3, validState, val } = payload;
        const isValid = isGte3 && validState?.isValid;

        return {
            localState: {
                ...localState,
                exportFilenameInput: {
                    value: val,
                    isValid,
                    errMsg: validState?.errMsg,
                },
                isModalConfirmBtnEnabled: isValid,
            }
        };
    }

    onExportConfigFileModalConfirm(state: AppState) {
        const { rules, localState } = state;
        const { value } = localState.exportFilenameInput;
        fileHandle.saveJson(rules, value, true);

        const resetState = this.reflect.onModalCancel(state);
        return {
            ...resetState,
            localState: {
                ...localState,
                activeModalId: null,
                isModalConfirmBtnEnabled: false,
            }
        };
    }
}