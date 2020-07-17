import { TestUtil } from '../../../asset/ts/test-util';
import { SortBtn } from './';

describe('Component - TODO: Component Name', () => {
    let $elem: HTMLElement;
    let $btn: HTMLButtonElement;

    function syncChildElem() {
        $btn = $elem.querySelector('button');
    }

    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });


    beforeEach(() => {
        $elem = TestUtil.setupElem();
    });

    afterEach(() => {
        TestUtil.teardown($elem);
        $elem = null;
    });

    it('should reflect no sort order if not specified', () => {
        TestUtil.renderPlain($elem, SortBtn, {});
        syncChildElem();

        expect($btn.className).toBe('kz-sort-btn');
    });

    it('should reflect ascending sort order', () => {
        TestUtil.renderPlain($elem, SortBtn, {isAsc: true});
        syncChildElem();

        expect($btn.className).toContain('kz-sort-btn--asc');
    });

    it('should reflect descending sort order', () => {
        TestUtil.renderPlain($elem, SortBtn, {isAsc: false});
        syncChildElem();

        expect($btn.className).toContain('kz-sort-btn--dsc');
    });

    it('should trigger the callback when clicked', () => {
        const mockCallback = jest.fn();
        TestUtil.renderPlain($elem, SortBtn, {onClick: mockCallback});
        syncChildElem();
        TestUtil.triggerEvt($btn, 'click');

        expect(mockCallback).toHaveBeenCalled();
    });

    it('should transfer unspecified props to button element', () => {
        TestUtil.renderPlain($elem, SortBtn, {disabled: true});
        syncChildElem();

        expect($elem.querySelector('button').disabled).toBe(true);
    });
});

