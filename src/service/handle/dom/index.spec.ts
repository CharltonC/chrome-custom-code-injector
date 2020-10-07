import { DomHandle } from './';
describe('Dom Handle', () => {
    let handle: DomHandle;

    beforeEach(() => {
        handle = new DomHandle();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - addGlobalEvt: Add/Remove Global Event', () => {
        const mockEvtType = 'click';
        const mockHandler = () => {};
        const mockBaseEvtConfig = {
            targetType: 'win',
            evtType: mockEvtType,
            handler: mockHandler
        };
        let addEvtSpy: jest.SpyInstance;
        let rmvEvtSpy: jest.SpyInstance;

        beforeEach(() => {
            addEvtSpy = jest.spyOn(window, 'addEventListener');
            rmvEvtSpy = jest.spyOn(window, 'removeEventListener');
        });

        it('should add global event', () => {
            handle.addGlobalEvt(mockBaseEvtConfig);
            expect(addEvtSpy).toHaveBeenCalledWith(mockEvtType, mockHandler);
            expect(rmvEvtSpy).not.toHaveBeenCalled();
        });

        it('should remove global event', () => {
            handle.addGlobalEvt(mockBaseEvtConfig, false);
            expect(rmvEvtSpy).toHaveBeenCalledWith(mockEvtType, mockHandler);
            expect(addEvtSpy).not.toHaveBeenCalled();
        });

        it('should not add or remove if target type is not valid', () => {
            jest.spyOn(handle, 'getGlobalTarget').mockReturnValue(null);
            handle.addGlobalEvt(mockBaseEvtConfig);
            expect(addEvtSpy).not.toHaveBeenCalled();
            expect(rmvEvtSpy).not.toHaveBeenCalled();
        });
    });

    describe('Method - addBodyCls: Add/Remove class name to/from existing Body Class', () => {
        const { body } = document;
        const mockClsName = 'lorem';

        it('should add or remove class name', () => {
            const existingBodyCls = body.className;

            handle.addBodyCls(mockClsName);
            expect(body.className).toContain(mockClsName);

            handle.addBodyCls(mockClsName, false);
            expect(body.className).toBe(existingBodyCls);
        });
    });

    describe('Method - getGlobalTarget: Get target dom element (global) for event use', () => {
        const { getGlobalTarget } = DomHandle.prototype;

        it('should return the matching dom element', () => {
            expect(getGlobalTarget('win')).toBe(window);
            expect(getGlobalTarget('doc')).toBe(document);
            expect(getGlobalTarget('body')).toBe(document.body);
            expect(getGlobalTarget('lorem')).toBeFalsy();
        });
    });
});