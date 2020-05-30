import { TestUtil } from '../../../test-util/';
import { IconBtn } from './';

describe('Component - Icon Button', () => {
    let elem: HTMLElement;
    let btnElem: HTMLElement;
    let mockOnClick: jest.Mock;

    beforeEach(() => {
        mockOnClick = jest.fn();
        elem = TestUtil.setupElem();
        TestUtil.renderPlain(elem, IconBtn, {icon: {name: 'setting'}, onClick: mockOnClick});
        btnElem = elem.children[0] as HTMLElement;
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
    });

    it("should render with an icon", () => {
        const iconElems: NodeListOf<HTMLElement> = document.querySelectorAll('span.icon');
        const iconElem: HTMLElement = iconElems[0];

        expect(iconElems.length).toBe(1);
        expect(iconElem.className).toBe('icon icon--setting icon--plain');
    });

    it('should trigger callback fn when clicked', () => {
        TestUtil.triggerEvt(btnElem, 'click');
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});

