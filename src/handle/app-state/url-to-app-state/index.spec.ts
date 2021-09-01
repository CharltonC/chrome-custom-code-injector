import { TestUtil } from '../../../asset/ts/test-util';
import { AMethodSpy } from '../../../asset/ts/test-util/type';
import { DataHandle } from '../../data';
import { OptionListViewStateHandle } from '../option-list-view';
import { ModalStateHandle } from '../modal';
import { EQueryParam, EPrefillAction } from '../../query-param/type';
import { urlToAppStateHandle as handle, UrlToAppStateHandle } from '.';
import { TextInputState } from '../../../model/text-input-state';

describe('App State Prefill Handle', () => {
    const { EDIT, ADD_HOST, ADD_PATH } = EPrefillAction;
    const { HOST_ID, HOST_URL, PATH } = EQueryParam;

    const mockAppState: any = { a: 'b' };
    const mockBaseUrl = 'http://abc.com';

    let spy: AMethodSpy<UrlToAppStateHandle>;
    let dataHandleSpy: AMethodSpy<DataHandle>;
    let optionListViewStateHandleSpy: AMethodSpy<OptionListViewStateHandle>;
    let modalStateHandleSpy: AMethodSpy<ModalStateHandle>;

    beforeEach(() => {
        spy = TestUtil.spyMethods(handle);
        dataHandleSpy = TestUtil.spyMethods(handle.dataHandle);
        optionListViewStateHandleSpy = TestUtil.spyMethods(handle.optionListViewStateHandle);
        modalStateHandleSpy = TestUtil.spyMethods(handle.modalStateHandle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - getState', () => {
        const mockBaseUrl = 'http://abc.com';

        it('should return empty state when a url error is encountered', () => {
            const mockInvalidUrl = '';

            const state = handle.getState(mockAppState, mockInvalidUrl);
            expect(state).toEqual({});
        });

        it('should return empty state when action param value is missing', () => {
            const state = handle.getState(mockAppState, mockBaseUrl);
            expect(state).toEqual({});
        });

        it('should return empty state when action param value is unknown', () => {
            const mockUrl = `${mockBaseUrl}?action=loremsum`

            const state = handle.getState(mockAppState, mockUrl);
            expect(state).toEqual({});
        });

        it('should return state when action param value is `edit`', () => {
            const mockUrl = `${mockBaseUrl}?action=${EDIT}`;
            const mockRtnState: any = { action: 'edit' };
            spy.onOptionEdit.mockReturnValue(mockRtnState);

            const state = handle.getState(mockAppState, mockUrl);
            expect(state).toEqual(mockRtnState);
            expect(spy.onOptionEdit).toHaveBeenCalled();
        });

        it('should return state when action param value is `add-host`', () => {
            const mockUrl = `${mockBaseUrl}?action=${ADD_HOST}`;
            const mockRtnState: any = { action: 'add-host' };
            spy.onOptionListAddHost.mockReturnValue(mockRtnState);

            const state = handle.getState(mockAppState, mockUrl);
            expect(state).toEqual(mockRtnState);
            expect(spy.onOptionListAddHost).toHaveBeenCalled();
        });

        it('should return state when action param value is `add-path`', () => {
            const mockUrl = `${mockBaseUrl}?action=${ADD_PATH}`;
            const mockRtnState: any = { action: 'add-path' };
            spy.onOptionListAddPath.mockReturnValue(mockRtnState);

            const state = handle.getState(mockAppState, mockUrl);
            expect(state).toEqual(mockRtnState);
            expect(spy.onOptionListAddPath).toHaveBeenCalled();
        });
    });

    describe('Method - onOptionEdit', () => {
        it('should return empty state when host id is not provided', () => {
            const mockParams = new URL(mockBaseUrl).searchParams;

            const state = handle.onOptionEdit(mockAppState, mockParams);
            expect(state).toEqual({});
            expect(dataHandleSpy.getRuleFromIdCtx).not.toHaveBeenCalled();
            expect(optionListViewStateHandleSpy.onEditView).not.toHaveBeenCalled();
        });

        it('should return empty state when rule is not provided based on host id with optional path id', () => {
            const mockParams = new URL(`${mockBaseUrl}?${HOST_ID}=lorem`).searchParams;
            dataHandleSpy.getRuleFromIdCtx.mockReturnValue(false);

            const state = handle.onOptionEdit(mockAppState, mockParams);
            expect(state).toEqual({});
        });

        it('should return state when rule is provided', () => {
            const mockParams = new URL(`${mockBaseUrl}?${HOST_ID}=lorem`).searchParams;
            const mockRtnState = {lorem: 'sum'};
            dataHandleSpy.getRuleFromIdCtx.mockReturnValue(true);
            optionListViewStateHandleSpy.onEditView.mockReturnValue(mockRtnState);

            const state = handle.onOptionEdit(mockAppState, mockParams);
            expect(state).toEqual(mockRtnState);
        });
    });

    describe('Method - onOptionListAddHost', () => {
        it('should return empty state when host url is not provided', () => {
            const mockParams = new URL(mockBaseUrl).searchParams;

            const state = handle.onOptionListAddHost(mockAppState, mockParams);
            expect(state).toEqual({});
            expect(modalStateHandleSpy.onAddHostModal).not.toHaveBeenCalled();
        });

        it('should return state when host url is provided', () => {
            const mockHostUrl = 'lorem';
            const mockParams = new URL(`${mockBaseUrl}?${HOST_URL}=${mockHostUrl}`).searchParams;
            const mockRtnState = {
                localState: {
                    modal: {}
                }
            };
            modalStateHandleSpy.onAddHostModal.mockReturnValue(mockRtnState);

            const state = handle.onOptionListAddHost(mockAppState, mockParams);
            expect(state).toEqual({
                localState: {
                    modal: {
                        valueInput: new TextInputState({ value: mockHostUrl })
                    }
                }
            });
        });
    });

    describe('Method - onOptionListAddPath', () => {
        it('should return empty state when either host id or path is not provided', () => {
            expect(handle.onOptionListAddPath(
                mockAppState,
                new URL(mockBaseUrl).searchParams
            )).toEqual({});

            expect(handle.onOptionListAddPath(
                mockAppState,
                new URL(`${mockBaseUrl}?${HOST_ID}=lorem`).searchParams
            )).toEqual({});

            expect(handle.onOptionListAddPath(
                mockAppState,
                new URL(`${mockBaseUrl}?${PATH}=lorem`).searchParams
            )).toEqual({});

            expect(modalStateHandleSpy.onAddPathModal).not.toHaveBeenCalled();
        });

        it('should return state when host id and path are provided', () => {
            const mockHostId = 'host';
            const mockPath = '/path';
            const mockParams = new URL(`${mockBaseUrl}?${HOST_ID}=${mockHostId}&${PATH}=${mockPath}`).searchParams;
            const mockRtnState = {
                localState: {
                    modal: {}
                }
            };
            modalStateHandleSpy.onAddPathModal.mockReturnValue(mockRtnState);

            const state = handle.onOptionListAddPath(mockAppState, mockParams);
            expect(state).toEqual({
                localState: {
                    modal: {
                        valueInput: new TextInputState({ value: mockPath })
                    }
                }
            });
        });
    });
});
