import React, { useState } from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";

import { TestUtil } from '../../../test-util/';
import { Search } from './';

// // Usage:
// // - must be `useState: jest.fn()` instead of `useState: <var>`
// // - must be place outside of top `describe` prior to React is run
// // - this doesnt work: `jest.spyOn(React, 'useState').mockImplementation(() => []);`
// // - Ref: https://dev.to/ppciesiolkiewicz/comment/i708
const originalUseState = jest.requireActual('react').useState;
const mockUseState = useState as jest.Mock;
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

describe('Component - Search', () => {
    let elem: HTMLElement;
    let labelElem: Element;
    let inputElem: HTMLInputElement;
    let searchIconElem: HTMLElement;
    let clearIconBtnElem: HTMLButtonElement;

    let mockSetState: jest.Mock;
    let mockOnChange: jest.Mock;
    let mockOnClear: jest.Mock;

    const mockId: string = 'lorem';
    const mockInputText: string = 'some text';

    function assignChildrenElem(elem: HTMLElement) {
        labelElem = elem.querySelector('label');
        inputElem = elem.querySelector('input');
        searchIconElem = elem.querySelector('.icon--search');
        clearIconBtnElem = elem.querySelector('button');
    }

    beforeEach(() => {
        mockSetState = jest.fn();
        mockOnChange = jest.fn();
        mockOnClear = jest.fn();
        elem = TestUtil.setupElem();
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
        jest.clearAllMocks();
    });

    describe('props: disabled, non-empty text', () => {
        it('should reflect disabled state in label, input, button', () => {
            TestUtil.renderPlain(elem, Search, {id: '', text: 'lorem', disabled: true});
            assignChildrenElem(elem);
            expect(labelElem.className).toContain('search--disabled');
            expect(inputElem.disabled).toBe(true);
            expect(clearIconBtnElem.disabled).toBe(true);
        });
    });

    describe('non-empty input text with no callbacks', () => {
        beforeEach(() => {
            act(() => {
                render(<Search id={mockId} text={'some'}/>, elem);
            });
            assignChildrenElem(elem);
        });

        it('should not trigger any callbacks when input value is updated or cleared', () => {
            act(() => {
                TestUtil.setInputVal(inputElem, mockInputText);
                TestUtil.triggerEvt(inputElem, 'change');
                TestUtil.triggerEvt(clearIconBtnElem, 'click');
            });
            assignChildrenElem(elem);

            expect(mockOnChange).toHaveBeenCalledTimes(0);
            expect(mockOnClear).toHaveBeenCalledTimes(0);
        });
    });

    describe('non-empty input text with callbacks', () => {
        beforeEach(() => {
            TestUtil.renderInStatefulWrapper(elem, Search, {
                id: mockId,
                text: mockInputText,
                onChange: mockOnChange,
                onClear: mockOnClear
            });
            assignChildrenElem(elem);
        });

        it("should render", () => {
            expect(inputElem.value).toBe(mockInputText);
            expect(searchIconElem).toBeFalsy();
            expect(clearIconBtnElem).toBeTruthy();
        });

        it("should trigger `onClear` callback when input value is cleared", () => {
            // Clear the text
            act(() => {
                clearIconBtnElem.dispatchEvent(new Event('click', {bubbles: true}));
                inputElem.dispatchEvent(new Event('change', { bubbles: true}));
            });
            assignChildrenElem(elem);

            const mockOnClearArgs: any[] = mockOnClear.mock.calls[0];
            expect(mockOnClear).toHaveBeenCalledTimes(1);
            expect(mockOnClearArgs.length).toBe(1);
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockSetState).not.toHaveBeenCalled();
        });
    });

    describe('empty input text with callbacks', () => {
        beforeEach(() => {

        });

        it('should render', () => {
            mockUseState.mockImplementation(() => ['', mockSetState]);
            act(() => {
                render(<Search
                    id={mockId}
                    onChange={mockOnChange}
                    onClear={mockOnClear}
                    />, elem);
            });
            assignChildrenElem(elem);

            expect(mockUseState).toHaveBeenCalledTimes(1);
            expect(labelElem.getAttribute('for')).toBe(mockId);
            expect(labelElem.className).not.toContain('search--disabled');
            expect(inputElem.value).toBe('');
            expect(inputElem.disabled).toBe(false);
            expect(searchIconElem).toBeTruthy();
            expect(clearIconBtnElem).toBeFalsy();
        });

        it('should tirgger `onChange` callback when input value is updated', () => {
            mockUseState.mockImplementation(() => ['', mockSetState]);
            act(() => {
                render(<Search
                    id={mockId}
                    onChange={mockOnChange}
                    onClear={mockOnClear}
                    />, elem);
            });
            assignChildrenElem(elem);

            act(() => {
                TestUtil.setInputVal(inputElem, mockInputText);
                inputElem.dispatchEvent(new Event('change', { bubbles: true}));
            });
            assignChildrenElem(elem);

            const mockOnChangeArgs: any[] = mockOnChange.mock.calls[0];
            const secondCallArg: string = mockOnChangeArgs[1];
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChangeArgs.length).toBe(2);
            expect(secondCallArg).toBe(mockInputText);
            expect(mockSetState).toHaveBeenCalledWith(mockInputText);
        });

        it('should tirgger `onChange` callback when input value is updated', () => {
            mockUseState.mockImplementation(() => [mockInputText, mockSetState]);
            act(() => {
                render(<Search
                    id={mockId}
                    onChange={mockOnChange}
                    onClear={mockOnClear}
                    />, elem);
                assignChildrenElem(elem);
                clearIconBtnElem.dispatchEvent(new Event('click', {bubbles: true}));
                inputElem.dispatchEvent(new Event('change', { bubbles: true}));
            });
            expect(mockOnClear).toHaveBeenCalledTimes(1);
        });
    });

});

