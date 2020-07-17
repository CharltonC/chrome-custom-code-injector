import { TestUtil } from '../../../asset/ts/test-util';
import { IProps, IState } from './type';
import { _SearchInput, SearchInput } from './';

describe('Component - Search', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockBaseProps: IProps = {id: 'id', text: 'text'};
        const mockNewText: string = 'diff text';
        const mockEvt: any = {target: {value: mockNewText}};
        let searchInput: _SearchInput;
        let intState: IState;
        let spyGetIntState: jest.SpyInstance;
        let spySetState: jest.SpyInstance;
        let mockCbFn: jest.Mock;

        beforeEach(() => {
            mockCbFn = jest.fn();
            spySetState  = jest.spyOn(_SearchInput.prototype, 'setState').mockImplementation(() => {});
            spyGetIntState = jest.spyOn(_SearchInput.prototype, 'getIntState');
            searchInput = new _SearchInput(mockBaseProps);
        });

        describe('Constructor', () => {
            it('should set the internal state initially', () => {
                expect(spyGetIntState).toHaveBeenCalledWith(mockBaseProps.text);
                expect(searchInput.state).toEqual({
                    hsText: true,
                    hsExtState: true
                });
            });
        });

        describe('Method - getIntState', () => {
            it('should return an initial state when text is defined', () => {
                intState = searchInput.getIntState('some text');

                expect(intState).toEqual({
                    hsExtState: true,
                    hsText: true
                });
            });

            it('should return an initial state when text is not defined', () => {
                intState = searchInput.getIntState();

                expect(intState).toEqual({
                    hsExtState: false,
                    hsText: false
                });
            });
        });

        describe('Method - onInputChange', () => {
            it('should set state and trigger onChange callback if provided', () => {
                (searchInput.props as any).onChange = mockCbFn;
                searchInput.onInputChange(mockEvt);

                expect(spySetState).toHaveBeenCalledWith({hsText: !!mockNewText});
                expect(mockCbFn).toHaveBeenCalledWith(mockEvt, mockNewText, mockNewText.length >=2);
            });

            it('should not trigger onChange callback if not provided', () => {
                (searchInput.props as any).onChange = null;
                searchInput.onInputChange(mockEvt);

                expect(mockCbFn).not.toHaveBeenCalled();
            });
        });

        describe('Method - onBtnClick', () => {
            const mockFocus: jest.Mock = jest.fn();

            beforeEach(() => {
                (searchInput.inputElem as any) = { value: mockNewText, focus: mockFocus };
            });

            it('should set state, focus input and trigger onClear callback if provided', () => {
                (searchInput.props as any).onClear = mockCbFn;
                searchInput.onBtnClick(mockEvt);

                expect(spySetState).toHaveBeenCalledWith({hsText: false});
                expect(searchInput.inputElem.value).toBe('');
                expect(mockFocus).toHaveBeenCalled();
                expect(mockCbFn).toHaveBeenCalledWith(mockEvt);
            });

            it('should not trigger onClear callback if not provided', () => {
                (searchInput.props as any).onClear = null;
                searchInput.onBtnClick(mockEvt);

                expect(mockCbFn).not.toHaveBeenCalled();
            });
        });
    });

    describe('Render/DOM', () => {
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
                TestUtil.renderPlain(elem, SearchInput, {...mockProps});
                helper.assignChildrenElem();

                expect(labelElem.getAttribute('for')).toBe(mockId);
                expect(inputElem.id).toBe(mockId);
            });
        });

        describe('props: text', () => {
            describe('when input value is not provided', () => {
                it('should reflect internal state input, search icon, clear button', () => {
                    TestUtil.renderPlain(elem, SearchInput, {...mockProps});
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
                    TestUtil.renderPlain(elem, SearchInput, {...mockProps, text: ''});
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
                    TestUtil.renderPlain(elem, SearchInput, {...mockProps, text: mockText});
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
                TestUtil.renderPlain(elem, SearchInput, {...mockProps, text: ''});
                helper.assignChildrenElem();

                expect(labelElem.className).not.toContain('search--disabled');
                expect(inputElem.disabled).toBe(false);
            });

            it('should reflect disabled state in form elements when value is not empty ', () => {
                TestUtil.renderPlain(elem, SearchInput, {...mockProps, disabled: true, text: mockText});
                helper.assignChildrenElem();

                expect(labelElem.className).toContain('search--disabled');
                expect(inputElem.disabled).toBe(true);
                expect(clearIconBtnElem.disabled).toBe(true);
            });
        });

        describe('internal callbacks', () => {
            let spyOnInputChange: jest.SpyInstance;
            let spyOnBtnClick: jest.SpyInstance

            beforeEach(() => {
                spyOnInputChange = jest.spyOn(_SearchInput.prototype, 'onInputChange');
                spyOnBtnClick = jest.spyOn(_SearchInput.prototype, 'onBtnClick');

                TestUtil.renderPlain(elem, SearchInput, {...mockProps});
                helper.assignChildrenElem();
                helper.triggerInputChange();
            });

            it('should trigger `onInputChange` when input change', () => {
                expect(spyOnInputChange).toHaveBeenCalled();
            });

            it('should trigger `onBtnClick` when clear button is clicked', () => {
                helper.triggerClearBtnClick();
                expect(spyOnBtnClick).toHaveBeenCalled();
            });
        });
    });
});

