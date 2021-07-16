import { TestUtil } from '../../../asset/ts/test-util';
import { IProps  } from './type';
import { TabSwitch, MSG_PROP_ERR } from '.';

describe('Component - Tab Switch', () => {
    let mockProps: IProps;
    let mockList: Record<string, any>[];
    let mockOnTabActive: jest.Mock;
    let mockOnTabEnable: jest.Mock;

    beforeEach(() => {
        mockOnTabActive = jest.fn();
        mockOnTabEnable = jest.fn();

        mockList = [
            { name: 'a', isEnable: false},
            { name: 'b', isEnable: false},
        ];

        mockProps = {
            id: 'id',
            data: mockList,
            tabEnableKey: 'isEnable',
            onTabActive: mockOnTabActive,
            onTabEnable: mockOnTabEnable,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        let cmp: TabSwitch;

        describe('Getter - list: get either list or transformed list from an object ', () => {
            it('should return the data if data is Array', () => {
                cmp = new TabSwitch(mockProps);
                expect(cmp.list).toBe(mockProps.data);
            });

            it('should throw an error if data is not an array and `dataKeyMap` prop is not provided', () => {
                cmp = new TabSwitch({
                    ...mockProps,
                    data: { lorem: 'sum' }
                });
                expect(() => {
                    console.log(cmp.list);
                }).toThrowError(MSG_PROP_ERR);
            });

            it('should return a transformed list when data is an object `dataKeyMap` prop is provided', () => {
                cmp = new TabSwitch({
                    ...mockProps,
                    tabKey: 'x',
                    tabEnableKey: 'y',
                    data: { lorem: true, sum: false },
                    dataKeyMap: [
                        ['tab-one', 'lorem'],
                        ['tab-two', 'sum'],
                    ]
                });
                expect(cmp.list).toEqual([
                    { x: 'tab-one', y: true },
                    { x: 'tab-two', y: false },
                ]);
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
        let $2ndRdoLabel: HTMLLabelElement;
        let $2ndCbLabel: HTMLLabelElement;

        function getChildElem() {
            $ul = elem.querySelector('ul');
            $li = elem.querySelectorAll('li');

            const $1stInput = $li[0].querySelectorAll('input');
            const $1stLabel = $li[0].querySelectorAll('label');
            const $2ndLabel = $li[1].querySelectorAll('label');

            $1stRdo = $1stInput[0];
            $1stRdoLabel = $1stLabel[0];
            $1stCb = $1stInput[1];
            $1stCbLabel = $1stLabel[1];
            $2ndRdoLabel = $2ndLabel[0];
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
            TestUtil.renderPlain(elem, TabSwitch, {...mockProps, data: []});
            expect(elem.querySelector('ul')).toBeFalsy();
        });

        it('should render id and class when list is passed', () => {
            const mockId: string = mockProps.id;
            TestUtil.renderPlain(elem, TabSwitch, mockProps);
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
            TestUtil.renderPlain(elem, TabSwitch, {...mockProps, activeTabIdx: 1});
            getChildElem();

            expect($li[0].className).toBe(liCls);
            expect($li[1].className).toBe(`${liCls} ${liAtvCls}`);
        });

        it('should trigger callback and update active tab', () => {
            TestUtil.renderPlain(elem, TabSwitch, mockProps);
            getChildElem();
            TestUtil.triggerEvt($2ndRdoLabel, 'click', MouseEvent);

            const [, tab, idx ] = mockOnTabActive.mock.calls[0];
            expect(mockOnTabActive).toHaveBeenCalled();
            expect(tab).toBe(mockList[1]);
            expect(idx).toBe(1);
        });

        it('should trigger tcallback and update the switch status', () => {
            TestUtil.renderPlain(elem, TabSwitch, mockProps);
            getChildElem();
            TestUtil.triggerEvt($2ndCbLabel, 'click', MouseEvent);

            const [, tab, idx ] = mockOnTabEnable.mock.calls[0];
            expect(mockOnTabEnable).toHaveBeenCalled();
            expect(tab).toBe(mockList[1]);
            expect(idx).toBe(1);
        });

    });
});