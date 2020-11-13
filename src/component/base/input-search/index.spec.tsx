import { TestUtil } from '../../../asset/ts/test-util';
import { IProps } from './type';
import { SearchInput } from '.';

describe('Component - Search', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockBaseProps: IProps = {id: 'id', value: 'text'};
        const mockNewText: string = 'diff text';
        const mockEvt: any = {target: {value: mockNewText}};
        let searchInput: SearchInput;
        let mockCbFn: jest.Mock;

        beforeEach(() => {
            mockCbFn = jest.fn();
            searchInput = new SearchInput(mockBaseProps);
        });

        describe('Method - onInputChange', () => {
            it('should set state and trigger onChange callback if provided', () => {
                (searchInput.props as any).onInputChange = mockCbFn;
                searchInput.onChange(mockEvt);
                expect(mockCbFn).toHaveBeenCalledWith(mockEvt, mockNewText, mockNewText.length >=2);
            });

            it('should not trigger onChange callback if not provided', () => {
                (searchInput.props as any).onInputChange = null;
                searchInput.onChange(mockEvt);

                expect(mockCbFn).not.toHaveBeenCalled();
            });
        });

        describe('Method - onBtnClick', () => {
            const mockFocus: jest.Mock = jest.fn();

            beforeEach(() => {
                (searchInput.$input as any) = { value: mockNewText, focus: mockFocus };
            });

            it('should set state, focus input and trigger onClear callback if provided', () => {
                (searchInput.props as any).onInputClear = mockCbFn;
                searchInput.onClick(mockEvt);

                expect(searchInput.$input.value).toBe('');
                expect(mockFocus).toHaveBeenCalled();
                expect(mockCbFn).toHaveBeenCalledWith(mockEvt);
            });

            it('should not trigger onClear callback if not provided', () => {
                (searchInput.props as any).onInputClear = null;
                searchInput.onClick(mockEvt);

                expect(mockCbFn).not.toHaveBeenCalled();
            });
        });
    });

    describe('Render/DOM', () => {
        let elem: HTMLElement;
        let labelElem: Element;
        let inputElem: HTMLInputElement;
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

        describe('props', () => {
            it('should reflect id state in label, input', () => {
                TestUtil.renderPlain(elem, SearchInput, {...mockProps});
                helper.assignChildrenElem();

                expect(labelElem.getAttribute('for')).toBe(mockId);
                expect(inputElem.id).toBe(mockId);
            });

            it('should reflect non-disabled state in form elements when value is empty or when value is not passed', () => {
                TestUtil.renderPlain(elem, SearchInput, {...mockProps, value: ''});
                helper.assignChildrenElem();

                expect(labelElem.className).not.toContain('search--disabled');
                expect(inputElem.disabled).toBe(false);
            });

            it('should reflect disabled state in form elements when value is not empty ', () => {
                TestUtil.renderPlain(elem, SearchInput, {...mockProps, disabled: true, value: mockText});
                helper.assignChildrenElem();

                expect(labelElem.className).toContain('search--disabled');
                expect(inputElem.disabled).toBe(true);
                expect(clearIconBtnElem.disabled).toBe(true);
            });
        });
    });
});

