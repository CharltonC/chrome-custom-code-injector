import { TestUtil } from '../../../test-util/';
import { _Search, Search } from './';

describe('Component - Search', () => {
    let elem: HTMLElement;
    let labelElem: Element;
    let inputElem: HTMLInputElement;
    let searchIconElem: HTMLElement;
    let clearIconBtnElem: HTMLButtonElement;
    let mockProps: Record<string, string | jest.Mock>;

    let mockOnChange: jest.Mock;
    let mockOnClear: jest.Mock;
    const mockId: string = 'lorem';
    const mockText: string = 'some text';

    const helper = {
        assignChildrenElem() {
            labelElem = elem.querySelector('label');
            inputElem = elem.querySelector('input');
            searchIconElem = elem.querySelector('.icon--search');
            clearIconBtnElem = elem.querySelector('button');
        },

        triggerInputChange() {
            TestUtil.setInputVal(inputElem, mockText);
            TestUtil.triggerEvt(inputElem, 'change');
            this.assignChildrenElem();
        },

        triggerClearBtnClick() {
            TestUtil.triggerEvt(clearIconBtnElem, 'click');
            TestUtil.triggerEvt(inputElem, 'change');
            this.assignChildrenElem();
        },
    };

    beforeEach(() => {
        mockOnChange = jest.fn();
        mockOnClear = jest.fn();
        elem = TestUtil.setupElem();
        mockProps = {id: mockId, onChange: mockOnChange, onClear: mockOnClear};
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
        jest.clearAllMocks();
    });

    describe('props: id', () => {
        it('should reflect id state in label, input', () => {
            TestUtil.renderPlain(elem, Search, {...mockProps});
            helper.assignChildrenElem();

            expect(labelElem.getAttribute('for')).toBe(mockId);
            expect(inputElem.id).toBe(mockId);
        });
    });

    describe('props: text', () => {
        describe('when input value is not provided', () => {
            it('should reflect internal state input, search icon, clear button', () => {
                TestUtil.renderPlain(elem, Search, {...mockProps});
                helper.assignChildrenElem();

                // initial
                expect(inputElem.value).toBe('');
                expect(searchIconElem).toBeTruthy();
                expect(clearIconBtnElem).toBeFalsy();

                // input change: input value is auto set to target value when there is not dependent on external text
                helper.triggerInputChange();
                expect(inputElem.value).toBe(mockText);

                // input clear: input value ia auto set to empty when there is not dependent on external text
                helper.triggerClearBtnClick();
                expect(inputElem.value).toBe('');
            });
        });

        describe('when input value is provided', () => {
            it('should reflect text state in input, search icon, clear button when value is empty', () => {
                TestUtil.renderPlain(elem, Search, {...mockProps, text: ''});
                helper.assignChildrenElem();

                // initial
                expect(inputElem.value).toBe('');
                expect(searchIconElem).toBeTruthy();
                expect(clearIconBtnElem).toBeFalsy();

                // input change: input value will only be set when external text is set to the target value
                helper.triggerInputChange();
                expect(inputElem.value).toBe('');
            });

            it('should reflect text state in input, search icon, clear button when value is not empty', () => {
                TestUtil.renderPlain(elem, Search, {...mockProps, text: mockText});
                helper.assignChildrenElem();

                // initial
                expect(inputElem.value).toBe(mockText);
                expect(searchIconElem).toBeFalsy();
                expect(clearIconBtnElem).toBeTruthy();

                // input clear: nput value will only be empty when external text is set to empty
                helper.triggerClearBtnClick();
                expect(inputElem.value).toBe(mockText);
            });
        });
    });

    describe('props: disabled', () => {
        it('should reflect non-disabled state in form elements when value is empty or when value is not passed', () => {
            TestUtil.renderPlain(elem, Search, {...mockProps, text: ''});
            helper.assignChildrenElem();

            expect(labelElem.className).not.toContain('search--disabled');
            expect(inputElem.disabled).toBe(false);
        });

        it('should reflect disabled state in form elements when value is not empty ', () => {
            TestUtil.renderPlain(elem, Search, {...mockProps, disabled: true, text: mockText});
            helper.assignChildrenElem();

            expect(labelElem.className).toContain('search--disabled');
            expect(inputElem.disabled).toBe(true);
            expect(clearIconBtnElem.disabled).toBe(true);
        });
    });

    describe('props: callbacks', () => {
        let spySetState: jest.SpyInstance;
        let spyInputFocus: jest.SpyInstance

        describe('when callbacks `onChage`, `onClear` are provided', () => {
            beforeEach(() => {
                spySetState = jest.spyOn(_Search.prototype, 'setState');
                TestUtil.renderPlain(elem, Search, {...mockProps});
                helper.assignChildrenElem();
                helper.triggerInputChange();
            });

            it('should handle the input change', () => {
                const mockOnChangeArgs: any[] = mockOnChange.mock.calls[0];
                expect(mockOnChange).toHaveBeenCalled();
                expect(mockOnChangeArgs[1]).toBe(mockText);
                expect(mockOnChangeArgs[2]).toBe(true);
                expect(spySetState).toHaveBeenCalledWith({hsText: true});
            });

            it('should handle the clear input button click', () => {
                // Only spy input element after it's assigned & exists
                spyInputFocus = jest.spyOn(inputElem, 'focus');
                helper.triggerClearBtnClick();

                expect(mockOnClear).toHaveBeenCalled();
                expect(spySetState).toHaveBeenCalledWith({hsText: false});
                expect(spyInputFocus).toHaveBeenCalled();
            });
        });

        describe('when callbacks `onChage`, `onClear` are not provided', () => {
            beforeEach(() => {
                spySetState = jest.spyOn(_Search.prototype, 'setState');
                TestUtil.renderPlain(elem, Search, {...mockProps, onChange: null, onClear: null});
                helper.assignChildrenElem();
                helper.triggerInputChange();
            });

            it('should handle the input change', () => {
                expect(mockOnChange).not.toHaveBeenCalled();
                expect(spySetState).toHaveBeenCalledWith({hsText: true});
            });

            it('should handle the clear input button click', () => {
                // Only spy input element after it's assigned & exists
                spyInputFocus = jest.spyOn(inputElem, 'focus');
                helper.triggerClearBtnClick();

                expect(mockOnClear).not.toHaveBeenCalled();
                expect(spySetState).toHaveBeenCalledWith({hsText: false});
                expect(spyInputFocus).toHaveBeenCalled();
            });
        });
    });
});

