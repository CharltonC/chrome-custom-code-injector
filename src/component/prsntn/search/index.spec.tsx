import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";

import { TestUtil } from '../../../test-util/';
// import * as NSearch from './type';
import { Search } from './';

describe('Component - Search', () => {
    let elem: HTMLElement;
    let labelElem: Element;
    let inputElem: HTMLInputElement;
    let searchIconElem: HTMLElement;
    let clearIconBtnElem: HTMLButtonElement;

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
        elem = TestUtil.setupElem();
        mockOnChange = jest.fn();
        mockOnClear = jest.fn();
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
    });

    describe('non-empty input text with disabled', () => {
        beforeEach(() => {
            act(() => {
                render(<Search
                    id={mockId}
                    text={mockInputText}
                    disabled
                    />, elem);
            });
            assignChildrenElem(elem);
        });

        it("should render", () => {
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
                inputElem.dispatchEvent(new Event('change', { bubbles: true}));
                clearIconBtnElem.dispatchEvent(new Event('click', {bubbles: true}));
            });
            assignChildrenElem(elem);

            expect(mockOnChange).toHaveBeenCalledTimes(0);
            expect(mockOnClear).toHaveBeenCalledTimes(0);
        });
    });

    describe('empty input text with callbacks', () => {
        beforeEach(() => {
            act(() => {
                render(<Search
                    id={mockId}
                    onChange={mockOnChange}
                    onClear={mockOnClear}
                    />, elem);
            });
            assignChildrenElem(elem);
        });

        it('should render', () => {
            expect(labelElem.getAttribute('for')).toBe(mockId);
            expect(labelElem.className).not.toContain('search--disabled');
            expect(inputElem.value).toBe('');
            expect(inputElem.disabled).toBe(false);
            expect(searchIconElem).toBeTruthy();
            expect(clearIconBtnElem).toBeFalsy();
        });

        it('should tirgger `onChange` callback when input value is updated', () => {
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
        });
    });

    describe('non-empty input text with callbacks', () => {
        beforeEach(() => {
            act(() => {
                render(<Search
                    id={mockId}
                    text={mockInputText}
                    onChange={mockOnChange}
                    onClear={mockOnClear}
                    />, elem);
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
            expect(searchIconElem).toBeTruthy();
            expect(clearIconBtnElem).toBeFalsy();
        });
    });
});

