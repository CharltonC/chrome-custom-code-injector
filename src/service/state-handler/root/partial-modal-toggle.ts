import { StateHandle } from '../../state-handle';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import { modals } from '../../../constant/modals';
import { FileHandle } from '../../file-handle';
import { LocalState } from '../../../model/local-state';
import { RuleValidState } from '../../../model/rule-valid-state';
import { DelTarget } from '../../../model/del-target';
import { IStateHandler } from './type';

const { defSetting, importConfig, exportConfig, removeConfirm, editHost, editPath, addLib, editLib } = modals;
const fileHandle = new FileHandle();

export class ModalToggleStateHandler extends StateHandle.BaseStoreHandler {
    onModalOpen({ localState }: AppState, currModalId: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId
            }
        };
    }

    onModalCancel({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId: null,
                allowModalConfirm: false,
                editTarget: null,
                delTarget: new DelTarget(),
                targetValidState: new RuleValidState()
            }
        };
    }

    onSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, defSetting.id);
    }

    onImportConfigModal(state: AppState) {
        return this.reflect.onModalOpen(state, importConfig.id);
    }

    onExportConfigModal(state: AppState) {
        return this.reflect.onModalOpen(state, exportConfig.id);
    }

    onDelModal(state: AppState, { dataSrc, ctxIdx, parentCtxIdx }) {
        const { reflect } = this;
        const { localState, setting } = state;
        const { showDeleteModal } = setting;
        const isDelSingleItem = Number.isInteger(ctxIdx);

        const baseModState = {
            ...localState,
            dataSrc: dataSrc.concat(),
            currModalId: removeConfirm.id,
        };

        const partialModState: Partial<AppState> = {
            localState: isDelSingleItem ? {
                    ...baseModState,
                    delTarget: new DelTarget(ctxIdx, parentCtxIdx),
                } : baseModState
        };

        return showDeleteModal ? partialModState : reflect.onDelModalConfirm({...state, ...partialModState});
    }

    onDelModalConfirm(state: AppState) {
        const { reflect } = this as unknown as IStateHandler;
        const { searchedRules, delTarget, pgnState } = state.localState;
        const { ctxIdx, parentCtxIdx } = delTarget;
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
            currModalId: null,
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

    onAddHostModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                currModalId: editHost.id,
                editTarget: new HostRuleConfig('', '')
            }
        };
    }

    onAddHostConfirm(state: AppState) {
        const { localState, rules, setting } = state;
        const cloneRules = rules.concat();
        const { editTarget } = localState;
        const resetState = this.reflect.onModalCancel(state);

        // merge with user config before added
        Object.assign(editTarget, setting.defRuleConfig);
        cloneRules.push(localState.editTarget);

        return {
            ...resetState,
            rules: cloneRules
        };
    }

    onAddPathModal({ localState }: AppState, idx: number) {
        return {
            localState: {
                ...localState,
                currModalId: editPath.id,
                addSubTargetIdx: idx,
                editTarget: new PathRuleConfig('', '')
            }
        };
    }

    onAddPathConfirm({ localState, rules, setting }: AppState) {
        const cloneRules = rules.concat();
        const { editTarget, addSubTargetIdx } = localState;
        const { isHttps, ...defConfig } = setting.defRuleConfig

        // merge with user config before added
        Object.assign(editTarget, defConfig);
        cloneRules[addSubTargetIdx].paths.push(editTarget);

        return {
            rules: cloneRules,
            localState: {
                ...localState,
                currModalId: null,
                addSubTargetIdx: null,
                allowModalConfirm: false,
                targetValidState: new RuleValidState()
            }
        };
    }

    async onImportModalConfirm({ localState }: AppState) {
        return {
            rules: await fileHandle.readJson(localState.importFile),
            localState: {
                ...localState,
                allowModalConfirm: false,
                importFile: null,
                currModalId: null
            }
        };
    }

    onExportModalConfirm({ rules, localState }: AppState) {
        const { exportFileName } = localState;
        fileHandle.saveJson(rules, exportFileName, true);

        return {
            localState: {
                ...localState,
                currModalId: null,
                allowModalConfirm: false,
                exportFileName: null
            }
        };
    }
}