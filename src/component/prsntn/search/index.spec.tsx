import { TestUtil } from '../../../test-util/';
import { Search } from './';

describe('Component - Search', () => {
    let elem: HTMLElement;
    let labelElem: Element;
    let inputElem: HTMLInputElement;
    let searchIconElem: HTMLElement;
    let clearIconBtnElem: HTMLButtonElement;
    let defProps: Record<string, string | jest.Mock>;

    let mockOnChange: jest.Mock;
    let mockOnClear: jest.Mock;
    const mockId: string = 'lorem';
    const mockText: string = 'some text';

    function assignChildrenElem(elem: HTMLElement) {
        labelElem = elem.querySelector('label');
        inputElem = elem.querySelector('input');
        searchIconElem = elem.querySelector('.icon--search');
        clearIconBtnElem = elem.querySelector('button');
    }

    beforeEach(() => {
        mockOnChange = jest.fn();
        mockOnClear = jest.fn();
        elem = TestUtil.setupElem();
        defProps = {id: mockId, text: mockText, onChange: mockOnChange, onClear: mockOnClear};
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
        jest.clearAllMocks();
    });

    describe('props: id', () => {
        it('should reflect id state in label, input', () => {
            TestUtil.renderPlain(elem, Search, {...defProps});
            assignChildrenElem(elem);

            expect(labelElem.getAttribute('for')).toBe(mockId);
            expect(inputElem.id).toBe(mockId);
        });
    });

    describe('props: text', () => {
        it('should reflect text state in input, search icon, clear button when input value is empty', () => {
            TestUtil.renderPlain(elem, Search, {...defProps, text: ''});
            assignChildrenElem(elem);

            expect(inputElem.value).toBe('');
            expect(searchIconElem).toBeTruthy();
            expect(clearIconBtnElem).toBeFalsy();
        });

        it('should reflect text state in input, search icon, clear button when input value is not empty', () => {
            TestUtil.renderPlain(elem, Search, {...defProps});
            assignChildrenElem(elem);

            expect(inputElem.value).toBe(mockText);
            expect(searchIconElem).toBeFalsy();
            expect(clearIconBtnElem).toBeTruthy();
        });
    });

    describe('props: disabled', () => {
        it('should reflect non-disabled state in label, input, button', () => {
            TestUtil.renderPlain(elem, Search, {...defProps});
            assignChildrenElem(elem);

            expect(labelElem.className).not.toContain('search--disabled');
            expect(inputElem.disabled).toBe(false);
            expect(clearIconBtnElem.disabled).toBe(false);
        });

        it('should reflect disabled state in label, input, button', () => {
            TestUtil.renderPlain(elem, Search, {...defProps, disabled: true});
            assignChildrenElem(elem);

            expect(labelElem.className).toContain('search--disabled');
            expect(inputElem.disabled).toBe(true);
            expect(clearIconBtnElem.disabled).toBe(true);
        });
    });

    describe('props: callbacks', () => {
        it('should trigger `onChange` callbacks when input value is updated from empty string', () => {
            TestUtil.renderPlain(elem, Search, {...defProps, text: '', });
            assignChildrenElem(elem);
            TestUtil.setInputVal(inputElem, mockText);
            TestUtil.triggerEvt(inputElem, 'change');

            expect(mockOnChange).toHaveBeenCalledTimes(1);
        });

        it('should trigger `onClear` callback when clear button is clicked (i.e. input value is cleared from non-empty string)', () => {
            TestUtil.renderPlain(elem, Search, {...defProps});
            assignChildrenElem(elem);
            TestUtil.triggerEvt(clearIconBtnElem, 'click');
            TestUtil.triggerEvt(inputElem, 'change');

            expect(mockOnClear).toHaveBeenCalledTimes(1);
        });
    });
});

