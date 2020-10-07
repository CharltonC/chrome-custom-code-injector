import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { DomHandle } from '../../../service/handle/dom';
import { Modal, BODY_CLS } from './';

describe('Component - Modal', () => {
    let modal: Modal;
    let modalMethodSpy: TMethodSpy<Modal>;
    let domHandleMethodSpy: TMethodSpy<DomHandle>;
    let setStateSpy: jest.SpyInstance;
    const enableModal = () => (modal.state as any).isOpen = true;

    beforeEach(() => {
        modal = new Modal({headerText: 'title'});
        modalMethodSpy = TestUtil.spyMethods(modal);
        domHandleMethodSpy = TestUtil.spyMethods(modal.domHandle);
        setStateSpy = jest.spyOn(modal, 'setState');
        setStateSpy.mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Render', () => {
        it('constructor', () => {
            expect(modal.state.isOpen).toBe(false);
        });

        // TODO: render method
    });

    describe('Lifecycle - componentWillUnmount', () => {
        beforeEach(() => {
            modalMethodSpy.onClose.mockImplementation(() => {});
        });

        it('should not close modal if it is not open', () => {
            modal.componentWillUnmount();
            expect(modalMethodSpy.onClose).not.toHaveBeenCalled();
        });

        it('should not close modal if it is not open', () => {
            enableModal();
            modal.componentWillUnmount();
            expect(modalMethodSpy.onClose).toHaveBeenCalled();
        });
    });

    describe('Method - onOpen: open modal', () => {
        it('should not open modal if it is already open', () => {
            enableModal();
            modal.onOpen();
            expect(setStateSpy).not.toHaveBeenCalled();
        });

        it('should open modal if it is closed', () => {
            modal.onOpen();
            expect(setStateSpy).toHaveBeenCalledWith({isOpen: true}, modal.addEvt);
        });
    });

    describe('Method - onClose: close modal', () => {
        it('should not close modal if it is already closed', () => {
            modal.onClose();
            expect(setStateSpy).not.toHaveBeenCalled();
        });

        it('should close modal if it is open', () => {
            enableModal();
            modal.onClose();
            expect(setStateSpy).toHaveBeenCalledWith({isOpen: false}, modal.rmvEvt);
        });
    });

    describe('Method - onKeyup: check keyboard event and close modal', () => {
        beforeEach(() => {
            modalMethodSpy.onClose.mockImplementation(() => {});
        });

        it('should not close modal if it is not ESC key', () => {
            modal.onKeyup({ which: 10 } as KeyboardEvent);
            expect(modalMethodSpy.onClose).not.toHaveBeenCalled();
        });

        it('should close modal if it is ESC key', () => {
            modal.onKeyup({ which: 27 } as KeyboardEvent);
            expect(modalMethodSpy.onClose).toHaveBeenCalled();
        });
    });

    describe('Method - addEvt/rmvEvt: setup/remove global Keyboard event', () => {
        const mockEvtConfig = {};

        beforeEach(() => {
            const mockFn = () => {};
            domHandleMethodSpy.addGlobalEvt.mockImplementation(mockFn);
            domHandleMethodSpy.addBodyCls.mockImplementation(mockFn);
            modalMethodSpy.getEvtConfig.mockReturnValue(mockEvtConfig);
        });

        it('should setup', () => {
            modal.addEvt();
            expect(domHandleMethodSpy.addGlobalEvt).toHaveBeenCalledWith(mockEvtConfig);
            expect(domHandleMethodSpy.addBodyCls).toHaveBeenCalledWith(BODY_CLS);
            expect(typeof modal.keyupHandler).toBe('function');
        });

        it('should remove', () => {
            modal.rmvEvt();
            expect(domHandleMethodSpy.addGlobalEvt).toHaveBeenCalledWith(mockEvtConfig, false);
            expect(domHandleMethodSpy.addBodyCls).toHaveBeenCalledWith(BODY_CLS, false);
            expect(modal.keyupHandler).toBeFalsy();
        });
    });

    describe('Method - getEvtConfig: get event config', () => {
        it('should return config', () => {
            const config = modal.getEvtConfig();
            expect(config).toEqual({
                targetType: 'doc',
                evtType: 'keyup',
                handler: undefined
            });
        });
    });
});