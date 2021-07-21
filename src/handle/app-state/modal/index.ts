import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { Setting } from '../../../model/setting';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import { modals } from '../../../constant/modals';
import { FileHandle } from '../../file';
import { LocalState } from '../../../model/local-state';
import { IStateHandler } from '../type';
import { TextInputState } from '../../../model/text-input';
import { DelRuleState } from '../../../model/del-target';

const { defSetting, importConfig, exportConfig, removeConfirm, editHost, editPath, addLib, editLib } = modals;
const fileHandle = new FileHandle();

export class ModalStateHandler extends StateHandle.BaseStateHandler {
    //// Base/Generic
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

                // For delete
                delRule: new DelRuleState(),

                // Modal - Base State
                activeModalId: null,
                isModalConfirmBtnEnabled: false,

                // Reset any text input states including text, validation
                titleInput: new TextInputState(),
                hostOrPathInput: new TextInputState(),
                exportFilenameInput: new TextInputState(),
                hostIdxForNewPath: null,
                importFilePath: null,
            }
        };
    }

    //// Settings
    onSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, defSetting.id);
    }

    //// Delete Rule
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
                    delRule: new DelRuleState({ ctxIdx, parentCtxIdx }),
                } : baseModState
        };

        return showDeleteModal ? partialModState : reflect.onDelModalConfirm({...state, ...partialModState});
    }

    onDelModalConfirm(state: AppState) {
        const { reflect } = this as unknown as IStateHandler;
        const { searchedRules, delRule, pgnState } = state.localState;
        const { ctxIdx, parentCtxIdx } = delRule;
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

    //// Add Rule
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

    //// Import/Export Json Config File
    onImportConfigFileModal(state: AppState) {
        return this.reflect.onModalOpen(state, importConfig.id);
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