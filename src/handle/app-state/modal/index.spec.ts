import { FileHandle } from '../../file';
import { ChromeHandle } from '../../chrome';
import { DataHandle } from '../../data';
import PgnHandle from '../../pagination';

import { modalSet } from '../../../constant/modal-set';
import { AppState } from '../../../model/app-state';
import { SettingState } from '../../../model/setting-state';
import { LocalState } from '../../../model/local-state';
import { ModalState } from '../../../model/modal-state';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { TestUtil } from '../../../asset/ts/test-util';
import { AMethodSpy } from '../../../asset/ts/test-util/type';
import { HostRule } from '../../../model/rule';
import { DataGridState } from '../../../model/data-grid-state';
import { ModalStateHandle } from '.';

const handle = new ModalStateHandle();

describe('Modal State Handle', () => {
    const mockRecordTotal = 5;
    const resetModalState = new ModalState();
    const resetRuleIdCtxState = new RuleIdCtxState();
    const mockFn = () => {};
    let mockState: AppState;
    let fileHandleSpy: AMethodSpy<FileHandle>;
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;
    let dataHandleSpy: AMethodSpy<DataHandle>;
    let pgnHandleSpy: AMethodSpy<PgnHandle>
    let handleSpy: AMethodSpy<ModalStateHandle>

    beforeEach(() => {
        fileHandleSpy = TestUtil.spyProtoMethods(FileHandle);
        dataHandleSpy = TestUtil.spyProtoMethods(DataHandle);
        chromeHandleSpy = TestUtil.spyProtoMethods(ChromeHandle);
        chromeHandleSpy.saveState.mockImplementation(mockFn);

        handleSpy = TestUtil.spyMethods(handle);

        mockState = {
            setting: new SettingState(),
            rules: [],
            localState: new LocalState(mockRecordTotal)
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Modal Base', () => {
        it('Method - onModal: should open Modal', () => {
            const mockPayload = { id: 'lorem' };
            const state = handle.onModal(mockState, mockPayload);
            expect(state).toEqual({
                localState: {
                    ...mockState.localState,
                    modal: {
                        ...mockState.localState.modal,
                        currentId: mockPayload.id
                    }
                }
            });
        });

        it('Method - onModalCamncel: should close and reset modal state', () => {
            const state = handle.onModalCancel(mockState);
            expect(state).toEqual({
                localState: {
                    ...mockState.localState,
                    modal: resetModalState
                }
            });
        });
    });

    describe('Import/Export Data', () => {
        describe('Method - onImportDataModal', () => {
            it('should open import data modal', () => {
                handleSpy.onModal.mockImplementation(mockFn);
                handle.onImportDataModal(mockState);
                expect(handleSpy.onModal).toHaveBeenCalledWith(mockState, {
                    id: modalSet.importConfig.id
                });
            });
        });

        describe('Method - onImportDataModalOk', () => {
            const mockRules = [];

            beforeEach(() => {
                fileHandleSpy.readJson.mockResolvedValue(mockRules);
                chromeHandleSpy.saveState.mockImplementation(mockFn);
            });

            it('should import data and close modal', async () => {
                handleSpy.onModalCancel.mockReturnValue(mockState);
                const state = await handle.onImportDataModalOk(mockState);
                expect(state).toEqual({
                    rules: mockRules,
                    localState: mockState.localState
                });
            });

            it('should not import data if error is encounted', async () => {
                handleSpy.onModalCancel.mockImplementation(() => {
                    throw new Error();
                });
                const state = await handle.onImportDataModalOk(mockState);
                expect(state).toEqual({});
            });
        });

        describe('Method - onExportDataModal', () => {
            it('should open export data modal', () => {
                handleSpy.onModal.mockImplementation(mockFn);
                handle.onExportDataModal(mockState);
                expect(handleSpy.onModal).toHaveBeenCalledWith(mockState, {
                    id: modalSet.exportConfig.id
                });
            });
        });

        describe('Method - onExportDataModalOk', () => {
            beforeEach(() => {
                fileHandleSpy.saveJson.mockImplementation(mockFn);
                handleSpy.onModalCancel.mockReturnValue({});
            });

            it('should import data and close modal', () => {
                const mockFileInputValue = 'mock-value';
                mockState.localState.modal.exportFileInput.value = mockFileInputValue;
                const state = handle.onExportDataModalOk(mockState);

                expect(fileHandleSpy.saveJson).toHaveBeenCalledWith(
                    mockState.rules,
                    mockFileInputValue,
                    true
                );
                expect(state).toEqual({});
            });
        });

        describe('Method - onImportFileInputChange', () => {
            const mockImportFileInput = 'file';
            const mockPayload: any = {
                isValid: true,
                evt: {
                    target: {
                        files: {
                            item: () => mockImportFileInput
                        }
                    }
                }
            };

            it('should set the updated file', () => {
                const state = handle.onImportFileInputChange(mockState, mockPayload);
                expect(state).toEqual({
                    localState: {
                        ...mockState.localState,
                        modal: {
                            ...mockState.localState.modal,
                            isConfirmBtnEnabled: mockPayload.isValid,
                            importFileInput: mockImportFileInput
                        }
                    }
                });
            });
        });

        describe('Method - onExportInputChange', () => {
            const mockVal = 'file';
            const mockPayload: any = {
                isValid: true,
                errMsg: [],
                val: mockVal
            };

            it('should set the updated file', () => {
                const state = handle.onExportInputChange(mockState, mockPayload);
                expect(state).toEqual({
                    localState: {
                        ...mockState.localState,
                        modal: {
                            ...mockState.localState.modal,
                            isConfirmBtnEnabled: mockPayload.isValid,
                            exportFileInput: {
                                value: mockPayload.val,
                                errMsg: mockPayload.errMsg,
                                isValid: mockPayload.isValid
                            }
                        }
                    }
                });
            });
        });
    });

    describe('Setting', () => {
        it('Method - onSettingModal: should open setting modal', () => {
            handle.onSettingModal(mockState);
            expect(handleSpy.onModal).toHaveBeenCalledWith(mockState, {
                id: modalSet.defSetting.id
            });
        });

        it('Method - onResultsPerPageChange: should set results per page for pagination and save to chrome', () => {
            const mockValue = 123;
            const mockPayload: any = { selectValueAttrVal: mockValue };
            const { resultsPerPageIdx } = handle.onResultsPerPageChange(mockState, mockPayload).setting;

            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(resultsPerPageIdx).toBe(mockValue);
        });

        it('Method - onResetAll: should reset all setting back to default and save to chrome', () => {
            const { setting } = handle.onResetAll();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(setting).toEqual(new SettingState());
        });

        it('Method - onDefHttpsToggle: should toggle the default enabled https of a rule and save to chrome', () => {
            const { isHttps } = handle.onDefHttpsToggle(mockState).setting.defRuleConfig;
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(isHttps).toBe(!mockState.setting.defRuleConfig.isHttps);
        });

        it('Method - onDefJsToggle: should toggle the default enabled js of a rule and save to chrome', () => {
            const { isJsOn } = handle.onDefJsToggle(mockState).setting.defRuleConfig;
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(isJsOn).toBe(!mockState.setting.defRuleConfig.isJsOn);
        });

        it('Method - onDefCssToggle: should toggle the default enabled css of a rule and save to chrome', () => {
            const { isCssOn } = handle.onDefCssToggle(mockState).setting.defRuleConfig;
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(isCssOn).toBe(!mockState.setting.defRuleConfig.isCssOn);
        });

        it('Method - onDefLibToggle: should toggle the default enabled libraries of a rule and save to chrome', () => {
            const { isLibOn } = handle.onDefLibToggle(mockState).setting.defRuleConfig;
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(isLibOn).toBe(!mockState.setting.defRuleConfig.isLibOn);
        });

        it('Method - onDefJsExecStageChange: should set the default js execution stage of a rule and save to chrome', () => {
            const mockValue = 123;
            const mockPayload: any = { selectValueAttrVal: mockValue };
            const { codeExecPhase } = handle.onDefJsExecStageChange(mockState, mockPayload).setting.defRuleConfig;

            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(codeExecPhase).toBe(mockValue);
        });

        it('Method - onDelConfirmDialogToggle: should toggle whether to show/hide delete modal when a rule is delete and save to chrome', () => {
            const { showDeleteModal } = handle.onDelConfirmDialogToggle(mockState).setting;
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
            expect(showDeleteModal).toBe(!mockState.setting.showDeleteModal);
        });
    });

    describe('Rule CRUD', () => {
        describe('Method - onAddHostModal', () => {
            it('should open add host modal', () => {
                handle.onAddHostModal(mockState);
                expect(handleSpy.onModal).toHaveBeenCalledWith(
                    mockState,
                    { id: modalSet.addHost.id }
                );
            });
        });

        describe('Method - onAddHostModalOk', () => {
            it('should add host, close modal and save to chrome', () => {
                dataHandleSpy.addHost.mockImplementation(mockFn);
                const { modal } = handle.onAddHostModalOk(mockState).localState;

                expect(dataHandleSpy.addHost).toHaveBeenCalled();
                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(modal).toEqual(resetModalState);
            });
        });

        describe('Method - onAddPathModal', () => {
            it('List View: should open add path modal with caching the rule ID context', () => {
                const mockPayload = { hostId: 'host', pathId: 'path'};
                const { localState } = handle.onAddPathModal(mockState, mockPayload);
                const { modal, listView } = localState;

                expect(modal.currentId).toBe(modalSet.addPath.id);
                expect(listView.ruleIdCtx).toEqual(mockPayload);
            });

            it('Edit View: should open add path modal', () => {
                mockState.localState.isListView = false;
                const { currentId } = handle.onAddPathModal(mockState).localState.modal;
                expect(currentId).toBe(modalSet.addPath.id);
            });
        });

        describe('Method - onAddPathModalOk: Addd Path', () => {
            beforeEach(() => {
                pgnHandleSpy = TestUtil.spyProtoMethods(PgnHandle);
                dataHandleSpy.addPath.mockImplementation(mockFn);
            });

            it('List View: should add path, close modal, reset pagination state and save to chrome', () => {
                const mockPgnState = { lorem: 123 };
                pgnHandleSpy.getState.mockReturnValue(mockPgnState);
                const { listView, modal } = handle.onAddPathModalOk(mockState).localState;

                expect(dataHandleSpy.addPath).toHaveBeenCalled();
                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(listView.dataGrid.pgnState).toEqual(mockPgnState);
                expect(modal).toEqual(resetModalState);
            });

            it('Edit View: should add path, close modal and save to chrome', () => {
                mockState.localState.isListView = false;

                const { modal } = handle.onAddPathModalOk(mockState).localState;
                expect(pgnHandleSpy.getState).not.toHaveBeenCalled();
                expect(dataHandleSpy.addPath).toHaveBeenCalled();
                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(modal).toEqual(resetModalState);
            });
        });

        describe('Method - onAddLibModal', () => {
            it('should open add library modal', () => {
                handle.onAddLibModal(mockState);
                expect(handleSpy.onModal).toHaveBeenCalledWith(
                    mockState,
                    { id: modalSet.addLib.id }
                );
            });
        });

        describe('Method - onAddLibModalOk', () => {
            it('should add library, close modal and save to chrome', () => {
                dataHandleSpy.addLib.mockImplementation(mockFn);
                const { modal } = handle.onAddLibModalOk(mockState).localState;

                expect(dataHandleSpy.addLib).toHaveBeenCalled();
                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(modal).toEqual(resetModalState);
            });
        });

        describe('Method - onDelHostOrPathModal', () => {
            const mockOnDelRtnState = {};
            const mockPayload = { hostId: 'host', pathId: 'path' };

            beforeEach(() => {
                handleSpy.onDelHostOrPathModalOk.mockReturnValue(mockOnDelRtnState);
            });

            it('List View: should open delete host/path modal', () => {
                const { modal, listView } = handle.onDelHostOrPathModal(mockState, mockPayload).localState;

                expect(modal.currentId).toBe(modalSet.delHostOrPath.id);
                expect(listView.ruleIdCtx).toEqual(mockPayload);
                expect(handleSpy.onDelHostOrPathModalOk).not.toHaveBeenCalled();
            });

            it('Edit View: should open delete host/path modal', () => {
                mockState.localState.isListView = false;
                const { modal, editView } = handle.onDelHostOrPathModal(mockState, mockPayload).localState;

                expect(modal.currentId).toBe(modalSet.delHostOrPath.id);
                expect(editView.ruleIdCtx).toEqual(mockPayload);
                expect(handleSpy.onDelHostOrPathModalOk).not.toHaveBeenCalled();
            });

            it('should proceed to delete host/path without opening modal if delete modal is set not to be shown', () => {
                mockState.setting.showDeleteModal = false;
                const state = handle.onDelHostOrPathModal(mockState, mockPayload);

                expect(state).toEqual(mockOnDelRtnState)
                expect(handleSpy.onDelHostOrPathModalOk).toHaveBeenCalled();
            });
        });

        describe('Method - onDelHostOrPathModalOk', () => {
            const mockHostRuleIdCtx = { hostId: 'host' };
            const mockPathRuleIdCtx = { hostId: 'host', pathId: 'path' };
            const mockHost = new HostRule('host', 'host-url');

            beforeEach(() => {
                dataHandleSpy.rmvHost.mockImplementation(mockFn);
                dataHandleSpy.rmvPath.mockImplementation(mockFn);
                dataHandleSpy.getRuleIdxCtxFromIdCtx.mockResolvedValue({});

                mockState.localState.listView.ruleIdCtx = mockHostRuleIdCtx;
            });

            describe('Both List and Edit Views', () => {
                it('should close modal and save to chrome', () => {
                    const { modal } = handle.onDelHostOrPathModalOk(mockState).localState;

                    expect(modal).toEqual(resetModalState);
                    expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                });

                it('should delete host and save to chrome if path ID is not provided', () => {
                    handle.onDelHostOrPathModalOk(mockState);

                    expect(dataHandleSpy.rmvHost).toHaveBeenCalled();
                    expect(dataHandleSpy.rmvPath).not.toHaveBeenCalled();
                });

                it('should delete path and save to chrome if path ID is provided', () => {
                    mockState.localState.listView.ruleIdCtx = mockPathRuleIdCtx;
                    handle.onDelHostOrPathModalOk(mockState);

                    expect(dataHandleSpy.rmvHost).not.toHaveBeenCalled();
                    expect(dataHandleSpy.rmvPath).toHaveBeenCalled();
                });
            });

            describe('List View', () => {
                it('should update search text and reset rule ID context', () => {
                    const mockSearchText = 'sum';
                    handleSpy.getUpdatedSearchText.mockReturnValue(mockSearchText);
                    const {
                        ruleIdCtx,
                        searchText
                    } = handle.onDelHostOrPathModalOk(mockState).localState.listView;

                    expect(ruleIdCtx).toEqual(resetRuleIdCtxState);
                    expect(searchText).toEqual(mockSearchText);
                });

                it('should maintain data grid state if a path is deleted', () => {
                    mockState.localState.listView.ruleIdCtx = mockPathRuleIdCtx;
                    const { dataGrid } = handle.onDelHostOrPathModalOk(mockState).localState.listView;
                    expect(dataGrid).toEqual(mockState.localState.listView.dataGrid);
                });

                it('should reset data grid state if a host is deleted', () => {
                    const resetGridState = new DataGridState({
                        totalRecord: mockState.rules.length,
                        pgnOption: undefined
                    });
                    const mockGridState: any = {};
                    mockState.localState.listView.dataGrid = mockGridState;

                    const { dataGrid } = handle.onDelHostOrPathModalOk(mockState).localState.listView;
                    expect(dataGrid).toEqual(resetGridState);
                });
            });

            describe('Edit View', () => {
                beforeEach(() => {
                    mockState.localState.isListView = false;
                });

                it('should go back to List view if all hosts are removed', () => {
                    const { isListView } = handle.onDelHostOrPathModalOk(mockState).localState;
                    expect(isListView).toBeTruthy();
                });

                it('should set the rule ID context if hosts exist', () => {
                    const mockRuleIdCtx = {};
                    dataHandleSpy.getNextAvailRuleIdCtx.mockReturnValue(mockRuleIdCtx);
                    mockState.rules.push(mockHost);

                    const { ruleIdCtx } = handle.onDelHostOrPathModalOk(mockState).localState.editView;
                    expect(ruleIdCtx).toEqual(mockRuleIdCtx);
                });
            });
        });

        describe('Method - onDelHostsModal', () => {
            const mockPayload = {
                srcRules: [],
                sliceIdxCtx: {
                    startIdx: 0,
                    endIdx: 2
                }
            };

            beforeEach(() => {
                handleSpy.onDelHostsModalOk.mockImplementation(mockFn);
            });

            it('should open delete all hosts modal at current page', () => {
                const { listView, modal } = handle.onDelHostsModal(mockState, mockPayload).localState;

                expect(listView.dataGrid).toEqual({
                    ...mockState.localState.listView.dataGrid,
                    ...mockPayload
                });
                expect(modal.currentId).toBe(modalSet.delHosts.id);
                expect(handleSpy.onDelHostsModalOk).not.toHaveBeenCalled();
            });

            it('should proceed to delete all hosts if delete modal is set not to be shown', () => {
                mockState.setting.showDeleteModal = false;
                handle.onDelHostsModal(mockState, mockPayload);
                expect(handleSpy.onDelHostsModalOk).toHaveBeenCalled();
            });
        });

        describe('Method - onDelHostsModalOk', () => {
            const mockSearchText = 'lorem';
            const mockSliceIdxCtx = { startIdx: 0, endIdx: 2 };
            const mockSrcRules = [];

            beforeEach(() => {
                dataHandleSpy.rmvHostsFromIds.mockImplementation(mockFn);
                dataHandleSpy.rmvPartialHosts.mockImplementation(mockFn);
                handleSpy.getUpdatedSearchText.mockReturnValue(mockSearchText);

                // Mock the cache data set by `onDelHostsModal`
                Object.assign( mockState.localState.listView.dataGrid, {
                    srcRules: mockSrcRules,
                    sliceIdxCtx: mockSliceIdxCtx
                });
            });

            it('should close modal and save to Chrome', () => {
                const { listView, modal } = handle.onDelHostsModalOk(mockState).localState;
                const { searchText, dataGrid } = listView;

                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(modal).toEqual(resetModalState);
                expect(searchText).toBe(mockSearchText);
                expect(dataGrid).toEqual(new DataGridState({
                    totalRecord: mockState.rules.length,
                    pgnOption: mockState.localState.listView.dataGrid.pgnOption
                }));
            });

            it('should remove all selected hosts', () => {
                mockState.localState.listView.dataGrid.selectState.areAllRowsSelected = true;
                handle.onDelHostsModalOk(mockState);

                expect(dataHandleSpy.rmvHostsFromIds).toHaveBeenCalled();
                expect(dataHandleSpy.rmvPartialHosts).not.toHaveBeenCalled();
            });

            it('should remove partially selected hosts', () => {
                handle.onDelHostsModalOk(mockState);

                expect(dataHandleSpy.rmvHostsFromIds).not.toHaveBeenCalled();
                expect(dataHandleSpy.rmvPartialHosts).toHaveBeenCalled();
            });
        });

        describe('Method - onDelLibModal', () => {
            const mockPayload = { id: 'lorem' };

            beforeEach(() => {
                handleSpy.onDelLibModalOk.mockImplementation(mockFn);
            });

            it('should open delete library modal and set the library rule id context in edit view', () => {
                const { editView, modal } = handle.onDelLibModal(mockState, mockPayload).localState;

                expect(modal.currentId).toBe(modalSet.delLib.id);
                expect(editView.libRuleIdCtx).toEqual({
                    ...editView.ruleIdCtx,
                    libId: mockPayload.id
                });
                expect(handleSpy.onDelLibModalOk).not.toHaveBeenCalled();
            });

            it('should proceed to delete library if delete modal is set not to be shown', () => {
                mockState.setting.showDeleteModal = false;
                handle.onDelLibModal(mockState, mockPayload);
                expect(handleSpy.onDelLibModalOk).toHaveBeenCalled();
            });
        });

        describe('Method - onDelLibModalOk', () => {
            it('should remove library, close modal and save to Chrome', () => {
                dataHandleSpy.rmvLib.mockImplementation(mockFn);
                const { modal, editView } = handle.onDelLibModalOk(mockState).localState;

                expect(dataHandleSpy.rmvLib).toHaveBeenCalled();
                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(editView.libRuleIdCtx).toEqual(resetRuleIdCtxState);
                expect(modal).toEqual(resetModalState);
            });
        });

        describe('Method - onDelLibsModal', () => {
            beforeEach(() => {
                handleSpy.onDelLibsModalOk.mockImplementation(mockFn);
            });

            it('should open delete libraries modal', () => {
                const { modal } = handle.onDelLibsModal(mockState).localState;
                expect(modal.currentId).toBe(modalSet.delLibs.id);
                expect(handleSpy.onDelLibsModalOk).not.toHaveBeenCalled();
            });

            it('should proceed to delete libraries if delete modal is set not to be shown', () => {
                mockState.setting.showDeleteModal = false;
                handle.onDelLibsModal(mockState);
                expect(handleSpy.onDelLibsModalOk).toHaveBeenCalled();
            });
        });

        describe('Method - onDelLibsModalOk', () => {
            beforeEach(() => {
                dataHandleSpy.rmvAllLibs.mockImplementation(mockFn);
                dataHandleSpy.rmvPartialLibs.mockImplementation(mockFn);
            });

            it('should close modal and save to Chrome', () => {
                const { editView, modal } = handle.onDelLibsModalOk(mockState).localState;

                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(modal).toEqual(resetModalState);
                expect(editView.dataGrid).toEqual(new DataGridState());
            });

            it('should remove all selected libraries', () => {
                mockState.localState.editView.dataGrid.selectState.areAllRowsSelected = true;
                handle.onDelLibsModalOk(mockState);

                expect(dataHandleSpy.rmvAllLibs).toHaveBeenCalled();
                expect(dataHandleSpy.rmvPartialLibs).not.toHaveBeenCalled();
            });

            it('should remove partially selected libraries', () => {
                handle.onDelLibsModalOk(mockState);

                expect(dataHandleSpy.rmvAllLibs).not.toHaveBeenCalled();
                expect(dataHandleSpy.rmvPartialLibs).toHaveBeenCalled();
            });
        });

        describe('Method - onEditLibModal', () => {
            it('should open edit library modal with enabled confirmed button and set library rule id context in edit view', () => {
                dataHandleSpy.getRuleFromIdCtx.mockReturnValue({});
                const mockPayload = { id: 'lib' };
                const { editView, modal } = handle.onEditLibModal(mockState, mockPayload).localState;
                const { currentId, isConfirmBtnEnabled } = modal;

                expect(currentId).toBe(modalSet.editLib.id);
                expect(isConfirmBtnEnabled).toBeTruthy();
                expect(editView.libRuleIdCtx).toEqual({
                    ...mockState.localState.editView.ruleIdCtx,
                    libId: mockPayload.id
                });
            });
        });

        describe('Method - onEditLibModalOk', () => {
            it('should should update library title/url, clear library rule id context, close modal and save to Chrome', () => {
                dataHandleSpy.setProps.mockImplementation(mockFn);
                const { editView, modal } = handle.onEditLibModalOk(mockState).localState;

                expect(dataHandleSpy.setProps).toHaveBeenCalled();
                expect(chromeHandleSpy.saveState).toHaveBeenCalled();
                expect(editView.libRuleIdCtx).toEqual(new RuleIdCtxState());
                expect(modal).toEqual(resetModalState);
            });
        });

        describe('Method - onModalTitleInput', () => {
            it('should update title input in modal and enable state of confirm button', () => {
                const mockPayload: any = {
                    val: 'lorem',
                    isValid: true,
                    errMsg: []
                };
                const { modal } = handle.onModalTitleInput(mockState, mockPayload).localState;
                const { titleInput, isConfirmBtnEnabled } = modal;
                const { value, isValid, errMsg } = titleInput;

                expect(value).toBe(mockPayload.val);
                expect(isValid).toBe(mockPayload.isValid);
                expect(errMsg).toEqual(mockPayload.errMsg);
                expect(isConfirmBtnEnabled).toBe(mockPayload.isValid && modal.valueInput.isValid);
            });
        });

        describe('Method - onModalValueInput', () => {
            it('should update value input in modal and enable state of confirm button', () => {
                const mockPayload: any = {
                    val: 'lorem',
                    isValid: true,
                    errMsg: []
                };
                const { modal } = handle.onModalValueInput(mockState, mockPayload).localState;
                const { valueInput, isConfirmBtnEnabled } = modal;
                const { value, isValid, errMsg } = valueInput;

                expect(value).toBe(mockPayload.val);
                expect(isValid).toBe(mockPayload.isValid);
                expect(errMsg).toEqual(mockPayload.errMsg);
                expect(isConfirmBtnEnabled).toBe(mockPayload.isValid && modal.titleInput.isValid);
            });
        });
    });

    describe('Helper', () => {
        describe('Method - getUpdatedSearchText', () => {
            it('should return existing text if search text exists and records exist', () => {
                const mockText = 'lorem';
                const mockTotalRecord = 1;
                const text = handle.getUpdatedSearchText(mockText, mockTotalRecord);
                expect(text).toBe(mockText);
            });

            it('should return cleared/empty text if search text exists and records dont exist ', () => {
                const mockText = 'lorem';
                const mockTotalRecord = 0;
                const text = handle.getUpdatedSearchText(mockText, mockTotalRecord);
                expect(text).toBeFalsy();
            });

            it('should return existing text (empty) if search text doesnt exist', () => {
                const mockText = '';
                const mockTotalRecord = 1;
                const text = handle.getUpdatedSearchText(mockText, mockTotalRecord);
                expect(text).toBe(mockText);
            });
        });
    });
});
