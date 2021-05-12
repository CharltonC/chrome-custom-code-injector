import { TestUtil } from '../../../asset/ts/test-util';
import { IProps, IValidationRule, IValidationState } from './type';
import { TextInput } from '.';

describe('Component - Text Input', () => {
    jest.useFakeTimers();

    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        // mock with the default validation value asd we are not rendering the component
        const mockProps: any = { validation: {} };
        let cmpInst: TextInput;

        beforeEach(() => {
            cmpInst = new TextInput(mockProps);
        });

        describe('Method - Get Valid State', () => {
            const mockTextVal: string = 'lorem';
            let mockFnRule: jest.Mock;
            let mockRegexRule: RegExp;
            let spyStrSearch: jest.SpyInstance;
            let validState: IValidationState;

            beforeEach(() => {
                mockFnRule = jest.fn();
                mockRegexRule = /lorem/g;
                spyStrSearch = jest.spyOn(String.prototype, 'search');
            });

            it('should return valid state when rules are empty', () => {
                const mockRules: IValidationRule[] = [];
                validState = cmpInst.getValidState(mockTextVal, mockRules);
                expect(validState).toBeFalsy();
            });

            it('should return valid state when rule is a function', () => {
                const mockRules: IValidationRule[] = [{rule: mockFnRule, msg: 'msg'}];

                mockFnRule.mockReturnValue(false);
                validState = cmpInst.getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: false, errMsg: ['msg']});

                mockFnRule.mockReturnValue(true);
                validState = cmpInst.getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});

                expect(mockFnRule).toHaveBeenCalledWith(mockTextVal);
                expect(mockFnRule).toHaveBeenCalledTimes(2);
                expect(spyStrSearch).not.toHaveBeenCalled();
            });

            it('should return valid state when rule is a regex', () => {
                const mockRules: IValidationRule[] = [{rule: mockRegexRule, msg: 'rule'}];

                spyStrSearch.mockReturnValue(-1);
                validState = cmpInst.getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: false, errMsg: ['rule']});

                spyStrSearch.mockReturnValue(1);
                validState = cmpInst.getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});

                expect(spyStrSearch).toHaveBeenCalledWith(mockRegexRule);
                expect(spyStrSearch).toHaveBeenCalledTimes(2);
                expect(mockFnRule).not.toHaveBeenCalledWith(mockTextVal);
            });

            it('should return valid state when rule is neither regex or function', () => {
                const mockRules: any = [{rule: 'some string', msg: 'rule'}];

                validState = cmpInst.getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});
                expect(mockFnRule).not.toHaveBeenCalled();
                expect(spyStrSearch).not.toHaveBeenCalled();
            });
        });

        describe('Method - Common Event Handler', () => {
            const mockEvt: any = { target: { value: 'lorem' } };
            const mockValidState: any = {};
            const mockCharLimit = 5;
            let mockCbFn: jest.Mock;

            beforeEach(() => {
                mockCbFn = jest.fn();
                jest.spyOn(cmpInst, 'getValidState').mockReturnValue(mockValidState);
            });

            it('should skip when callback is not provided', () => {
                cmpInst.onCallback(mockEvt, null, mockCharLimit);
                expect(mockCbFn).not.toHaveBeenCalled();
            });

            it('should trigger passed callback with valid state if it is greater than character limit', () => {
                cmpInst.onCallback(mockEvt, mockCbFn, mockCharLimit);
                expect(mockCbFn).toHaveBeenCalledWith({
                    evt: mockEvt,
                    val: mockEvt.target.value,
                    validState: mockValidState,
                    isGte3: true
                });
            });

            it('should trigger passed callback without valid state if it is less than character limit', () => {
                const mockOverrideCharLimit = 10;
                cmpInst.onCallback(mockEvt, mockCbFn, mockOverrideCharLimit);
                expect(mockCbFn).toHaveBeenCalledWith({
                    evt: mockEvt,
                    val: mockEvt.target.value,
                    validState: null,
                    isGte3: true
                });
            });
        });

        describe('Method - Event handlers', () => {
            let spyOnCallback: jest.SpyInstance;
            let cmpInst: TextInput;

            const mockEvt: any = {};
            const mockProps: IProps = {
                id: '',
                onInputChange: jest.fn(),
                onInputBlur: jest.fn()
            };

            beforeEach(() => {
                spyOnCallback = jest.spyOn(TextInput.prototype, 'onCallback').mockImplementation(() => {});
                cmpInst = new TextInput(mockProps);
            });

            it('should call set valid state for `onChange`', () => {
                cmpInst.onChange(mockEvt);
                expect(spyOnCallback).toHaveBeenCalledWith(mockEvt, mockProps.onInputChange, 3);
            });

            it('should call set valid state for `onBlur`', () => {
                cmpInst.onBlur(mockEvt);
                expect(spyOnCallback).toHaveBeenCalledWith(mockEvt, mockProps.onInputBlur, 0);
            });
        });
    });

    describe('Render/DOM', () => {
        let elem: HTMLElement;
        let wrapperElem: HTMLElement;
        let labelElem: HTMLElement;
        let inputElem: HTMLInputElement;
        let iconElem: HTMLElement;
        let listElem: HTMLElement;

        const mockId: string = 'lorem';
        const mockTxtInput: string = 'some';
        const mockValidationRules: IValidationRule[] = [
            {rule: /abc/g, msg: 'should contain abc'}
        ];
        const mockProps: IProps = { id: mockId, label: 'mock-label' };

        function getChildElem() {
            wrapperElem = elem.children[0] as HTMLElement;
            labelElem = elem.querySelector('label');
            inputElem = elem.querySelector('input');
            iconElem = elem.querySelector('.icon');
            listElem = elem.querySelector('ul');
        }

        beforeEach(() => {
            elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown(elem);
            elem = null;
        });

        describe('general', () => {
            it('should render id, base class name when there is label', () => {
                TestUtil.renderPlain(elem, TextInput, mockProps);
                getChildElem();

                expect(wrapperElem.className).toBe('text-ipt text-ipt--label');
                expect(labelElem.getAttribute('for')).toBe(mockId);
                expect(inputElem.id).toBe(mockId);
            });

            it('should render when there is no label', () => {
                TestUtil.renderPlain(elem, TextInput, {...mockProps, label: null});
                getChildElem();

                expect(wrapperElem.className).toBe('text-ipt');
            });

            it('should render label with class suffix when input is required', () => {
                TestUtil.renderPlain(elem, TextInput, {...mockProps, required: true});
                getChildElem();

                expect(labelElem.className).toContain('--req');
            });
        });

        describe('props: validation', () => {
            describe('without validation config', () => {
                it('should render class names, validated icon and error list correctly when validation config is not provided', () => {
                    TestUtil.renderPlain(elem, TextInput, mockProps);
                    getChildElem();

                    expect(wrapperElem.className).not.toContain('text-ipt--valid');
                    expect(wrapperElem.className).not.toContain('text-ipt--invalid');
                    expect(iconElem).toBeFalsy();
                    expect(listElem).toBeFalsy();
                });
            });

            describe('with validation config', () => {
                const MOCK_ERR_MSG = 'lorem';
                const mockValidationProps = {
                    isValid: false,
                    rules: mockValidationRules,
                    errMsg: [MOCK_ERR_MSG]
                };

                it('should render class names, validated icon and error list correctly for valid state', () => {
                    TestUtil.renderPlain(elem, TextInput, {
                        ...mockProps,
                        validation: {
                            ...mockValidationProps,
                            isValid: true,
                        }
                    });
                    getChildElem();

                    expect(wrapperElem.className).toContain('text-ipt--valid');
                    expect(iconElem).toBeTruthy();
                    expect(listElem).toBeFalsy();
                });

                it('should render class names, validated icon and error list correctly for invalid state', () => {
                    TestUtil.renderPlain(elem, TextInput, {
                        ...mockProps,
                        validation: mockValidationProps
                    });
                    getChildElem();

                    expect(wrapperElem.className).toContain('text-ipt--invalid');
                    expect(iconElem).toBeFalsy();
                    expect(listElem.textContent).toContain(MOCK_ERR_MSG);
                });

                it('should render error messages inside input container by default', () => {
                    TestUtil.renderPlain(elem, TextInput, {
                        ...mockProps,
                        validation: mockValidationProps
                    });
                    getChildElem();

                    expect(wrapperElem.children.length).toBe(2);
                    expect(wrapperElem.lastElementChild.tagName).toBe('DIV');
                });

                it('should render error messages outside of input container', () => {
                    TestUtil.renderPlain(elem, TextInput, {
                        ...mockProps,
                        validation: {
                            ...mockValidationProps,
                            fixedPosErrMsg: false
                        }
                    });
                    getChildElem();

                    expect(wrapperElem.children.length).toBe(3);
                    expect(wrapperElem.lastElementChild.tagName).toBe('UL');
                });
            });
        });

        describe('props: text', () => {
            it('should render empty input value', () => {
                TestUtil.renderPlain(elem, TextInput, mockProps);
                getChildElem();

                expect(inputElem.value).toBe('');
            });

            it('should render the passed text input', () => {
                TestUtil.renderPlain(elem, TextInput, {...mockProps, defaultValue: mockTxtInput});
                getChildElem();

                expect(inputElem.value).toBe(mockTxtInput);
            });
        });

        describe('event handlers', () => {
            let spyOnChange: jest.SpyInstance;
            let spyOnBlur: jest.SpyInstance;

            beforeEach(() => {
                spyOnChange = jest.spyOn(TextInput.prototype, 'onChange');
                spyOnBlur = jest.spyOn(TextInput.prototype, 'onBlur');

                TestUtil.renderPlain(elem, TextInput, mockProps);
                getChildElem();
            });

            it('should trigger `onChange` on input `change` event', () => {
                TestUtil.setInputVal(inputElem, 'dummy');
                TestUtil.triggerEvt(inputElem, 'change');
                expect(spyOnChange).toHaveBeenCalled();
            });

            it('should trigger `onBlur` on input `blur` event', () => {
                TestUtil.triggerEvt(inputElem, 'blur');
                expect(spyOnBlur).toHaveBeenCalled();
            });
        });
    });
});