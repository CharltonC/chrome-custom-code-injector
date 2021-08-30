import { ChromeHandle } from '../../chrome';
import { PopupViewStateHandle } from '.';
import { TestUtil } from '../../../asset/ts/test-util';
import { AMethodSpy } from '../../../asset/ts/test-util/type';

describe('Popup View State Handle', () => {
    const handle = new PopupViewStateHandle();
    const mockState: any = {};
    const mockFn = () => {};
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;

    beforeEach(() => {
        chromeHandleSpy = TestUtil.spyProtoMethods(ChromeHandle);
        chromeHandleSpy.openExtOptionTab.mockImplementation(mockFn);
        chromeHandleSpy.openUserguideTab.mockImplementation(mockFn);
    });

    it('Method - onOpenExtOption: should open a new option tab', () => {
        const stateOne = handle.onOpenExtOption(mockState);
        expect(stateOne).toEqual({});
        expect(chromeHandleSpy.openExtOptionTab).toHaveBeenCalledWith(undefined);

        const mockPaylod = { hostId: 'id' };
        const stateTwo = handle.onOpenExtOption(mockState, mockPaylod);
        expect(stateTwo).toEqual({});
        expect(chromeHandleSpy.openExtOptionTab).toHaveBeenCalledWith(mockPaylod);
    });

    it('Method - onOpenExtUserguide: should open a new tab for the extension user guide', () => {
        const state = handle.onOpenExtUserguide();
        expect(state).toEqual({});
        expect(chromeHandleSpy.openUserguideTab).toHaveBeenCalled();
    });
});
