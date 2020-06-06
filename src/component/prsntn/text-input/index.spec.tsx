import { TestUtil } from '../../../test-util/';
import { IProps, IState , IValidationConfig } from './type';
import { _TextInput, TextInput } from './';

describe('Component - Text Input', () => {
    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        describe('Constructor', () => {
            it('should init', () => {
                const mockInitialState: any = {};
                const mockProps: IProps = {id: '', text: 'abc'};
                let spyGetInitialState: jest.SpyInstance = jest.spyOn(_TextInput.prototype, 'getInitialState').mockReturnValue(mockInitialState);
                const cmpInst: any = new _TextInput(mockProps);

                expect(spyGetInitialState).toHaveBeenCalledWith(mockProps.text, undefined);
                expect(cmpInst.state).toEqual(mockInitialState);
            });
        });

        describe('Lifecycle - `UNSAFE_componentWillReceiveProps`', () => {
            const mockText: string = 'lorem';
            const mockBaseProps: IProps = {id: '', validate: []};
            const mockValidationRules: IValidationConfig[] = [{rule: () => true, msg: 'wrong'}];
            const mockValidState: Partial<IState> = {errMsg: [], isValid: true};
            let mockInitialState: Partial<IState>;

            let spyGetInitialState: jest.SpyInstance;
            let spyGetValidState: jest.SpyInstance;
            let spySetState: jest.SpyInstance;
            let cmpInst: _TextInput;

            beforeEach(() => {
                spyGetInitialState = jest.spyOn(_TextInput.prototype, 'getInitialState');
                spyGetValidState = jest.spyOn(_TextInput.prototype, 'getValidState').mockReturnValue(mockValidState);
                spySetState = jest.spyOn(_TextInput.prototype, 'setState').mockImplementation(() => {});
            });

            it('should revalidate using passed text if text is passed and validation rules have changed', () => {
                mockInitialState = { hsExtState: true, hsValidationRules: true };
                spyGetInitialState.mockReturnValue(mockInitialState);
                cmpInst = new _TextInput({...mockBaseProps, text: mockText});
                cmpInst.UNSAFE_componentWillReceiveProps({...mockBaseProps, text: mockText, validate: mockValidationRules});

                expect(spyGetInitialState).toHaveBeenCalledTimes(2);    // incl. constructor
                expect(spyGetInitialState.mock.calls[1]).toEqual([mockText, mockValidationRules]);
                expect(spyGetValidState).toHaveBeenCalledWith(mockText, mockValidationRules);
                expect(spySetState).toHaveBeenCalledWith({
                    ...mockInitialState,
                    ...mockValidState,
                });
            });

            it('should revalidate using text value from Input Elem Ref if no text is passed and validation rules have changed', () => {
                mockInitialState = { hsExtState: false, hsValidationRules: true };
                spyGetInitialState.mockReturnValue(mockInitialState);
                cmpInst = new _TextInput(mockBaseProps);

                // Force validation rules change & call `UNSAFE_componentWillReceiveProps`
                const mockInputVal: string = 'abc';
                (cmpInst.inputElem as any) = {value: mockInputVal};
                cmpInst.UNSAFE_componentWillReceiveProps({...mockBaseProps, validate: mockValidationRules});

                expect(spyGetInitialState).toHaveBeenCalledTimes(2);    // incl. constructor
                expect(spyGetInitialState.mock.calls[1]).toEqual([undefined, mockValidationRules]);
                expect(spyGetValidState).toHaveBeenCalledWith(mockInputVal, mockValidationRules);
                expect(spySetState).toHaveBeenCalledWith({
                    ...mockInitialState,
                    ...mockValidState
                });
            });

            it('should not revalidate if validation rules have changed but empty', () => {
                mockInitialState = { hsExtState: true, hsValidationRules: false };
                spyGetInitialState.mockReturnValue(mockInitialState);
                cmpInst = new _TextInput({...mockBaseProps, text: mockText});
                cmpInst.UNSAFE_componentWillReceiveProps({...mockBaseProps, text: mockText, validate: []});

                expect(spyGetInitialState).toHaveBeenCalledTimes(2);    // incl. constructor
                expect(spyGetInitialState.mock.calls[1]).toEqual([mockText, []]);
                expect(spyGetValidState).not.toHaveBeenCalled();
                expect(spySetState).toHaveBeenCalledWith(mockInitialState);
            });

            it('should not revalidate if validation rules have not changed', () => {
                mockInitialState = { hsExtState: false, hsValidationRules: true };
                spyGetInitialState.mockReturnValue(mockInitialState);
                cmpInst = new _TextInput(mockBaseProps);
                cmpInst.UNSAFE_componentWillReceiveProps(mockBaseProps);

                expect(spyGetInitialState).toHaveBeenCalledTimes(1);    // incl. constructor
                expect(spyGetValidState).not.toHaveBeenCalled();
                expect(spySetState).not.toHaveBeenCalled();
            });
        });

        describe('Method - getInitialState', () => {
            const mockInitialBaseState: Partial<IState> = {isValid: null, errMsg: []};
            const mockValidationRules: IValidationConfig[] = [{rule: () => true, msg: 'wrong'}];
            const { getInitialState } = _TextInput.prototype;

            it('should get Initial state when text is not provided', () => {
                expect(getInitialState(undefined, undefined)).toEqual({
                    ...mockInitialBaseState,
                    hsExtState: false,
                    hsValidationRules: false
                });

                expect(getInitialState(undefined, [])).toEqual({
                    ...mockInitialBaseState,
                    hsExtState: false,
                    hsValidationRules: false
                });
            });

            it('should get Initial state when text is provided', () => {
                expect(getInitialState('', undefined)).toEqual({
                    ...mockInitialBaseState,
                    hsExtState: true,
                    hsValidationRules: false
                });

                expect(getInitialState('', mockValidationRules)).toEqual({
                    ...mockInitialBaseState,
                    hsExtState: true,
                    hsValidationRules: true
                });
            });
        });

        describe('Method - Get Valid State', () => {
            const mockTextVal: string = 'lorem';
            const getValidState = _TextInput.prototype.getValidState;
            let mockFnRule: jest.Mock;
            let mockRegexRule: RegExp;
            let spyStrSearch: jest.SpyInstance;
            let validState: Partial<IState>;

            beforeEach(() => {
                mockFnRule = jest.fn();
                mockRegexRule = /lorem/g;
                spyStrSearch = jest.spyOn(String.prototype, 'search');
            });

            it('should return valid state when rules are empty', () => {
                const mockRules: IValidationConfig[] = [];
                validState = getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});
            });

            it('should return valid state when rule is a function', () => {
                const mockRules: IValidationConfig[] = [{rule: mockFnRule, msg: 'msg'}];

                mockFnRule.mockReturnValue(false);
                validState = getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: false, errMsg: ['msg']});

                mockFnRule.mockReturnValue(true);
                validState = getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});

                expect(mockFnRule).toHaveBeenCalledWith(mockTextVal);
                expect(mockFnRule).toHaveBeenCalledTimes(2);
                expect(spyStrSearch).not.toHaveBeenCalled();
            });

            it('should return valid state when rule is a regex', () => {
                const mockRules: IValidationConfig[] = [{rule: mockRegexRule, msg: 'rule'}];

                spyStrSearch.mockReturnValue(-1);
                validState = getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: false, errMsg: ['rule']});

                spyStrSearch.mockReturnValue(1);
                validState = getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});

                expect(spyStrSearch).toHaveBeenCalledWith(mockRegexRule);
                expect(spyStrSearch).toHaveBeenCalledTimes(2);
                expect(mockFnRule).not.toHaveBeenCalledWith(mockTextVal);
            });

            it('should return valid state when rule is neither regex or function', () => {
                const mockRules: any = [{rule: 'some string', msg: 'rule'}];

                validState = getValidState(mockTextVal, mockRules);
                expect(validState).toEqual({isValid: true, errMsg: []});
                expect(mockFnRule).not.toHaveBeenCalled();
                expect(spyStrSearch).not.toHaveBeenCalled();
            });
        });

        describe('Method - Set valid state', () => {
            const mockText: string = 'lorem';
            const mockRtnState: Partial<IState> = {isValid: true, errMsg: []};
            const mockEvtCbFn: jest.Mock = jest.fn();
            const mockEvt: any = { target: { value: mockText }};
            const mockProps: IProps = {id: ''};
            const mockCharLimit: number = 3;

            let spySetState: jest.SpyInstance;
            let cmpInst: _TextInput;

            beforeEach(() => {
                jest.spyOn(_TextInput.prototype, 'getValidState').mockReturnValue(mockRtnState);
                spySetState = jest.spyOn(_TextInput.prototype, 'setState').mockImplementation(() => {});
                cmpInst = new _TextInput(mockProps);
            });

            it('should trigger callback if provided', () => {
                cmpInst.setValidState(mockEvt, null, mockCharLimit);
                expect(mockEvtCbFn).not.toHaveBeenCalled();

                cmpInst.setValidState(mockEvt, mockEvtCbFn, mockCharLimit);
                expect(mockEvtCbFn).toHaveBeenCalledWith({
                    evt: mockEvt,
                    val: mockText,
                    isGte3: mockText.length >=3,
                    validState: null
                });
            });

            it('should set valid state when validation rules exist, valid state has not been previously set and input text characters are more than the specified limit', () => {
                (cmpInst.state as any).hsValidationRules = true;    // force set private property
                cmpInst.setValidState(mockEvt, mockEvtCbFn, mockCharLimit);

                expect(spySetState).toHaveBeenCalledWith({...cmpInst.state, ...mockRtnState});
            });

            it('should set valid state when validation rules exist and valid state has been previously set (regardless of character limit)', () => {
                (cmpInst.state as any).hsValidationRules = true;
                (cmpInst.state as any).isValid = true;          // force set read-only property
                cmpInst.setValidState(mockEvt, mockEvtCbFn, mockCharLimit);

                expect(spySetState).toHaveBeenCalledWith({...cmpInst.state, ...mockRtnState});
            });

            it('should not set valid state when validation rules dont exist', () => {
                (cmpInst as any).hsValidationRules = false;
                cmpInst.setValidState(mockEvt, mockEvtCbFn, mockCharLimit);

                expect(spySetState).not.toHaveBeenCalled();
            });

            it('should not set valid state when validation rules exist, valid state has been previously set and input text character is less than the specified limit', () => {
                (cmpInst as any).hsValidationRules = true;
                cmpInst.setValidState(mockEvt, mockEvtCbFn, 100);
                expect(spySetState).not.toHaveBeenCalled();
            });
        });

        describe('Method - Event handlers', () => {
            let spySetValidState: jest.SpyInstance;
            let cmpInst: _TextInput;
            const mockEvt: any = {};
            const mockProps: IProps = {id: '', onInputChange: jest.fn(), onInputBlur: jest.fn() };

            beforeEach(() => {
                spySetValidState = jest.spyOn(_TextInput.prototype, 'setValidState').mockImplementation(() => {});
                cmpInst = new _TextInput(mockProps);
            });

            it('should call set valid state for `onChange`', () => {
                cmpInst.onChange(mockEvt);
                expect(spySetValidState).toHaveBeenCalledWith(mockEvt, mockProps.onInputChange, 3);
            });

            it('should call set valid state for `onBlur`', () => {
                cmpInst.onBlur(mockEvt);
                expect(spySetValidState).toHaveBeenCalledWith(mockEvt, mockProps.onInputBlur, 0);
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
        const mockValidTxtInput: string  = 'abc';
        const mockValidationRules: IValidationConfig[] = [
            {rule: /abc/g, msg: 'should contain abc'}
        ];
        const mockProps: IProps = {id: mockId};

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
            it('should render id, base class name', () => {
                TestUtil.renderPlain(elem, TextInput, mockProps);
                getChildElem();

                expect(wrapperElem.className).toBe('text-ipt');
                expect(labelElem.getAttribute('for')).toBe(mockId);
                expect(inputElem.id).toBe(mockId);
            });
        });

        describe('props: validation rules', () => {
            it('should render class names, validated icon and error list correctly when rules are not provided', () => {
                TestUtil.renderPlain(elem, TextInput, mockProps);
                getChildElem();

                expect(wrapperElem.className).not.toContain('text-ipt--valid');
                expect(wrapperElem.className).not.toContain('text-ipt--invalid');
                expect(iconElem).toBeFalsy();
                expect(listElem).toBeFalsy();
            });

            it('should render class names, validated icon and error list correctly when rules are provided', () => {
                TestUtil.renderPlain(elem, TextInput, {...mockProps, validate: mockValidationRules});
                getChildElem();

                // Trigger invalid state
                TestUtil.triggerEvt(inputElem, 'blur');
                getChildElem();
                expect(wrapperElem.className).toContain('text-ipt--invalid');
                expect(iconElem).toBeFalsy();
                expect(listElem.textContent).toContain(mockValidationRules[0].msg);

                // Trigger valid state
                TestUtil.setInputVal(inputElem, mockValidTxtInput);
                TestUtil.triggerEvt(inputElem, 'change');
                getChildElem();
                expect(wrapperElem.className).toContain('text-ipt--valid');
                expect(iconElem).toBeTruthy();
                expect(listElem).toBeFalsy();
            });
        });

        describe('props: text', () => {
            it('should render empty input value', () => {
                TestUtil.renderPlain(elem, TextInput, mockProps);
                getChildElem();

                expect(inputElem.value).toBe('');
            });

            it('should render the passed text input', () => {
                TestUtil.renderPlain(elem, TextInput, {...mockProps, text: mockTxtInput});
                getChildElem();

                expect(inputElem.value).toBe(mockTxtInput);
            });
        });

        describe('event handlers', () => {
            let spyOnChange: jest.SpyInstance;
            let spyOnBlur: jest.SpyInstance;

            beforeEach(() => {
                spyOnChange = jest.spyOn(_TextInput.prototype, 'onChange');
                spyOnBlur = jest.spyOn(_TextInput.prototype, 'onBlur');

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