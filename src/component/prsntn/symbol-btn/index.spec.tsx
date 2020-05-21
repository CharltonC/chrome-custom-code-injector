import { TestUtil } from '../../../test-util/';
import { SymbolBtn } from './';

describe('Component - Symbol Button', () => {
    let elem: HTMLElement;
    let labelElem: HTMLElement;
    let spanElem: HTMLElement;
    let inputElem: HTMLInputElement;

    beforeEach(() => {
        elem = TestUtil.setupElem();
        TestUtil.renderPlain(elem, SymbolBtn, { text: 'Js', defaultChecked: true});
        labelElem = elem.children[0] as HTMLElement;
        spanElem = labelElem.querySelector('span');
        inputElem = labelElem.querySelector('input');
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
    });

    it("should pass the id and text", () => {
        expect(labelElem.getAttribute('for')).toBe('symbol-btn-Js');
        expect(inputElem.id).toBe('symbol-btn-Js');
        expect(spanElem.textContent).toBe('Js');
    });

    it('should pass the unknown props', () => {
        expect(inputElem.checked).toBe(true);

        TestUtil.triggerEvt(labelElem, 'click', MouseEvent);
        expect(inputElem.checked).toBe(false);
    });
});

