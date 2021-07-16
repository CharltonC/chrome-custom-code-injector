import { TestUtil } from '../../../asset/ts/test-util';
import { IconBtn } from '.';

describe('Component - Icon Button', () => {
    let $elem: HTMLElement;
    let $btn: HTMLElement;
    let mockOnClick: jest.Mock;

    beforeEach(() => {
        mockOnClick = jest.fn();
        $elem = TestUtil.setupElem();
        TestUtil.renderPlain($elem, IconBtn, {
            icon: 'setting',
            onClick: mockOnClick,
            clsSuffix: 'suffix'
        });
        $btn = $elem.children[0] as HTMLElement;
    });

    afterEach(() => {
        TestUtil.teardown($elem);
        $elem = null;
    });

    it('should pass class suffix to button', () => {
        expect($btn.className).toContain('icon-btn--suffix');
    });

    it("should render with an icon", () => {
        const $icons: NodeListOf<HTMLElement> = document.querySelectorAll('span.icon');
        const $icon = $icons[0];

        expect($icons.length).toBe(1);
        expect($icon.className).toBe('icon icon--setting');
    });

    it('should trigger callback fn when clicked', () => {
        TestUtil.triggerEvt($btn, 'click');
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});

