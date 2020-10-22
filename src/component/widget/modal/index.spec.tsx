import { TestUtil } from '../../../asset/ts/test-util';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { Modal } from '.';
import { IProps } from './type';

describe('Component - Modal', () => {
    const mockBaseProps: IProps = {
        header: 'main',
        subHeader: 'sub',
        currModalId: 'lorem',
        id: 'sum',
        onHide: null
    };
    let mockProps: IProps;
    let mockOnHide: jest.Mock;

    beforeEach(() => {
        mockOnHide = jest.fn();
        mockProps = {
            ...mockBaseProps,
            onHide: mockOnHide
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
            it('should trigger onHide', () => {
                modal.componentWillUnmount();
                expect(mockOnHide).toHaveBeenCalled();
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
        let modalMethodSpy: TMethodSpy<Modal>;
        let $elem: HTMLElement;
        let $modal: HTMLElement;
        let $subHeader: HTMLElement;
        let $overlay: HTMLElement;
        let $closeBtn: HTMLElement;
        let $footer: HTMLElement;

        const syncElems = () => {
            $modal = $elem.querySelector('.modal');
            $overlay = $elem.querySelector('.modal__overlay');
            $closeBtn = $elem.querySelector('button');
            $subHeader = $elem.querySelector('h4');
            $footer = $elem.querySelector('footer');
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

        describe('triger `onHide` callback in general', () => {
            beforeEach(() => {
                modalMethodSpy = TestUtil.spyProtoMethods(Modal);
                modalMethodSpy.isVisible.mockReturnValue(true);
                TestUtil.renderPlain($elem, Modal, mockProps);
                syncElems();
            });

            it('should show header and subheader', () => {
                expect($subHeader).toBeTruthy();
            });

            it('should call `onHide` when click overlay', () => {
                TestUtil.triggerEvt($overlay, 'click');
                expect(mockOnHide).toHaveBeenCalled();
            });

            it('should call `onHide` when click close button', () => {
                TestUtil.triggerEvt($closeBtn, 'click');
                expect(mockOnHide).toHaveBeenCalled();
            });
        });

        describe('trigger `onCancel/onConfirm` callbacks for cancel/confirm buttons', () => {
            let mockOnConfirm: jest.Mock;

            beforeEach(() => {
                mockOnConfirm = jest.fn();
                modalMethodSpy = TestUtil.spyProtoMethods(Modal);
                modalMethodSpy.isVisible.mockReturnValue(true);
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

                it('should call `onHide` when click cancel button ', () => {
                    TestUtil.triggerEvt($footer.querySelectorAll('.text-btn')[0] as HTMLElement, 'click');
                    expect(mockOnHide).toHaveBeenCalled();
                });

                it('should call `onHide` when click confirm button', () => {
                    TestUtil.triggerEvt($footer.querySelectorAll('.text-btn')[1] as HTMLElement, 'click');
                    expect(mockOnConfirm).not.toHaveBeenCalled();
                    expect(mockOnHide).toHaveBeenCalled();
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
                    expect($footer.querySelectorAll('.text-btn').length).toBe(2);
                });

                it('should call `onConfirm` isntead when click confirm button', () => {
                    TestUtil.triggerEvt($footer.querySelectorAll('.text-btn')[1] as HTMLElement, 'click');
                    expect(mockOnConfirm).toHaveBeenCalled();
                    expect(mockOnHide).not.toHaveBeenCalled();
                });
            });
        });
    });
});