import { Component } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { FileInput } from '.';
import { IProps, AValidationConfig } from './type';

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
        let mockFileItem: jest.Mock;
        let mockEvt: any;
        let cmp: FileInput;
        let setStateSpy: jest.SpyInstance;

        beforeEach(() => {
            setStateSpy = jest.spyOn(Component.prototype, 'setState');
            setStateSpy.mockImplementation(() => {});

            mockFileItem = jest.fn();
            mockFileItem.mockReturnValue(true);     // assume there is file by def.
            mockEvt = {
                target: {
                    files: { item: mockFileItem }
                }
            };
        });

        describe('Default State', () => {
            it('should have default state', () => {
                const { isValid, errMsg } = new FileInput(mockProps).state;
                expect(isValid).toBe(null);
                expect(errMsg).toEqual([]);
            });
        });

        describe('Method - onChange', () => {
            it('should not set state if validation rules are not provided', async () => {
                cmp = new FileInput(mockProps);
                await cmp.onChange(mockEvt);
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should not set state if validation rules are empty', async () => {
                cmp = new FileInput({...mockProps, validate: []});
                await cmp.onChange(mockEvt);
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set state and trigger callback if validation rules are provided & file is selected', async () => {
                const mockOnFileChange = jest.fn();
                const mockErrMsg = Promise.resolve([mockValidation[0].msg]);
                jest.spyOn(FileInput.prototype, 'getErrMsg').mockReturnValue(mockErrMsg);
                const validState = {
                    errMsg: [ mockValidation[0].msg ],
                    isValid: false
                };
                cmp = new FileInput({
                    ...mockProps,
                    validate: mockValidation,
                    onFileChange: mockOnFileChange,
                });
                await cmp.onChange(mockEvt);

                expect(setStateSpy.mock.calls[0][0]).toEqual(validState);
                expect(mockOnFileChange).toHaveBeenCalledWith({
                    file: true,
                    ...validState
                });
            });

            it('should set state and trigger callback if validation rules are provided & no file is selected', async() => {
                mockFileItem.mockReturnValue(false);
                cmp = new FileInput({ ...mockProps, validate: mockValidation });
                await cmp.onChange(mockEvt);
                expect(setStateSpy.mock.calls[0][0].errMsg).toEqual(['no file was selected']);
            });
        });

        describe('Method = getErrMsg', () => {
            const mockFile: any = {};
            let mockValidator;

            beforeEach(() => {
                cmp = new FileInput(mockProps);
            });

            describe('when validator is a Custom Validator function', () => {
                beforeEach(() => {
                    mockValidator = jest.fn() as AValidationConfig;
                });

                it('should return empty error msg when valid', async () => {
                    mockValidator.mockReturnValue(Promise.resolve(true));
                    const errMsg = await cmp.getErrMsg(mockFile, mockValidator);
                    expect(errMsg).toEqual([]);
                });

                it('should return error msg when invalid', async () => {
                    const mockErrMsg = ['lorem'];
                    mockValidator.mockReturnValue(Promise.resolve(mockErrMsg));
                    const errMsg = await cmp.getErrMsg(mockFile, mockValidator)
                    expect(errMsg).toEqual(mockErrMsg);
                });
            });

            describe('when validator is a config object', () => {
                beforeEach(() => {
                    mockValidator = {
                        rule: jest.fn(),
                        msg: 'lorem'
                    };
                });

                it('should return empty error msg when valid', async () => {
                    mockValidator.rule.mockReturnValue(true);
                    const errMsg = await cmp.getErrMsg(mockFile, mockValidator);
                    expect(errMsg).toEqual([]);
                });

                it('should return error msg when invalid', async () => {
                    mockValidator.rule.mockReturnValue(false);
                    const errMsg = await cmp.getErrMsg(mockFile, mockValidator);
                    expect(errMsg).toEqual([mockValidator.msg]);
                });
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
            $elem = TestUtil.teardown($elem);
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

