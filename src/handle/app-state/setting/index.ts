import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { Setting } from '../../../model/setting';

export class SettingStateHandler extends StateHandle.BaseStateHandler {
    //// Setting Modal Content
    onResultsPerPageChange({ setting }: AppState, payload) {
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

    //// Json Import/Export Modal Content
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
}