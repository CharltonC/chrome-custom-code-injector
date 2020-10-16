import { TestUtil } from '../../../asset/ts/test-util';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { Modal } from '.';
import { IProps } from './type';

describe('Component - Modal', () => {
    const mockBaseProps: IProps = {
        headers: [ 'main', 'sub' ],
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
                expect(mockOnHide).toHaveBeenCalledWith({type: 'click'});
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

        const syncElems = () => {
            $modal = $elem.querySelector('.modal');
            $overlay = $elem.querySelector('.modal__overlay');
            $closeBtn = $elem.querySelector('button');
            $subHeader = $elem.querySelector('h4');
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

        describe('hide shown modal', () => {
            beforeEach(() => {
                modalMethodSpy = TestUtil.spyProtoMethods(Modal);
                modalMethodSpy.isVisible.mockReturnValue(true);
                TestUtil.renderPlain($elem, Modal, mockProps);
                syncElems();
            });

            it('should show header & subheader', () => {
                expect($subHeader).toBeTruthy();
            });

            it('should hide the modal when click overlay', () => {
                TestUtil.triggerEvt($overlay, 'click');
                expect(mockOnHide).toHaveBeenCalled();
            });

            it('should hide the modal when click close button', () => {
                TestUtil.triggerEvt($closeBtn, 'click');
                expect(mockOnHide).toHaveBeenCalled();
            });
        });
    });
});