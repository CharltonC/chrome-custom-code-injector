import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { GridHeader } from '.';

describe('Component - Grid Header', () => {
    let spy: TMethodSpy<GridHeader>;
    let mockSortBtnProps: jest.Mock;
    let $elem: HTMLElement;
    let $head: HTMLElement;
    let $row: NodeListOf<HTMLElement>;


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
                            { title: 'C' },
                        ]
                    ]
                }
            });
            $head = $elem.querySelector('thead');
            $row = $elem.querySelectorAll('tr');
        });

        it('should render', () => {
            expect($head.className).toContain('kz-datagrid__head--table');
            expect($row.length).toBe(2);
            expect($row[0].querySelectorAll('th').length).toBe(2);
            expect($row[0].querySelector('th').rowSpan).toBe(2);
            expect($row[1].querySelectorAll('th').length).toBe(1);
            expect(mockSortBtnProps.mock.calls).toEqual([ ['name'], ['age'] ]);
        });
    });

    describe('Render List Header', () => {
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
                        { title: 'C' },
                    ]
                }
            });
            $head = $elem.querySelector('ul');
            $row = $elem.querySelectorAll('li');
        });

        it('should render', () => {
            expect($head.className).toContain('kz-datagrid__head--list');
            expect($row.length).toBe(3);
            expect($row[0].querySelectorAll('.sort').length).toBe(0);
            expect(mockSortBtnProps.mock.calls).toEqual([ ['name'], ['age'] ]);
        });
    });

    describe('Methods', () => {
        let cmp: GridHeader;

        beforeEach(() => {
            cmp = new GridHeader({} as any);
            spy = TestUtil.spyProtoMethods(GridHeader);
        });

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
});
