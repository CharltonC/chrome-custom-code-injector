import { TestUtil } from '../../../asset/ts/test-util';
import { IProps, THeadContext, TThSpanProps } from './type';
import { GridHeader } from '.';

describe('Component - Grid Header', () => {
    const mockHeaderRowsCtx: THeadContext[][] = [
        [
            { title: 'A', sortKey: 'name', rowSpan: 2 },
            { title: 'B', sortKey: 'age' },
        ], [
            { title: 'C' },
        ],
    ];

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Parse Header Col/Row Span Props', () => {
        const { parseSpanProps } = GridHeader.prototype;

        it('should return empty object if props doesnt exist', () => {
            expect(parseSpanProps(null, true)).toEqual({});
        });

        it('should return itself if it is a table', () => {
            const mockHeaderSpanProps: TThSpanProps = { rowSpan: 1, colSpan: 1};
            expect(parseSpanProps(mockHeaderSpanProps, true)).toEqual(mockHeaderSpanProps);
        });

        it('should return parsed props for list header if it is a list', () => {
            const mockHeaderSpanProps: TThSpanProps = { rowSpan: 1, colSpan: 1};
            expect(parseSpanProps(mockHeaderSpanProps, false)).toEqual({
                'data-colspan': 1,
                'data-rowspan': 1
            });
        });
    });

    describe('Render', () => {
        const mockSortBtnPropsFn: jest.Mock = jest.fn();
        const mockProps: IProps = {
            rowsContext: mockHeaderRowsCtx,
            sortBtnProps: mockSortBtnPropsFn
        };
        const mockSortBtnProps = { isAsc: true };
        let $elem: HTMLElement;
        let $head: HTMLElement;
        let $row: NodeListOf<HTMLElement>;

        beforeEach(() => {
            mockSortBtnPropsFn.mockReturnValue(mockSortBtnProps);
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        describe('Table Header', () => {
            function syncChildElem() {
                $head = $elem.querySelector('thead');
                $row = $elem.querySelectorAll('tr');
            }

            beforeEach(() => {
                $elem = TestUtil.setupElem('table');
                TestUtil.renderPlain($elem, GridHeader, { ...mockProps, table: true });
                syncChildElem();
            });

            it('should render', () => {
                expect($head.className).toBe('kz-datagrid__head');
                expect($row.length).toBe(2);
                expect($row[0].querySelectorAll('th').length).toBe(2);
                expect($row[1].querySelectorAll('th').length).toBe(1);
                expect($row[0].querySelector('th').rowSpan).toBe(mockHeaderRowsCtx[0][0].rowSpan);
                expect(mockSortBtnPropsFn.mock.calls).toEqual([
                    [mockHeaderRowsCtx[0][0].sortKey],
                    [mockHeaderRowsCtx[0][1].sortKey]
                ]);
            });
        });

        describe('List Header', () => {
            function syncChildElem() {
                $head = $elem.querySelector('ul');
                $row = $elem.querySelectorAll('li');
            }

            beforeEach(() => {
                $elem = TestUtil.setupElem('div');
                TestUtil.renderPlain($elem, GridHeader, { ...mockProps, table: false });
                syncChildElem();
            });

            it('should render', () => {
                expect($head.className).toBe('kz-datagrid__head');
                expect($row.length).toBe(2);
                expect($row[0].querySelectorAll('div').length).toBe(2);
                expect($row[1].querySelectorAll('div').length).toBe(1);
                expect($row[0].querySelector('div').getAttribute('data-rowspan')).toBe(`${mockHeaderRowsCtx[0][0].rowSpan}`);
                expect(mockSortBtnPropsFn.mock.calls).toEqual([
                    [mockHeaderRowsCtx[0][0].sortKey],
                    [mockHeaderRowsCtx[0][1].sortKey]
                ]);
            });
        });
    });
});

