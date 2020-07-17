import { TestUtil } from '../../../asset/ts/test-util';
import { IProps, ITabItem  } from './type';
import { _TabSwitch, TabSwitch } from './';

describe('Component - Tab Switch', () => {
    const mockBaseProps: IProps = {id: 'id', list: []};
    let mockListProps: IProps;
    let mockList: ITabItem[];
    let tabSwitch: _TabSwitch;
    let spyOnRdoChecked: jest.SpyInstance;
    let spyOnCbChanged: jest.SpyInstance;
    let spySetState: jest.SpyInstance;
    let spyGetInitialState: jest.SpyInstance;

    beforeEach(() => {
        mockList = [
            { name: 'a', isEnable: false},
            { name: 'b', isEnable: false},
        ];
        mockListProps = {...mockBaseProps, list: mockList};

        spyOnRdoChecked = jest.spyOn(_TabSwitch.prototype, 'onRdoChecked');
        spyOnCbChanged = jest.spyOn(_TabSwitch.prototype, 'onCheckboxChanged');
        spySetState = jest.spyOn(_TabSwitch.prototype, 'setState');
        spyGetInitialState = jest.spyOn(_TabSwitch.prototype, 'getInitialState');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        describe('Constructor', () => {
            it('should initialize', () => {
                const mockInitialState: any = {};
                spyGetInitialState.mockReturnValue(mockInitialState);
                tabSwitch = new _TabSwitch(mockBaseProps);

                expect(spyGetInitialState).toHaveBeenCalledWith(mockBaseProps.list, undefined);
                expect(tabSwitch.state).toBe(mockInitialState);
            });
        });

        describe('Method - getIntiialState', () => {
            beforeEach(() => {
                tabSwitch = new _TabSwitch(mockBaseProps);
            });

            it('should get initial state when list is not provided', () => {
                expect(tabSwitch.getInitialState(undefined, undefined)).toEqual({
                    hsList: false,
                    hsAtvIdx: false,
                    activeTab: null
                });

                expect(tabSwitch.getInitialState([], undefined)).toEqual({
                    hsList: false,
                    hsAtvIdx: false,
                    activeTab: null
                });

                expect(tabSwitch.getInitialState([], 0)).toEqual({
                    hsList: false,
                    hsAtvIdx: false,
                    activeTab: null
                });
            });

            it('should get initial state when list is provided', () => {
                expect(tabSwitch.getInitialState(mockList, undefined)).toEqual({
                    hsList: true,
                    hsAtvIdx: false,
                    activeTab: mockList[0]
                });

                expect(tabSwitch.getInitialState(mockList, 99)).toEqual({
                    hsList: true,
                    hsAtvIdx: false,
                    activeTab: mockList[0]
                });

                expect(tabSwitch.getInitialState(mockList, 1)).toEqual({
                    hsList: true,
                    hsAtvIdx: true,
                    activeTab: mockList[1]
                });
            });
        });

        describe('Method - onRdoChecked', () => {
            const mockEvt: any = {};
            let mockCheckedTabIdx: number;
            let mockCheckedTab: ITabItem;

            beforeEach(() => {
                spySetState.mockImplementation(() => {});
            });

            it('should not update state if tab is currently active', () => {
                mockCheckedTabIdx = 0;
                mockCheckedTab = mockList[mockCheckedTabIdx];
                tabSwitch = new _TabSwitch(mockListProps);
                tabSwitch.onRdoChecked(mockEvt, mockCheckedTab, mockCheckedTabIdx);

                expect(spySetState).not.toHaveBeenCalled();
            });

            it('should update state if tab is not currently active', () => {
                mockCheckedTabIdx = 1;
                mockCheckedTab = mockList[mockCheckedTabIdx];
                tabSwitch = new _TabSwitch(mockListProps);
                tabSwitch.onRdoChecked(mockEvt, mockCheckedTab, mockCheckedTabIdx);

                expect(spySetState).toHaveBeenCalledWith({activeTab: mockCheckedTab});
            });

            it('should call the passed callback if provided', () => {
                const mockOnTabAtv: jest.Mock = jest.fn();
                mockCheckedTabIdx = 1;
                mockCheckedTab = mockList[mockCheckedTabIdx];
                tabSwitch = new _TabSwitch({...mockListProps, onTabActive: mockOnTabAtv});
                tabSwitch.onRdoChecked(mockEvt, mockCheckedTab, mockCheckedTabIdx);

                expect(mockOnTabAtv).toHaveBeenCalledWith({
                    evt: mockEvt,
                    activeTab: mockCheckedTab,
                    idx: mockCheckedTabIdx,
                    isActive: false
                });
            });
        });

        describe('Method - onCheckboxChanged', () => {
            const mockOnTabEnable: jest.Mock = jest.fn();
            const mockEvt: any = {};
            const mockEnabledTabIdx: number = 0;

            it('should call the passed callback if provided', () => {
                const mockEnabledTab: ITabItem = mockList[mockEnabledTabIdx];
                const mockEnabledTabEnable: boolean = !mockEnabledTab.isEnable;

                tabSwitch = new _TabSwitch({...mockListProps, onTabEnable: mockOnTabEnable});
                tabSwitch.onCheckboxChanged(mockEvt, mockEnabledTab, mockEnabledTabIdx);

                expect(mockOnTabEnable).toHaveBeenCalledWith({
                    evt: mockEvt,
                    tab: mockEnabledTab,
                    idx: mockEnabledTabIdx,
                    isEnable: mockEnabledTabEnable,
                    isActive: true
                });
            });
        });
    });

    describe('Render/DOM', () => {
        const ulCls: string = 'tab-switch';
        const liCls: string = `${ulCls}__item`;
        const liAtvCls: string = `${liCls}--active`;
        let elem: HTMLElement;
        let $ul: HTMLElement;
        let $li: NodeListOf<HTMLElement>;
        let $1stRdo: HTMLInputElement;
        let $1stRdoLabel: HTMLLabelElement;
        let $1stCb: HTMLInputElement;
        let $1stCbLabel: HTMLLabelElement;
        let $2ndRdo: HTMLInputElement;
        let $2ndRdoLabel: HTMLLabelElement;
        let $2ndCb: HTMLInputElement;
        let $2ndCbLabel: HTMLLabelElement;

        function getChildElem() {
            $ul = elem.querySelector('ul');
            $li = elem.querySelectorAll('li');

            const $1stInput = $li[0].querySelectorAll('input');
            const $1stLabel = $li[0].querySelectorAll('label');
            const $2ndInput = $li[1].querySelectorAll('input');
            const $2ndLabel = $li[1].querySelectorAll('label');

            $1stRdo = $1stInput[0];
            $1stRdoLabel = $1stLabel[0];
            $1stCb = $1stInput[1];
            $1stCbLabel = $1stLabel[1];

            $2ndRdo = $2ndInput[0];
            $2ndRdoLabel = $2ndLabel[0];
            $2ndCb = $2ndInput[1];
            $2ndCbLabel = $2ndLabel[1];
        }

        beforeEach(() => {
            elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown(elem);
            elem = null;
        });

        it('should not render if empty-list is passed', () => {
            TestUtil.renderPlain(elem, TabSwitch, mockBaseProps);
            expect(elem.querySelector('ul')).toBeFalsy();
        });

        it('should render id and class when list is passed', () => {
            const mockId: string = mockBaseProps.id;
            TestUtil.renderPlain(elem, TabSwitch, mockListProps);
            getChildElem();

            expect($ul.className).toBe(ulCls);
            expect($li.length).toBe(2);
            expect($li[0].className).toBe(`${liCls} ${liAtvCls}`);
            expect($li[1].className).toBe(liCls);
            expect($1stRdo.name).toBe(mockId);
            expect($1stRdo.id).toBe(`rdo-${mockId}-0`);
            expect($1stRdoLabel.getAttribute('for')).toBe(`rdo-${mockId}-0`);
            expect($1stCb.id).toBe(`checkbox-${mockId}-0`);
            expect($1stCbLabel.getAttribute('for')).toBe(`checkbox-${mockId}-0`);
        });

        it('should render id and class when list is passed and active index is passed', () => {
            TestUtil.renderPlain(elem, TabSwitch, {...mockListProps, activeIdx: 1});
            getChildElem();

            expect($li[0].className).toBe(liCls);
            expect($li[1].className).toBe(`${liCls} ${liAtvCls}`);
        });

        it('should trigger the builtin `onRdoChecked` event callback and update active tab', () => {
            TestUtil.renderPlain(elem, TabSwitch, mockListProps);
            getChildElem();
            TestUtil.triggerEvt($2ndRdoLabel, 'click', MouseEvent);

            const callArgs: any[] = spyOnRdoChecked.mock.calls[0];
            expect(spyOnRdoChecked).toHaveBeenCalled();
            expect(callArgs[1]).toBe(mockList[1]);
            expect(callArgs[2]).toBe(1);
            expect($1stRdo.checked).toBe(false);
            expect($li[0].className).toBe(liCls);
            expect($2ndRdo.checked).toBe(true);
            expect($li[1].className).toBe(`${liCls} ${liAtvCls}`);
        });

        it('should trigger the builtin `onCheckboxChanged` event callback and update the switch status', () => {
            TestUtil.renderPlain(elem, TabSwitch, mockListProps);
            getChildElem();
            TestUtil.triggerEvt($2ndCbLabel, 'click', MouseEvent);

            const callArgs: any[] = spyOnCbChanged.mock.calls[0];
            expect(spyOnCbChanged).toHaveBeenCalled();
            expect(callArgs[1]).toBe(mockList[1]);
            expect(callArgs[2]).toBe(1);
            expect($2ndCb.checked).toBe(true);
        });

    });
});