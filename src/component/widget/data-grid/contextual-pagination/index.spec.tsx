import React from 'react';
import { AMethodSpy } from '../../../../asset/ts/test-util/type';
import { TestUtil } from '../../../../asset/ts/test-util';
import { IProps, TPgnHandle } from './type';
import { DataGridPagination } from '.';

jest.mock('../../../base/select-dropdown', () => {
    return {
        _Dropdown: true,
        Dropdown: () => <select />
    };
});

describe('Component - DataGridPagination', () => {
    const CLS_PREFIX: string = 'paginate';
    let spy: AMethodSpy<DataGridPagination>;

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockProps = {} as IProps;
        let cmp: DataGridPagination;

        beforeEach(() => {
            cmp = new DataGridPagination(mockProps);
            spy = TestUtil.spyMethods(cmp);
        });

        describe('Method - getOptionTextPipe: Get Text Tranform Pipe Function for Select Option Content', () => {
            const mockText = 'lorem';
            const mockNum = 123;

            it('should return pipe function for per page select', () => {
                expect(cmp.getOptionTextPipe(true)(mockText)).toBe(`${mockText} Per Page`);
            });

            it('should return pipe function for page select', () => {
                expect(cmp.getOptionTextPipe(false)(mockText)).toBe(`${mockText}`);
                expect(cmp.getOptionTextPipe(false)(mockNum)).toBe(`Page ${mockNum}`);
            });
        });

        describe('Method - getMappedBtnProps: Get Mapped Props for Button Element', () => {
            const mockBtnName = 'lorem';
            const mockBtnAttr: TPgnHandle.ICmpBtnAttr = {
                title: '',
                disabled: true,
                onClick: jest.fn()
            };

            it('should return props', () => {
                expect(cmp.getMappedBtnProps(mockBtnAttr, mockBtnName)).toEqual({
                    type: 'button',
                    className:`${CLS_PREFIX}__btn ${CLS_PREFIX}__btn--${mockBtnName}`,
                    disabled: mockBtnAttr.disabled,
                    onClick: mockBtnAttr.onClick
                });
            });
        });

        describe('Method - getMappedSelectProps: Get Mapped Props for Select Element', () => {
            const mockEvt = { evt: 'lorem' };
            let mockSelectAttr: TPgnHandle.ICmpSelectAttr;
            let onSelectSpy: jest.Mock;
            let mockPipeFn: jest.Mock;

            beforeEach(() => {
                onSelectSpy = jest.fn();
                mockSelectAttr = {
                    title: '',
                    disabled: true,
                    options: [],
                    selectedOptionValue: 1,
                    selectedOptionIdx: 1,
                    onSelect: onSelectSpy
                };
                mockPipeFn = jest.fn();
                spy.getOptionTextPipe.mockReturnValue(mockPipeFn);
            });

            it('should return props for Per Page Select', () => {
                const { onSelect, ...props } = cmp.getMappedSelectProps(mockSelectAttr, true);
                onSelect(mockEvt);

                expect(props).toEqual({
                    clsSuffix: 'perpage',
                    border: true,
                    disabled: mockSelectAttr.disabled,
                    list: mockSelectAttr.options,
                    listTxtTransform: mockPipeFn,
                    selectIdx: mockSelectAttr.selectedOptionIdx,
                });
                expect(spy.getOptionTextPipe).toHaveBeenCalledWith(true);
                expect(onSelectSpy).toHaveBeenCalledWith(mockEvt.evt);
            });

            it('should return props for Page Select', () => {
                const { onSelect, ...props } = cmp.getMappedSelectProps(mockSelectAttr, false);
                onSelect(mockEvt);

                expect(props).toEqual({
                    clsSuffix: 'page',
                    border: true,
                    disabled: mockSelectAttr.disabled,
                    list: mockSelectAttr.options,
                    listTxtTransform: mockPipeFn,
                    selectIdx: mockSelectAttr.selectedOptionIdx,
                });
                expect(onSelectSpy).toHaveBeenCalledWith(mockEvt.evt);
            });
        });
    });

    describe('Render/DOM', () => {
        const mockProps: any = {
            startRecord: 'startRecord',
            endRecord: 'endRecord',
            totalRecord: 'totalRecord',
            firstBtnAttr: 'firstBtnAttr',
            prevBtnAttr: 'prevBtnAttr',
            nextBtnAttr: 'nextBtnAttr',
            lastBtnAttr: 'lastBtnAttr',
            pageSelectAttr: 'pageSelectAttr',
            perPageSelectAttr: 'perPageSelectAttr',
        };
        const mockElemProps = {};
        let $elem: HTMLElement;
        let $div: HTMLElement;
        let $p: HTMLElement;
        let $select:  NodeListOf<HTMLSelectElement>
        let $button: NodeListOf<HTMLButtonElement>;

        function syncChildElem() {
            $div = $elem.querySelector('div');
            $p = $elem.querySelector('p');
            $select = $elem.querySelectorAll('select');
            $button = $elem.querySelectorAll('button');
        }

        beforeEach(() => {
            spy = TestUtil.spyProtoMethods(DataGridPagination);
            spy.getMappedBtnProps.mockReturnValue(mockElemProps);
            spy.getMappedSelectProps.mockReturnValue(mockElemProps);

            $elem = TestUtil.setupElem();
            TestUtil.renderPlain($elem, DataGridPagination, mockProps);
            syncChildElem();
        });

        afterEach(() => {
            $elem = TestUtil.teardown($elem);
        });

        it('should get the props for elements', () => {
            expect(spy.getMappedSelectProps.mock.calls).toEqual([
                [mockProps.perPageSelectAttr, true],
                [mockProps.pageSelectAttr, false]
            ]);

            expect(spy.getMappedBtnProps.mock.calls).toEqual([
                [mockProps.firstBtnAttr, 'first'],
                [mockProps.prevBtnAttr, 'prev'],
                [mockProps.nextBtnAttr, 'next'],
                [mockProps.lastBtnAttr, 'last']
            ]);
        });

        it('should render the class names', () => {
            expect($div.className).toBe(CLS_PREFIX);
            expect($p.className).toBe(`${CLS_PREFIX}__record`);
        });

        it('should render content', () => {
            const { startRecord, endRecord, totalRecord } = mockProps;

            expect($select.length).toBe(2);
            expect($button.length).toBe(4);

            expect($p.textContent).toBe(`Showing ${startRecord} - ${endRecord} of ${totalRecord}`);

            expect($button[0].querySelectorAll('.icon--arrow-lt').length).toBe(2);
            expect($button[1].querySelectorAll('.icon--arrow-lt').length).toBe(1);
            expect($button[2].querySelectorAll('.icon--arrow-rt').length).toBe(1);
            expect($button[3].querySelectorAll('.icon--arrow-rt').length).toBe(2);
        });

    });
});

