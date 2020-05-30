import { TestUtil } from '../../../test-util/';
import { SymbolBtn } from './';
import * as NSymbolBtn from './type';

describe('Component - Symbol Button', () => {
    let $elem: HTMLElement;
    let $label: HTMLElement;
    let $span: HTMLElement;
    let $checkbox: HTMLInputElement;

    const mockProps: NSymbolBtn.IProps = {
        id: 'js-1',
        text: 'Js',
        defaultChecked: true,
        onChange: jest.fn()
    };

    beforeEach(() => {
        $elem = TestUtil.setupElem();
        TestUtil.renderPlain($elem, SymbolBtn, mockProps);
        $label = $elem.children[0] as HTMLElement;
        $span = $label.querySelector('span');
        $checkbox = $label.querySelector('input');
    });

    afterEach(() => {
        TestUtil.teardown($elem);
        $elem = null;
    });

    it("should pass the id and text", () => {
        expect($label.getAttribute('for')).toBe(mockProps.id);
        expect($checkbox.id).toBe(mockProps.id);
        expect($span.textContent).toBe(mockProps.text);
    });

    it('should trigger the optional `onChange` callback', () => {
        TestUtil.triggerEvt($label, 'click', MouseEvent);
        expect(mockProps.onChange).toHaveBeenCalled();
    });
});

