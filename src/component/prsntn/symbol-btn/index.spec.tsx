import { TestUtil } from '../../../test-util/';
import { _SymbolBtn, SymbolBtn } from './';
import { IProps} from './type';
import { _TabSwitch } from '../tab-switch';

describe('Component - Symbol Button', () => {
    const mockEvt: any = { target: { checked: true}};
    let mockProps: IProps;
    let mockCbFn: jest.Mock;
    let symbolBtn: _SymbolBtn;

    beforeEach(() => {
        mockProps = {id: 'js-1', text: 'Js'};
        mockCbFn = jest.fn();
    });

    describe('Component Class', () => {
        it('constructor - should not have external state if checked state is not passed', () => {
            symbolBtn = new _SymbolBtn({...mockProps});
            expect(symbolBtn.hsExtState).toBe(false);
        });

        it('constructor - should have external state if checked state is passed', () => {
            symbolBtn = new _SymbolBtn({...mockProps, isChecked: true});
            expect(symbolBtn.hsExtState).toBe(true);
        });

        it('method - should not call the passed callback `onChecked` if not provided', () => {
            symbolBtn = new _SymbolBtn(mockProps);
            symbolBtn.onChange(mockEvt);
            expect(mockCbFn).not.toHaveBeenCalled();
        });

        it('method - should call the passed callback `onChecked` if provided', () => {
            symbolBtn = new _SymbolBtn({...mockProps, onChecked: mockCbFn});
            symbolBtn.onChange(mockEvt);
            expect(mockCbFn).toHaveBeenCalledWith(mockEvt, mockEvt.target.checked);
        });
    });

    describe('Render/DOM', () => {
        let $elem: HTMLElement;
        let $label: HTMLElement;
        let $span: HTMLElement;
        let $checkbox: HTMLInputElement;
        let spyOnChange: jest.SpyInstance;

        function getChildElem() {
            $label = $elem.querySelector('label');
            $span = $elem.querySelector('span');
            $checkbox = $elem.querySelector('input');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
            spyOnChange = jest.spyOn(_SymbolBtn.prototype, 'onChange');
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it("should pass the id, text and have default unchecked state", () => {
            TestUtil.renderPlain($elem, SymbolBtn, mockProps);
            getChildElem();

            expect($label.getAttribute('for')).toBe(mockProps.id);
            expect($checkbox.id).toBe(mockProps.id);
            expect($checkbox.checked).toBe(false);
            expect($span.textContent).toBe(mockProps.text);
        });

        it('should render the checked state if checked state is passed', () => {
            TestUtil.renderPlain($elem, SymbolBtn, {...mockProps, isChecked: true});
            getChildElem();

            expect($checkbox.checked).toBe(true);
        });

        it('should trigger `onChange` event handle', () => {
            TestUtil.renderPlain($elem, SymbolBtn, mockProps);
            getChildElem();

            TestUtil.triggerEvt($label, 'click', MouseEvent);
            expect(spyOnChange).toHaveBeenCalled();
        });
    });
});
