// import React from "react";
// import { render } from "react-dom";
// import { act } from "react-dom/test-utils";

import { TestUtil } from '../../../test-util/';
import { IProps, IState , IValidationConfig } from './type';
import { _TextInput, TextInput } from './';

describe('Component - Text Input', () => {
    let elem: HTMLElement;

    beforeEach(() => {
        elem = TestUtil.setupElem();
        // TestUtil.renderPlain(elem, TextInput, {

        // });
        // childElem = elem.children[0];
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
        jest.clearAllMocks();
    });

    describe('Component Class', () => {
        describe('Constructor', () => {
            it('should have no external state nor validation rules when there are no text nor rules passsed', () => {
                const cmpInst: any = new _TextInput({id: ''});
                expect(cmpInst.hsExtState).toBe(false);
                expect(cmpInst.hsValidationRules).toBe(false);
                expect(cmpInst.state).toEqual({
                    isValid: null,
                    errMsg: []
                })
            });

            it('should have no external state nor validation rules when there are no text and empty rules passed ', () => {
                const cmpInst: any = new _TextInput({id: '', validate: []});
                expect(cmpInst.hsValidationRules).toBe(false);
            });

            it('should have external state and validation rules when there are text and non-empty rules passed', () => {
                const mockRules: IValidationConfig[] = [{rule: jest.fn(), msg: ''}];
                const cmpInst: any = new _TextInput({id: '', text: '', validate: mockRules});
                expect(cmpInst.hsExtState).toBe(true);
                expect(cmpInst.hsValidationRules).toBe(true);
            });
        });

        describe('Component Method - Get Valid State', () => {
            const mockTextVal: string = 'lorem';
            const getValidState = _TextInput.prototype.getValidState;
            let mockFnRule: jest.Mock;
            let mockRegexRule: RegExp;
            let spyStrSearch: jest.SpyInstance;
            let validState: IState;

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

        describe('Component Method - Set valid state', () => {
            const mockText: string = 'lorem';
            const mockRtnState: IState = {isValid: true, errMsg: []};
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
                expect(mockEvtCbFn).toHaveBeenCalledWith(mockEvt, mockText, mockText.length >=3, null);
            });

            it('should set valid state when validation rules exist, valid state has not been previously set and input text characters are more than the specified limit', () => {
                (cmpInst as any).hsValidationRules = true;      // force set private property
                cmpInst.setValidState(mockEvt, mockEvtCbFn, mockCharLimit);

                expect(spySetState).toHaveBeenCalledWith(mockRtnState);
            });

            it('should set valid state when validation rules exist and valid state has been previously set (regardless of character limit)', () => {
                (cmpInst as any).hsValidationRules = true;
                (cmpInst as any).state.isValid = true;          // force set read-only property
                cmpInst.setValidState(mockEvt, mockEvtCbFn, mockCharLimit);

                expect(spySetState).toHaveBeenCalledWith(mockRtnState);
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

        describe('Component Method - Event handlers', () => {
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

    describe('DOM', () => {

    });
});

/**
 * TODO:
 *
 * DOM
 * - id, text/value, wrapper validation class
 * - callbacks
 * - validation, icon
 * - error msg
 * - event: blur, change
 */