import { StateHandle } from '../../../handle/state';
import { FileHandle } from '../../../handle/file';
import { HandlerHelper } from '../helper';
import { modals } from '../../../constant/modals';
import { AppState } from '../../model';
import { TextInputState } from '../../model/text-input-state';
import * as TTextInput from '../../../component/base/input-text/type';

const fileHandle = new FileHandle();

export class ModalStateHandler extends StateHandle.BaseStateHandler {
    //// BASE
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

                // Modal - Base State
                activeModalId: null,
                isModalConfirmBtnEnabled: false,

                // Reset any text input states including text, validation
                modalTitleInput: new TextInputState(),
                modalValueInput: new TextInputState(),
                modalImportFileInput: null,
                modalExportFileInput: new TextInputState(),
                modalRuleIdx: null,
                modalLibIdx: null,
            }
        };
    }

    //// SETTING
    onSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, modals.defSetting.id);
    }

    onImportSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, modals.importConfig.id);
    }

    async onImportSettingModalOk({ localState }: AppState) {
        // TODO: try/catch for read
        return {
            rules: await fileHandle.readJson(localState.modalImportFileInput),
            localState: {
                ...localState,
                isModalConfirmBtnEnabled: false,
                modalImportFileInput: null,
                activeModalId: null
            }
        };
    }

    onExportSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, modals.exportConfig.id);
    }

    onExportSettingModalOk(state: AppState) {
        const { rules, localState } = state;
        const { value } = localState.modalExportFileInput;
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

    //// INPUT PLACEHOLDER
    onModalTitleInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg) {
        return HandlerHelper.getTextlInputChangeState({
            ...payload,
            inputKey: 'modalTitleInput',
            key: 'title',
            rules,
            localState,
        });
    }

    onModalValueInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg) {
        return HandlerHelper.getTextlInputChangeState({
            ...payload,
            inputKey: 'modalValueInput',
            key: 'value',
            rules,
            localState,
        });
    }
}