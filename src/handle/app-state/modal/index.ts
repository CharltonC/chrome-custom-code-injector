import { StateHandle } from '../../state';
import { FileHandle } from '../../file';
import { HandlerHelper } from '../helper';
import { modals } from '../../../constant/modals';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig, PathRuleConfig, LibRuleConfig } from '../../../model/rule-config';
import { LocalState } from '../../../model/local-state';
import { TextInputState } from '../../../model/text-input-state';
import { DelRuleState } from '../../../model/del-rule-state';
import { ActiveRuleState } from '../../../model/active-rule-state';
import * as TTextInput from '../../../component/base/input-text/type';
import { IStateHandler } from '../type';

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
                modalTitleInput: new TextInputState(),
                modalValueInput: new TextInputState(),
                modalImportFileInput: null,
                modalExportFileInput: new TextInputState(),
                modalRuleIdx: null,
                modalLibIdx: null,
            }
        };
    }

    //// Settings
    onSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, defSetting.id);
    }

    //// Delete Rule
    onDelModal(state: AppState, { dataSrc, ctxIdx, parentCtxIdx }) {
        const { localState, setting } = state;
        const { reflect } = this;
        const { ruleDataGrid} = localState;
        const { showDeleteModal } = setting;
        const isDelSingleItem = Number.isInteger(ctxIdx);

        const baseModState = {
            ...localState,
            activeModalId: removeConfirm.id,
            ruleDataGrid: {
                ...ruleDataGrid,
                dataSrc: dataSrc.concat(),
            }
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
        const { searchedRules, delRule, ruleDataGrid } = state.localState;
        const { ctxIdx, parentCtxIdx } = delRule;
        const isDelSingleItem = Number.isInteger(ctxIdx);
        const isSearch = searchedRules?.length;

        const resetLocalState: LocalState = {
            ...reflect.onModalCancel(state).localState,
            activeModalId: null,
            ruleDataGrid: {
                ...ruleDataGrid,
                dataSrc: null,
                pgnState: {
                    ...ruleDataGrid.pgnState,
                    curr: 0,
                    startIdx: 0,
                    endIdx: null
                },
                selectState: {              // in case of side-effect on `selectedRowKeys` state
                    areAllRowsSelected: false,
                    selectedRowKeys: {},
                }
            }
        };

        const { rules, localState } = isDelSingleItem ?
            ( isSearch ?
                reflect.onRmvSearchItem(state, ctxIdx, parentCtxIdx) :
                reflect.onRmvItem(state, ctxIdx, parentCtxIdx) ) :
            ( isSearch ?
                reflect.onRmvSearchItems(state) :
                reflect.onRmvItems(state)) ;

        return {
            localState: {
                ...resetLocalState,
                ...localState,
            },
            rules
        };
    }

    //// Add Rule
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

        const { modalTitleInput, modalValueInput } = localState;
        const title: string = modalTitleInput.value;
        const host: string = modalValueInput.value;
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
                modalRuleIdx: idx,
            }
        };
    }

    onAddPathRuleModalConfirm(state: AppState) {
        const { localState, rules, setting } = state;
        const {
            modalTitleInput, modalValueInput, modalRuleIdx,
            isListView, activeRule,
        } = localState;

        // Add new path to the target rule
        const title: string = modalTitleInput.value;
        const path: string = modalValueInput.value;
        const pathRule = new PathRuleConfig(title, path);
        Object.assign(pathRule, setting.defRuleConfig);
        const { paths } = rules[modalRuleIdx];
        const lastPathIdx = paths.length;   // get last index where the new path will be located/added
        paths.push(pathRule);

        // If it is Edit View, Make the added path as current active item
        const activeItemState = isListView ? {} : {
            activeRule: new ActiveRuleState({
                ...activeRule,
                isHost: false,
                pathIdx: lastPathIdx
            }),
            activeTitleInput: new TextInputState({ value: title }),
            activeValueInput: new TextInputState({ value: path }),
        };

        const resetState = this.reflect.onModalCancel(state);
        return {
            localState: {
                ...resetState.localState,
                ...activeItemState
            },
            rules: [...rules]
        };
    }

    onModalTitleInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg) {
        return HandlerHelper.onTextlInputChange({
            ...payload,
            inputKey: 'modalTitleInput',
            key: 'title',
            rules,
            localState,
        });
    }

    onModalValueInput({ rules, localState }: AppState, payload: TTextInput.IOnInputChangeArg) {
        return HandlerHelper.onTextlInputChange({
            ...payload,
            inputKey: 'modalValueInput',
            key: 'value',
            rules,
            localState,
        });
    }

    onAddLibModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                activeModalId: addLib.id
            }
        };
    }

    onAddLibModalConfirm(state: AppState) {
        const { localState, rules } = state;
        const { activeRule, modalTitleInput, modalValueInput } = localState;
        const { libs } = HandlerHelper.getActiveItem({
            ...activeRule,
            rules,
            isActiveItem: true,
        });
        const title = modalTitleInput.value;
        const value = modalValueInput.value;
        const lib = new LibRuleConfig(title, value);
        libs.push(lib);

        const resetState = this.reflect.onModalCancel(state);
        return {
            localState: {
                // Reset modal state
                ...resetState.localState,

                // Maintain active item
                activeRule,

                // Clear modal text input
                modalTitleInput: new TextInputState(),
                modalValueInput: new TextInputState(),
            }
        };
    }

    //// EDIT
    onEditLibModal({ localState }: AppState, payload) {
        const { title, value } = payload.lib;
        const isValid = true;
        const modalTitleInput = new TextInputState({
            value: title,
            isValid,
        });
        const modalValueInput = new TextInputState({
            value,
            isValid,
        });

        return {
            localState: {
                ...localState,
                activeModalId: editLib.id,
                modalTitleInput,
                modalValueInput,
            }
        };
    }

    //// Import/Export Json Config File
    onImportConfigFileModal(state: AppState) {
        return this.reflect.onModalOpen(state, importConfig.id);
    }

    async onImportConfigFileModalConfirm({ localState }: AppState) {
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

    onExportConfigFileModal(state: AppState) {
        return this.reflect.onModalOpen(state, exportConfig.id);
    }

    onExportConfigFileModalConfirm(state: AppState) {
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
}