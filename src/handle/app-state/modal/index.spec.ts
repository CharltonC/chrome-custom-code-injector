import { FileHandle } from "../../file";
import { ChromeHandle } from "../../chrome";
import { modalSet } from "../../../constant/modal-set";
import { AppState } from "../../../model/app-state";
import { SettingState } from "../../../model/setting-state";
import { LocalState } from "../../../model/local-state";
import { ModalState } from "../../../model/modal-state";
import { TestUtil } from "../../../asset/ts/test-util";
import { AMethodSpy } from "../../../asset/ts/test-util/type";
import { ModalStateHandle } from ".";

const handle = new ModalStateHandle();

describe('Modal State Handle', () => {
    const mockRecordTotal = 5;
    const mockFn = () => {};
    let mockState: AppState;
    let fileHandleSpy: AMethodSpy<FileHandle>;
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;
    let handleSpy: AMethodSpy<ModalStateHandle>

    beforeEach(() => {
        fileHandleSpy = TestUtil.spyProtoMethods(FileHandle);
        chromeHandleSpy = TestUtil.spyProtoMethods(ChromeHandle);
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
                    modal: new ModalState()
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
});
