import { TestUtil } from '../../../test-util/';
import { SymbolBtn } from './';
import * as NSymbolBtn from './type';

describe('Component - Symbol Button', () => {
    let elem: HTMLElement;
    let labelElem: HTMLElement;
    let spanElem: HTMLElement;
    let inputElem: HTMLInputElement;

    const mockProps: NSymbolBtn.IProps = {
        id: 'js-1',
        text: 'Js',
        defaultChecked: true,
        onChange: jest.fn()
    };

    beforeEach(() => {
        elem = TestUtil.setupElem();
        TestUtil.renderPlain(elem, SymbolBtn, mockProps);
        labelElem = elem.children[0] as HTMLElement;
        spanElem = labelElem.querySelector('span');
        inputElem = labelElem.querySelector('input');
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
    });

    it("should pass the id and text", () => {
        expect(labelElem.getAttribute('for')).toBe(mockProps.id);
        expect(inputElem.id).toBe(mockProps.id);
        expect(spanElem.textContent).toBe(mockProps.text);
    });

    it('should trigger the optional `onChange` callback', () => {
        TestUtil.triggerEvt(labelElem, 'click', MouseEvent);
        expect(mockProps.onChange).toHaveBeenCalled();
    });
});

