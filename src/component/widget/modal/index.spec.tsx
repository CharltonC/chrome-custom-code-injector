import { TestUtil } from '../../../asset/ts/test-util';
import { AMethodSpy } from '../../../asset/ts/test-util/type';
import { Modal } from '.';
import { IProps } from './type';

describe('Component - Modal', () => {
    const mockBaseProps: IProps = {
        header: 'main',
        subHeader: 'sub',
        currModalId: 'lorem',
        id: 'sum',
        onCancel: null
    };
    let mockProps: IProps;
    let mockOnCancel: jest.Mock;

    beforeEach(() => {
        mockOnCancel = jest.fn();
        mockProps = {
            ...mockBaseProps,
            onCancel: mockOnCancel
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        let modal: Modal;

        beforeEach(() => {
            modal = new Modal(mockProps);
        });

        describe('Lifecycle - componentWillUnmount', () => {
            it('should trigger onCancel', () => {
                modal.componentWillUnmount();
                expect(mockOnCancel).toHaveBeenCalled();
            });
        });

        describe('Method - isVisible: Check if current visible modal id is same as modal id', () => {
            it('should be visible when both are defined and equal', () => {
                expect(modal.isVisible('a', 'a')).toBeTruthy();
            });

            it('should not be visible when either one is undefined or not equal', () => {
                expect(modal.isVisible('', '')).toBeFalsy();
                expect(modal.isVisible('a', '')).toBeFalsy();
                expect(modal.isVisible('', 'a')).toBeFalsy();
                expect(modal.isVisible('a', '')).toBeFalsy();
            });
        });

    });

    describe('Render', () => {
        let spy: AMethodSpy<Modal>;
        let $elem: HTMLElement;
        let $modal: HTMLElement;
        let $subHeader: HTMLElement;
        let $overlay: HTMLElement;
        let $closeBtn: HTMLElement;
        let $footer: HTMLElement;
        let $btns: NodeListOf<HTMLButtonElement>;

        const syncElems = () => {
            $modal = $elem.querySelector('.modal');
            $overlay = $elem.querySelector('.modal__overlay');
            $closeBtn = $elem.querySelector('button');
            $subHeader = $elem.querySelector('h4');
            $footer = $elem.querySelector('.modal__footer');
            $btns = $elem.querySelectorAll('.text-btn');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        describe('default', () => {
            it('should not show modal', () => {
                TestUtil.renderPlain($elem, Modal, mockProps);
                syncElems();
                expect($modal).toBeFalsy();
            });
        });

        describe('confirm button type', () => {
            beforeEach(() => {
                spy = TestUtil.spyProtoMethods(Modal);
                spy.isVisible.mockReturnValue(true);
            });

            it('should have a submit confirm button', () => {
                TestUtil.renderPlain($elem, Modal, {
                    ...mockProps,
                    confirm: 'confirm'
                });
                syncElems();
                expect($footer.querySelector('button[type="submit"]')).toBeTruthy();
            });

            it('should not have a submit button confirm button', () => {
                TestUtil.renderPlain($elem, Modal, {
                    ...mockProps,
                    confirmType: 'button',
                    confirm: 'confirm'
                });
                syncElems();
                expect($footer.querySelector('button[type="submit"]')).toBeFalsy();
            });
        });

        describe('triger `onCancel` callback', () => {
            beforeEach(() => {
                spy = TestUtil.spyProtoMethods(Modal);
                spy.isVisible.mockReturnValue(true);
                TestUtil.renderPlain($elem, Modal, mockProps);
                syncElems();
            });

            it('should show header and subheader', () => {
                expect($subHeader).toBeTruthy();
            });

            it('should call `onCancel` when click overlay', () => {
                TestUtil.triggerEvt($overlay, 'click');
                expect(mockOnCancel).toHaveBeenCalled();
            });

            it('should call `onCancel` when click close button', () => {
                TestUtil.triggerEvt($closeBtn, 'click');
                expect(mockOnCancel).toHaveBeenCalled();
            });
        });

        describe('trigger `onConfirm` callback', () => {
            let mockOnConfirm: jest.Mock;

            beforeEach(() => {
                mockOnConfirm = jest.fn();
                spy = TestUtil.spyProtoMethods(Modal);
                spy.isVisible.mockReturnValue(true);
            });

            describe('callbacks not provided', () => {
                beforeEach(() => {
                    TestUtil.renderPlain($elem, Modal, {
                        ...mockProps,
                        cancel: 'cancel',
                        confirm: 'confirm',
                    });
                    syncElems();
                });

                it('should render footer with cancel/confirm buttons', () => {
                    expect($footer).toBeTruthy();
                    expect($footer.querySelectorAll('.text-btn').length).toBe(2);
                });

                it('should call `onCancel` when click cancel button ', () => {
                    TestUtil.triggerEvt($btns[0], 'click');
                    expect(mockOnCancel).toHaveBeenCalled();
                });

                it('should call `onCancel` when click confirm button', () => {
                    TestUtil.triggerEvt($btns[1], 'click');
                    expect(mockOnConfirm).not.toHaveBeenCalled();
                    expect(mockOnCancel).toHaveBeenCalled();
                });
            });

            describe('callbacks provided', () => {
                beforeEach(() => {
                    TestUtil.renderPlain($elem, Modal, {
                        ...mockProps,
                        cancel: 'cancel',
                        confirm: 'confirm',
                        onConfirm: mockOnConfirm
                    });
                    syncElems();
                });

                it('should render footer with cancel/confirm buttons', () => {
                    expect($footer).toBeTruthy();
                    expect($btns.length).toBe(2);
                });

                it('should call `onConfirm` isntead when click confirm button', () => {
                    TestUtil.triggerEvt($btns[1], 'click');
                    expect(mockOnConfirm).toHaveBeenCalled();
                    expect(mockOnCancel).not.toHaveBeenCalled();
                });
            });

            describe('pass disabled state to confirm button', () => {
                it('should pass disabled state', () => {
                    TestUtil.renderPlain($elem, Modal, {
                        ...mockProps,
                        confirm: 'confirm',
                        confirmDisabled: true
                    });
                    syncElems();
                    expect(($btns[0]).disabled).toBeTruthy();
                });
            });
        });
    });
});