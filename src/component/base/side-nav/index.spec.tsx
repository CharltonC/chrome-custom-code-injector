import { TestUtil } from '../../../asset/ts/test-util';
import { IProps } from './type';
import { SideNav } from '.';

describe('Component - Side Nav', () => {
    const mockList = [
      { title: "1", list: [{ title: "1a" }, { title: "1b" }] },
      { title: "2", list: [{ title: "2a" }, { title: "2b" }] },
    ];

    const mockDefProps: IProps = {
        list: mockList,
    };

    let onClickSpy: jest.SpyInstance;

    beforeEach(() => {
        onClickSpy = jest.spyOn(SideNav.prototype, 'onClick');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Render/DOM', () => {
        let $elem: HTMLElement;
        let $listItems: NodeListOf<HTMLElement>;
        let $nestLists: NodeListOf<HTMLElement>;
        let $nestListItems: NodeListOf<HTMLElement>;
        let $1stItem: HTMLElement;
        let $2ndItem: HTMLElement;

        function assignChildElem() {
            $listItems = $elem.querySelectorAll('aside > ul > li');
            $nestLists = $elem.querySelectorAll('aside li > ul');
            $nestListItems = $elem.querySelectorAll('aside li > ul > li');
            $1stItem = $listItems[0];
            $2ndItem = $listItems[1];
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        describe('general', () => {
            beforeEach(() => {
                TestUtil.renderPlain($elem, SideNav, mockDefProps);
                assignChildElem();
            });

            it('should render by default', () => {
                expect($1stItem.className).toContain('side-nav__item--atv');
                expect($1stItem.className).toContain('side-nav__item--parent');

                expect($1stItem.querySelector('.side-nav__title').textContent).toBe(mockDefProps.list[0].title);
                expect($1stItem.querySelector('.badge').textContent).toBe('2');
                expect($1stItem.querySelector('ul').style.maxHeight).toBe('320px');
                expect($1stItem.querySelectorAll('li').length).toBeTruthy();
                expect($2ndItem.querySelector('ul')).toBeFalsy();
            });

            it('should only render the current active/1st list item\'s nested list items', () => {
                expect($nestLists.length).toBe(1);
                expect($nestListItems.length).toBe(2);
                expect($1stItem.querySelectorAll('li').length).toBe(2);
                expect($2ndItem.querySelectorAll('li').length).toBe(0);
            });

            it('should make the clicked list item active if it\'s not active', () => {
                TestUtil.triggerEvt($2ndItem, 'click');
                assignChildElem();

                const { evt, ...args } = onClickSpy.mock.calls[0][0];
                expect(args).toEqual({
                    idx: 1,
                    item: mockList[1],
                    isChild: undefined,
                });
            });

            it('should make the clicked nested list item active if it\'s not active', () => {
                TestUtil.triggerEvt($nestListItems[1], 'click');
                assignChildElem();

                const { evt, ...args } = onClickSpy.mock.calls[0][0];
                expect(args).toEqual({
                    idx: 1,
                    item: mockList[0].list[1],
                    isChild: true,
                    parentIdx: 0,
                });
            });
        });

        describe('render nested items if they are array of string', () => {
            const MOCK_TITLE = 'TITLE';

            beforeEach(() => {
                TestUtil.renderPlain($elem, SideNav, {
                    list: [
                        {
                            title: 'lorem',
                            list: [ MOCK_TITLE, MOCK_TITLE ]
                        }
                    ]
                });
                assignChildElem();
            });

            it('should render', () => {
                expect($nestListItems[0].textContent).toBe(MOCK_TITLE);
            });
        });

        describe('downward arrow for parent item ', () => {
            it('should appear when the itself is active', () => {
                TestUtil.renderPlain($elem, SideNav, mockDefProps);
                assignChildElem();

                expect($1stItem.querySelector('.icon--arrow-dn')).toBeTruthy();
            });

            it('should appear when a nested list item is active', () => {
                TestUtil.renderPlain($elem, SideNav, {
                    ...mockDefProps,
                    activeItemIdx: 1,
                    activeChildItemIdx: 0
                });
                assignChildElem();

                expect($2ndItem.querySelector('.icon--arrow-dn')).toBeTruthy();
            });
        });
    });
});