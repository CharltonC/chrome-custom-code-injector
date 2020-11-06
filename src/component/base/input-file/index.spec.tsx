import React, { Component } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { FileInput } from '.';
import { IProps } from './type';

describe('Component - File Input', () => {
    const mockProps: IProps = {
        id: 'some-id',
        fileType: 'image/jpg',
        clsSuffix: 'some-class',
        title: 'some-title'
    };

    const mockValidation = [
        { msg: 'abc', rule: () => false },
        { msg: 'def', rule: () => true },
    ];

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockEvt: any = {
            target: {
                files: { item: () => [] }
            }
        };
        let cmp: FileInput;
        let setStateSpy: jest.SpyInstance;

        beforeEach(() => {
            setStateSpy = jest.spyOn(Component.prototype, 'setState');
            setStateSpy.mockImplementation(() => {});
        });

        describe('Default State', () => {
            it('should have default state', () => {
                const { isValid, errMsg } = new FileInput(mockProps).state;
                expect(isValid).toBe(null);
                expect(errMsg).toEqual([]);
            });
        });

        describe('Method - onChange', () => {
            it('should not set state if validation rules are not provided', () => {
                cmp = new FileInput(mockProps);
                cmp.onChange(mockEvt);
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should not set state if validation rules are empty', () => {
                cmp = new FileInput({...mockProps, validate: []});
                cmp.onChange(mockEvt);
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set state and trigger callback if validation rules are provied', () => {
                const mockOnFileChange = jest.fn();
                const validState = {
                    errMsg: [ mockValidation[0].msg ],
                    isValid: false
                };
                cmp = new FileInput({
                    ...mockProps,
                    validate: mockValidation,
                    onFileChange: mockOnFileChange,
                });
                cmp.onChange(mockEvt);

                expect(setStateSpy.mock.calls[0][0]).toEqual(validState);
                expect(mockOnFileChange).toHaveBeenCalledWith(mockEvt, validState);
            });
        });
    });

    describe('render', () => {
        let $elem: HTMLElement;
        let $wrapper: HTMLElement;
        let $input: HTMLInputElement;
        let $ul: HTMLUListElement;

        function syncElem() {
            $wrapper = $elem.querySelector('div');
            $input = $elem.querySelector('input');
            $ul = $elem.querySelector('ul');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it('should render', () => {
            TestUtil.renderPlain($elem, FileInput, mockProps);
            syncElem();

            expect($wrapper.className).toContain(`file-input--${mockProps.clsSuffix}`);
            expect($input.id).toBe(mockProps.id);
            expect($input.accept).toBe(mockProps.fileType);
            expect($input.title).toBe(mockProps.title);
        });

        it('should hide error list by default', () => {
            TestUtil.renderPlain($elem, FileInput, mockProps);
            syncElem();
            expect($ul).toBeFalsy();
        });

        it('should hide error list by default', () => {
            TestUtil.renderPlain($elem, FileInput, {
                ...mockProps,
                validate: mockValidation
            });
            syncElem();

            TestUtil.triggerEvt($input, 'change');
            syncElem();

            expect($ul).toBeTruthy();
        });

    });
});

