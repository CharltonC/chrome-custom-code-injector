import { TestUtil } from '../../../asset/ts/test-util';
import { ChromeHandle } from '../../chrome';
import { QueryParamHandle } from '../../query-param';
import { DataHandle } from '../../data';
import { AMethodSpy } from '../../../asset/ts/test-util/type';
import { PopupViewStateHandle } from '.';

describe('Popup View State Handle', () => {
    const handle = new PopupViewStateHandle();
    const mockState: any = {};
    const mockParam = '';
    const mockFn = () => {};
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;
    let queryParamHandleSpy: AMethodSpy<QueryParamHandle>;
    let dataHandleSpy: AMethodSpy<DataHandle>;

    beforeEach(() => {
        chromeHandleSpy = TestUtil.spyProtoMethods(ChromeHandle);
        queryParamHandleSpy = TestUtil.spyProtoMethods(QueryParamHandle);
        dataHandleSpy = TestUtil.spyProtoMethods(DataHandle);

        dataHandleSpy.rmvPath.mockImplementation(mockFn);
        dataHandleSpy.rmvHost.mockImplementation(mockFn);
        chromeHandleSpy.openExtOption.mockImplementation(mockFn);
        chromeHandleSpy.saveState.mockImplementation(mockFn);
        queryParamHandleSpy.createEditParam.mockReturnValue(mockParam);
        queryParamHandleSpy.createAddHostParam.mockReturnValue(mockParam);
        queryParamHandleSpy.createAddPathParam.mockReturnValue(mockParam);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Method - onOpenExtOption: should open a new option tab', () => {
        const state = handle.onOpenExtOption();

        expect(state).toBeFalsy();
        expect(chromeHandleSpy.openExtOption).toHaveBeenCalled();
    });

    it('Method - onOpenExtOptionForEdit: should open a new option tab in edit view', () => {
        const mockPayload: any = {};
        const state = handle.onOpenExtOptionForEdit(mockState, mockPayload);

        expect(state).toBeFalsy();
        expect(queryParamHandleSpy.createEditParam).toHaveBeenCalledWith(mockPayload);
        expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(mockParam);
    });

    it('Method - onOpenExtOptionForAddHost: should open a new option tab in list view with Add Host modal', () => {
        const mockPayload = { hostUrl: 'host' };
        const state = handle.onOpenExtOptionForAddHost(mockState, mockPayload);

        expect(state).toBeFalsy();
        expect(queryParamHandleSpy.createAddHostParam).toHaveBeenCalledWith(mockPayload.hostUrl);
        expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(mockParam);
    });

    it('Method - onOpenExtOptionForAddPath: should open a new option tab in list view with Add Path modal', () => {
        const mockHostId = 'host';
        const mockPath = 'path';
        const mockPayload = { hostId: mockHostId, path: mockPath };
        const state = handle.onOpenExtOptionForAddPath(mockState, mockPayload);

        expect(state).toBeFalsy();
        expect(queryParamHandleSpy.createAddPathParam).toHaveBeenCalledWith(mockHostId, mockPath);
        expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(mockParam);
    });

    it('Method - onOpenExtUserguide: should open a new tab for the extension user guide', () => {
        chromeHandleSpy.openUserguide.mockImplementation(mockFn);
        const state = handle.onOpenExtUserguide();

        expect(state).toBeFalsy();
        expect(chromeHandleSpy.openUserguide).toHaveBeenCalled();
    });

    it('Method - onDelHostOrPath: should delete host or path rule and save to Chrome', () => {
        const mockAppState: any = { rules: [] };
        const mockPayload = { hostId: 'host' };

        expect(
            handle.onDelHostOrPath(mockAppState, mockPayload)
        ).toEqual({ rules: mockAppState.rules });
        expect(dataHandleSpy.rmvHost).toHaveBeenCalled();

        expect(
            handle.onDelHostOrPath(mockAppState, {
                ...mockPayload,
                pathId: 'path'
            })
        ).toEqual({ rules: mockAppState.rules });
        expect(dataHandleSpy.rmvPath).toHaveBeenCalled();

        expect(chromeHandleSpy.saveState).toHaveBeenCalledTimes(2);
    });
});
