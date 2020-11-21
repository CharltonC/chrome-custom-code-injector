import React, { ReactElement } from 'react';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { GridHeader } from '.';

describe('Component - Grid Header', () => {
    const MOCK_TEXT = 'mockth';
    const mockThTitleElem: ReactElement = <span className="mock-th">{MOCK_TEXT}</span>;
    let spy: TMethodSpy<GridHeader>;
    let mockSortBtnProps: jest.Mock;
    let $elem: HTMLElement;
    let $rows: NodeListOf<HTMLElement>;

    beforeEach(() => {
        mockSortBtnProps = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        if (!$elem) return;
        TestUtil.teardown($elem);
        $elem = null;
    });

    describe('Render Table Header', () => {
        let $1stRowCells;
        let $2ndRowCells;

        beforeEach(() => {
            $elem = TestUtil.setupElem('table');
            TestUtil.renderPlain($elem, GridHeader, {
                type: 'table',
                sortBtnProps: mockSortBtnProps,
                rows: {
                    rowTotal: 1,
                    colTotal: 1,
                    headers: [
                        [
                            { title: 'A', sortKey: 'name', rowSpan: 2 },
                            { title: 'B', sortKey: 'age' },
                        ], [
                            { title: mockThTitleElem },
                        ]
                    ]
                }
            });
            $rows = $elem.querySelectorAll('tr');
            $1stRowCells = $rows[0].querySelectorAll('th');
            $2ndRowCells = $rows[1].querySelectorAll('th');
        });

        it('should render correct number of cells', () => {
            expect($rows.length).toBe(2);
            expect($1stRowCells.length).toBe(2);
            expect($1stRowCells[0].rowSpan).toBe(2);
            expect($2ndRowCells.length).toBe(1);
        });

        it('should render header cell title', () => {
            expect($1stRowCells[0].textContent).toBe('A');
            expect($1stRowCells[1].textContent).toBe('B');
            expect($2ndRowCells[0].textContent).toBe(MOCK_TEXT);
        });

        it('should call the sort button props function `sortBtnProps`', () => {
            expect(mockSortBtnProps.mock.calls).toEqual([ ['name'], ['age'] ]);
        });
    });

    describe('Render List Header', () => {
        let $1stRowCell;
        let $3rdRowCell;

        beforeEach(() => {
            spy = TestUtil.spyProtoMethods(GridHeader);
            spy.getCssGridVar.mockReturnValue({});

            $elem = TestUtil.setupElem('div');
            TestUtil.renderPlain($elem, GridHeader, {
                type: 'list',
                sortBtnProps: mockSortBtnProps,
                rows: {
                    rowTotal: 1,
                    colTotal: 1,
                    gridTemplateRows: '1',
                    gridTemplateColumns: '1',
                    headers: [
                        { title: 'A', sortKey: 'name', rowSpan: 2 },
                        { title: 'B', sortKey: 'age' },
                        { title: mockThTitleElem },
                    ]
                }
            });
            $rows = $elem.querySelectorAll('li');
            $1stRowCell = $rows[0];
            $3rdRowCell = $rows[2];
        });

        it('should render correct number of cells', () => {
            expect($rows.length).toBe(3);
        });

        it('should call the sort button props function `sortBtnProps`', () => {
            expect(mockSortBtnProps.mock.calls).toEqual([ ['name'], ['age'] ]);
        });

        it('should render header cell title', () => {
            expect($1stRowCell.textContent).toBe('A');
            expect($3rdRowCell.textContent).toBe(MOCK_TEXT);
        });
    });

    describe('Methods', () => {
        let cmp: GridHeader;

        beforeEach(() => {
            cmp = new GridHeader({} as any);
            spy = TestUtil.spyProtoMethods(GridHeader);
        });

        describe('Method - render', () => {
            it('should default to render table when header type is not specified', () => {
                spy.renderTbHeader.mockReturnValue('table');
                spy.renderListHeader.mockReturnValue('list');
                expect(cmp.render()).toBe('table');
            });

            it('should return the css related grid variables object', () => {
                expect(cmp.getCssGridVar({
                    'a': '1',
                    'b': '2'
                })).toEqual({
                    '--a': '1',
                    '--b': '2'
                });
            });
        });

        describe('Method - getCellContent: Get cell content', () => {
            const mockData = [];
            const mockSortKey = 'sum';
            let mockTitle = 'lorem';

            beforeEach(() => {
                mockSortBtnProps.mockReturnValue({});
                Object.assign(cmp.props, {
                    data: mockData,
                    sortBtnProps: mockSortBtnProps
                });
            });

            it('should return cell content when title is a function', () => {
                const mockTitleFn = jest.fn();
                mockTitleFn.mockReturnValue(mockTitle);
                const title = cmp.getCellContent(mockTitleFn, mockSortKey);

                expect(title).toBe(mockTitle);
                expect(mockTitleFn).toHaveBeenCalledWith(mockData, {});
            });

            it('should return cell content when title is react element ', () => {
                const mockTitleElem = <p>{mockTitle}</p>;
                const [ $title ] = cmp.getCellContent(mockTitleElem, mockSortKey).props.children;
                expect($title).toBe(mockTitleElem);
            });

            it('should return cell content when title is string', () => {
                const [ $title ] = cmp.getCellContent(mockTitle, mockSortKey).props.children;
                expect($title.type).toBe('span');
                expect($title.props.children).toBe(mockTitle);
            });
        });
    });
});
