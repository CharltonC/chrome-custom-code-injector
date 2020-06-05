import { TestUtil } from '../../../test-util/';
import { IProps, IState, INestList } from './type';
import { _SideNav, SideNav } from './';

describe('Component - Side Nav', () => {
    const mockNullProps: IProps = {list: []};
    const mockDefProps: IProps = {
        list: [
            {id: '1', nestList: [{id: '1a'}, {id: '1b'}]},
            {id: '2', nestList: [{id: '2a'}, {id: '2b'}]}
        ]
    };

    let onClickSpy: jest.SpyInstance;
    let getIntitalStateSpy: jest.SpyInstance;
    let setStateSpy: jest.SpyInstance;

    beforeEach(() => {
        onClickSpy = jest.spyOn(_SideNav.prototype, 'onClick');
        getIntitalStateSpy = jest.spyOn(_SideNav.prototype, 'getIntitalState');
        setStateSpy = jest.spyOn(_SideNav.prototype, 'setState');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockRtnNullState: IState = {atvLsIdx: null, atvNestLsIdx: null};
        const mockRtnDefState: IState = {atvLsIdx: 0, atvNestLsIdx: null};
        let sideNav: _SideNav;

        describe('Constructor', () => {
            it('should init', () => {
                getIntitalStateSpy.mockReturnValue(mockRtnNullState);
                sideNav = new _SideNav(mockNullProps);

                expect(getIntitalStateSpy).toHaveBeenCalledWith(mockNullProps.list);
                expect(sideNav.state).toBe(mockRtnNullState);
            });
        });

        describe('Lifecycle - UNSAFE_componentWillReceiveProps', () => {
            beforeEach(() => {
                setStateSpy.mockImplementation(() => {});
                sideNav = new _SideNav(mockDefProps);
            });

            it('should not update active state if new/passed list is the same', () => {
                sideNav.UNSAFE_componentWillReceiveProps(mockDefProps);

                expect(getIntitalStateSpy).toHaveBeenCalledTimes(1);    // incl. constructor
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should update active state if new/passed list is empty', () => {
                getIntitalStateSpy.mockReturnValue(mockRtnNullState);
                sideNav.UNSAFE_componentWillReceiveProps(mockNullProps);

                expect(getIntitalStateSpy).toHaveBeenCalledWith(mockNullProps.list);
                expect(getIntitalStateSpy).toHaveBeenCalledTimes(2);    // incl. constructor
                expect(setStateSpy).toHaveBeenCalledWith(mockRtnNullState);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should update active state if current active list is in the new/passed list however in a different index', () => {
                // By def. the active index is mockDefProps.list[0], which now should become 1
                const mockNewList: INestList[] = [ {id: '0'}, ...mockDefProps.list ];
                sideNav.UNSAFE_componentWillReceiveProps({list: mockNewList});

                expect(getIntitalStateSpy).toHaveBeenCalledTimes(1);    // incl. constructor
                expect(setStateSpy).toHaveBeenCalledWith({atvLsIdx: 1});
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should not update active state if current active list is in the new/passed list however in a same index', () => {
                // By def. the active index is mockDefProps.list[0], it remains the same
                const mockNewList: INestList[] = [...mockDefProps.list, {id: '0'} ];
                sideNav.UNSAFE_componentWillReceiveProps({list: mockNewList});

                expect(getIntitalStateSpy).toHaveBeenCalledTimes(1);    // incl. constructor
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set 1st list item in the new/passed list as active by default if current active list item OR parent list item of active nested list is in no longer in the new/passed list', () => {
                const mockNewList: INestList[] = [{id: 'a'}, {id: 'b'}];
                getIntitalStateSpy.mockReturnValue(mockRtnNullState);
                sideNav.UNSAFE_componentWillReceiveProps({list: mockNewList});

                expect(getIntitalStateSpy).toHaveBeenCalledWith(mockNewList);
                expect(getIntitalStateSpy).toHaveBeenCalledTimes(2);    // incl. constructor
                expect(setStateSpy).toHaveBeenCalledWith(mockRtnNullState);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('Method - getLisCls', () => {
            const { getLsCls } = _SideNav.prototype;
            const mockCls: string = 'x';

            it('should return class based on the active flag', () => {
                expect(getLsCls(mockCls, true)).toBe(`${mockCls} ${mockCls}--atv`);
                expect(getLsCls(mockCls, false)).toBe(mockCls);
            });
        });

        describe('Method - getInitialState', () => {
            const { getIntitalState } = _SideNav.prototype;
            const mockList: INestList[] = [{id: ''}];

            it('should return initial state when list is not provided or empty', () => {
                expect(getIntitalState(undefined)).toEqual(mockRtnNullState);
                expect(getIntitalState([])).toEqual(mockRtnNullState);
            });

            it('should return initial state when non-empty list is provided', () => {
                expect(getIntitalState(mockList)).toEqual(mockRtnDefState);
            });
        });

        describe('Method - onClick', () => {
            let mockEvt: any;

            beforeEach(() => {
                getIntitalStateSpy.mockReturnValue(mockRtnDefState);
                setStateSpy.mockImplementation(() => {});
                mockEvt = { stopPropagation: jest.fn() };
                sideNav = new _SideNav(mockDefProps);
            });

            it('should stop propagation for event', () => {
                sideNav.onClick(mockEvt, 0);
                expect(mockEvt.stopPropagation).toHaveBeenCalled();
            });

            it('should trigger callback if provided', () => {
                const mockOnAtvListChange: jest.Mock = jest.fn();
                const mockLsIdx: number = 0;
                sideNav = new _SideNav({...mockDefProps, onAtvListChange: mockOnAtvListChange});
                sideNav.onClick(mockEvt, mockLsIdx);

                expect(mockOnAtvListChange).toHaveBeenCalledWith(mockDefProps.list, mockLsIdx, null);
            });

            it('should not set state when parent list item is clicked and it is same as current active parent list item', () => {
                sideNav.onClick(mockEvt, 0);

                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should not set state when nested list item is clicked and it has different parent list item as the current active nested list item', () => {
                const mockNestedLsIdx: number = 0;
                (sideNav.state as any).atvNestLsIdx = mockNestedLsIdx;
                sideNav.onClick(mockEvt, 0, mockNestedLsIdx);

                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set state when parent list item is clicked and it is different to current active parent list item', () => {
                const mockAtvLsIdx: number = 1;
                sideNav.onClick(mockEvt, mockAtvLsIdx);

                expect(setStateSpy).toHaveBeenCalledTimes(1);
                expect(setStateSpy).toHaveBeenCalledWith({
                    atvLsIdx: mockAtvLsIdx,
                    atvNestLsIdx: null
                });
            });

            it('should set state when nested list item is clicked, it has the same parent list item and it is different to the current active nested list item', () => {
                const mockAtvNestedLsIdx: number = 1;
                sideNav = new _SideNav(mockDefProps);
                sideNav.onClick(mockEvt, 0, mockAtvNestedLsIdx);

                expect(setStateSpy).toHaveBeenCalledTimes(1);
                expect(setStateSpy).toHaveBeenCalledWith({
                    atvNestLsIdx: mockAtvNestedLsIdx
                });
            });

        });
    });

    describe('Render/DOM', () => {
        let $elem: HTMLElement;
        let $nav: HTMLElement;
        let $list: HTMLElement;
        let $listItems: NodeListOf<HTMLElement>;
        let $nestLists: NodeListOf<HTMLElement>;
        let $nestListItems: NodeListOf<HTMLElement>;

        function assignChildElem() {
            $nav = $elem.children[0] as HTMLElement;
            $list = $elem.querySelector('nav > ul');
            $listItems = $elem.querySelectorAll('nav > ul > li');
            $nestLists = $elem.querySelectorAll('nav li > ul');
            $nestListItems = $elem.querySelectorAll('nav li > ul > li');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
            TestUtil.renderPlain($elem, SideNav, mockDefProps);
            assignChildElem();
        });


        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it('should render the 1st list item as active by default', () => {
            expect($listItems[0].className).toContain('side-nav__ls-item--atv');
            expect($listItems[0].querySelector('.side-nav__title').textContent).toBe(mockDefProps.list[0].id);
            expect($listItems[0].querySelector('.icon--arrow-dn')).toBeTruthy();
            expect($listItems[0].querySelector('.icon--arrow-rt')).toBeFalsy();
            expect($listItems[0].querySelector('.badge').textContent).toBe('2');
            expect($listItems[0].querySelector('ul').style.maxHeight).toBe('320px');
            expect($listItems[1].querySelector('ul').style.maxHeight).toBe('0');
        });

        it('should only render the current active/1st list item`s nested list items', () => {
            expect($nestLists.length).toBe(2);
            expect($nestListItems.length).toBe(2);
            expect($listItems[0].querySelectorAll('li').length).toBe(2);
            expect($listItems[1].querySelectorAll('li').length).toBe(0);
        });

        it('should make the clicked list item active if it`s not active', () => {
            TestUtil.triggerEvt($listItems[1], 'click');
            assignChildElem();

            expect(onClickSpy).toHaveBeenCalled();
            expect(onClickSpy.mock.calls[0][1]).toBe(1);

            expect($listItems[1].className).toContain('side-nav__ls-item--atv');
            expect($listItems[1].querySelector('.icon--arrow-dn')).toBeTruthy();
            expect($listItems[1].querySelector('.icon--arrow-rt')).toBeFalsy();
            expect($listItems[1].querySelector('ul').style.maxHeight).toBe('320px');
            expect($listItems[0].querySelector('ul').style.maxHeight).toBe('0');
            expect($listItems[0].querySelectorAll('li').length).toBe(0);
        });

        it('should make the clicked nested list item active if it`s not active', () => {
            TestUtil.triggerEvt($nestListItems[1], 'click');
            assignChildElem();

            const onClickSpyArgs = onClickSpy.mock.calls[0];
            expect(onClickSpy).toHaveBeenCalled();
            expect(onClickSpyArgs[1]).toBe(0);
            expect(onClickSpyArgs[2]).toBe(1);

            expect($nestListItems[1].className).toContain('side-nav__nls-item--atv');
            expect($listItems[0].className).toBe('side-nav__ls-item');
            expect($listItems[0].querySelector('.icon--arrow-dn')).toBeTruthy();
            expect($listItems[0].querySelector('.icon--arrow-rt')).toBeFalsy();
            expect($listItems[0].querySelector('ul').style.maxHeight).toBe('320px');
            expect($listItems[1].querySelector('ul').style.maxHeight).toBe('0');
            expect($listItems[1].querySelectorAll('li').length).toBe(0);
        });
    });
});

