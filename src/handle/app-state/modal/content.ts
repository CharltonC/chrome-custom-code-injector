import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { Setting } from '../../../model/setting';

export class ModalContentStateHandler extends StateHandle.BaseStateHandler {
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

    onDelConfirmToggle({ setting }: AppState) {
        return {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
    }

    //// Add/Edit Rule
    onEditItemIdChange({ localState }: AppState, { val, validState }) {
        const { modalEditTarget, modalEditTargetValidState } = localState;
        const { isValueValid } = modalEditTargetValidState;
        const { isValid } = validState;
        const { id } = modalEditTarget;

        return {
            localState: {
                ...localState,
                modalEditTargetValidState: {
                    ...modalEditTargetValidState,
                    isIdValid: isValid
                },
                allowModalConfirm: isValueValid && isValid,
                modalEditTarget: {
                    ...modalEditTarget,
                    id: isValid ? val : id
                },
            }
        };
    }

    onEditItemValChange({ localState }: AppState, { val, validState }) {
        const { modalEditTarget, modalEditTargetValidState } = localState;
        const { isIdValid } = modalEditTargetValidState;
        const { isValid } = validState;
        const { value } = modalEditTarget;

        return {
            localState: {
                ...localState,
                modalEditTargetValidState: {
                    ...modalEditTargetValidState,
                    isValueValid: isValid
                },
                allowModalConfirm: isIdValid && isValid,
                modalEditTarget: {
                    ...modalEditTarget,
                    value: isValid ? val : value
                },
            }
        };
    }

    //// Import/Export Rules
    onImportFileChange({ localState }, { target }, { isValid }) {
        return {
            localState: {
                ...localState,
                importFile: target.files.item(0),
                allowModalConfirm: isValid
            }
        };
    }

    onExportFileNameChange({ localState }: AppState, { validState, val }) {
        const isValid = validState?.isValid ?? true;

        return {
            localState: {
                ...localState,
                allowModalConfirm: isValid,
                exportFileName: isValid ? val : null
            }
        };
    }
}