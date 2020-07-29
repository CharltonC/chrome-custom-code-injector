import { TestUtil } from '../../../asset/ts/test-util/';
import { IProps, headerGrpHandleType } from './type';
import { TableHeader } from './';

describe('Component - TODO: Component Name', () => {
    const mockThRowsCtx: headerGrpHandleType.ICtxTbHeader[][] = [
        [
            { title: 'A', sortKey: 'name', rowSpan: 2 },
            { title: 'B', sortKey: 'age' },
        ],
        [
            { title: 'C' },
        ],
    ];
    const mockSortBtnPropsFn: jest.Mock = jest.fn();
    const mockProps: IProps = {
        thRowsContext: mockThRowsCtx,
        sortBtnProps: mockSortBtnPropsFn
    };
    const mockSortBtnProps = { isAsc: true };
    let $elem: HTMLElement;
    let $th: HTMLElement;
    let $tr: NodeListOf<HTMLElement>;

    function syncChildElem() {
        $th = $elem.querySelector('thead');
        $tr = $elem.querySelectorAll('tr');
    }

    beforeEach(() => {
        mockSortBtnPropsFn.mockReturnValue(mockSortBtnProps);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        $elem = TestUtil.setupElem('table');
        TestUtil.renderPlain($elem, TableHeader, mockProps);
        syncChildElem();
    });

    afterEach(() => {
        TestUtil.teardown($elem);
        $elem = null;
    });

    it('should render', () => {
        expect($th.className).toBe('kz-datagrid__head');
        expect($tr.length).toBe(2);
        expect($tr[0].querySelectorAll('th').length).toBe(2);
        expect($tr[1].querySelectorAll('th').length).toBe(1);
        expect($tr[0].querySelector('th').rowSpan).toBe(mockThRowsCtx[0][0].rowSpan);
        expect(mockSortBtnPropsFn.mock.calls).toEqual([
            [mockThRowsCtx[0][0].sortKey],
            [mockThRowsCtx[0][1].sortKey]
        ]);
    });
});

