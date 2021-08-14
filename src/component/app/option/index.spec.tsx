import { TestUtil } from '../../../asset/ts/test-util';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import { AppState } from '../../../model/app-state';
import { createMockAppState } from '../../../mock/state';
import { OptionApp } from '.';
import PgnHandle from '../../../handle/pagination';

describe('Component - Option App (UI/E2E)', () => {
    let $elem: HTMLElement;
    let mockAppState: AppState;

    function getElem() {
        const pgnRecordTxt = $elem.querySelector('.paginate__record').textContent;
        const pgnRecordTxtTotal = pgnRecordTxt.length;

        return {
            totalRows: Number(pgnRecordTxt.slice(pgnRecordTxtTotal - 1, pgnRecordTxtTotal)),
            $searchInput: $elem.querySelector('.search__input') as HTMLInputElement,
            $searchClear: $elem.querySelector('.search__clear') as HTMLButtonElement,
            $header: $elem.querySelector('.datagrid__head tr') as HTMLElement,
            $rows: $elem.querySelectorAll('.datagrid__body--root > tr') as NodeListOf<HTMLElement>,
            $subRows: $elem.querySelectorAll('.datagrid__body--nested-1 tbody > tr') as NodeListOf<HTMLElement>
        };
    }

    function getCellElem($row: HTMLElement, isTh: boolean = false) {
        const tag = isTh ? 'th' : 'td';
        return {
            $select: $row.querySelector(`${tag}:nth-child(1) input`) as HTMLInputElement,
            $expd: $row.querySelector('td:nth-child(2) button') as HTMLButtonElement,
            $badge: $row.querySelector('td:nth-child(2) .badge') as HTMLElement,
            $del: $row.querySelector(`${tag}:nth-child(10) button`) as HTMLButtonElement,
        };
    }

    function hsTargetRow($rows: NodeListOf<HTMLElement>, $targetRows: HTMLElement | HTMLElement[]): boolean {
        return !![].some.call($rows, ($row, i) => {
            return Array.isArray($targetRows) ?
                $targetRows.some(($targetRow, j) => $row === $targetRow) :
                $row === $targetRows;
        });
    }

    jest.useFakeTimers();

    beforeEach(() => {
        $elem = TestUtil.setupElem();
        mockAppState = createMockAppState();    // 4 rows w/ 3 sub rows for each row
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('List View - Row CRUD', () => {
        describe('Delete Row', () => {
            function mockSearch(searchText: string) {
                const { $searchInput } = getElem();
                TestUtil.setInputVal($searchInput, searchText);
                TestUtil.triggerEvt($searchInput, 'change');

                // Mocking debounce fn causes inconsistent testing issue compared to the UI
                // therefore we use timer to deal with `setTimeout` in debounce involved in search
                // jest.runAllTimers();
            }

            beforeEach(() => {
                // Turn off modal so it wont popup
                mockAppState.setting.showDeleteModal = false;

                // Default sort is the ID column in ASC order
                // mockAppState.localState.sortOption = {
                //     key: 'id',
                //     isAsc: true
                // };
            });

            describe('Non-searched + Non-paginated', () => {
                beforeEach(() => {
                    TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
                        root: [ mockAppState, new AppStateHandle() ],
                    }));
                });

                it('should have 4 displayed rows of total 4 rows', () => {
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(4);
                    expect($rows.length).toBe(4);
                });

                it('should delete single row', () => {
                    const $targetRow = getElem().$rows[0];
                    TestUtil.triggerEvt(getCellElem($targetRow).$del, 'click');
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(3);
                    expect($rows.length).toBe(3);
                    expect(hsTargetRow($rows, $targetRow)).toBeFalsy();
                });

                it('should delete single sub row (path)', () => {
                    // Expand the sub row fist
                    const $row = getElem().$rows[0];
                    const { $expd } = getCellElem($row);
                    TestUtil.triggerEvt($expd, 'click');

                    // Delete the sub row
                    const { $subRows } = getElem();
                    const $targetSubRow = $subRows[0];
                    TestUtil.triggerEvt(getCellElem($targetSubRow).$del, 'click');
                    const { $subRows: $modSubRows, totalRows } = getElem();

                    expect(totalRows).toBe(4);
                    expect($modSubRows.length).toBe(2);
                    expect(hsTargetRow($modSubRows, $targetSubRow)).toBeFalsy();
                });

                it('should delete multiple partial rows', () => {
                    // Expand the sub row fist
                    const { $header, $rows } = getElem();
                    TestUtil.triggerEvt(getCellElem($rows[0]).$select, 'click');
                    TestUtil.triggerEvt(getCellElem($rows[1]).$select, 'click');
                    TestUtil.triggerEvt(getCellElem($header, true).$del, 'click');
                    const { $rows: $modRows, totalRows } = getElem();

                    expect(totalRows).toBe(2);
                    expect($modRows.length).toBe(2);
                    expect(hsTargetRow($modRows, [$rows[0], $rows[1]])).toBeFalsy();
                });

                it('should delete all rows', () => {
                    const { $select, $del } = getCellElem(getElem().$header, true);
                    TestUtil.triggerEvt($select, 'click');
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(0);
                    expect($rows.length).toBeFalsy();
                });
            });

            describe('Non-searched + Paginated', () => {
                beforeEach(() => {
                    // Mock both pagination option and state
                    const { rules, localState } = mockAppState;
                    const { dataGrid } = localState.listView;
                    dataGrid.pgnOption.increment = [ 2 ];    // 2 per page,
                    dataGrid.pgnState = new PgnHandle().getState(rules.length, dataGrid.pgnOption);

                    TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
                        root: [ mockAppState, new AppStateHandle() ],
                    }));
                });

                it('should have 2 displayed rows of total 4 rows', () => {
                    const { $rows, totalRows } = getElem();
                    expect($rows.length).toBe(2);
                    expect(totalRows).toBe(4);
                });

                it('should delete single row', () => {
                    const $targetRow = getElem().$rows[0];
                    TestUtil.triggerEvt(getCellElem($targetRow).$del, 'click');
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(3);
                    expect($rows.length).toBe(2);
                    expect(hsTargetRow($rows, $targetRow)).toBeFalsy();
                });

                it('should delete single sub row (path)', () => {
                    // Expand the sub row fist
                    const $row = getElem().$rows[0];
                    const { $expd } = getCellElem($row);
                    TestUtil.triggerEvt($expd, 'click');

                    // Delete the sub row
                    const { $subRows } = getElem();
                    const $targetSubRow = $subRows[0];
                    TestUtil.triggerEvt(getCellElem($targetSubRow).$del, 'click');
                    const { $subRows: $modSubRows, totalRows } = getElem();

                    expect(totalRows).toBe(4);
                    expect($modSubRows.length).toBe(2);
                    expect(hsTargetRow($modSubRows, $targetSubRow)).toBeFalsy();
                });

                it('should delete multiple partial rows', () => {
                    const { $header, $rows } = getElem();
                    TestUtil.triggerEvt(getCellElem($rows[0]).$select, 'click');
                    TestUtil.triggerEvt(getCellElem($header, true).$del, 'click');
                    const { $rows: $modRows, totalRows } = getElem();

                    expect(totalRows).toBe(3);
                    expect($modRows.length).toBe(2);        // 1st page has been replaced with 2 remianing rows
                    expect(hsTargetRow($modRows, $rows[0])).toBeFalsy();
                });

                it('should delete all rows', () => {
                    const { $select, $del } = getCellElem(getElem().$header, true);
                    TestUtil.triggerEvt($select, 'click');
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(2);
                    expect($rows.length).toBe(2);            // 1st page has been replaced with 2 remianing rows
                });
            });

            describe('Searched + Non-paginated', () => {
                beforeEach(() => {
                    TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
                        root: [ mockAppState, new AppStateHandle() ],
                    }));

                    mockSearch('ebay');
                });

                it('should delete all rows for search', () => {
                    const $targetRow = getElem().$rows[0];
                    const { $select, $del } = getCellElem(getElem().$header, true);
                    TestUtil.triggerEvt($select, 'click');
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows } = getElem();

                    expect($rows.length).toBe(0);
                    expect(totalRows).toBe(0);
                    expect(hsTargetRow($rows, $targetRow)).toBeFalsy();

                    // Clear the search
                    mockSearch('');
                    const { $rows: $newRows, totalRows: newTotalRows } = getElem();
                    expect($newRows.length).toBe(3);
                    expect(newTotalRows).toBe(3);
                });
            });

            describe('Searched + Paginated', () => {
                beforeEach(() => {
                    // Mock both pagination option and state
                    const { rules, localState } = mockAppState;
                    const { dataGrid } = localState.listView;
                    dataGrid.pgnOption.increment = [ 2 ];    // 2 per page,
                    dataGrid.pgnState = new PgnHandle().getState(rules.length, dataGrid.pgnOption);

                    TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
                        root: [ mockAppState, new AppStateHandle() ],
                    }));

                    mockSearch('ebay');
                });

                it('should have 1 display row of total 1 row', () => {
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(1);
                    expect($rows.length).toBe(1);
                });

                it('should delete single row and clear the search results', () => {
                    // Delete the search row
                    const $targetRow = getElem().$rows[0];
                    TestUtil.triggerEvt(getCellElem($targetRow).$del, 'click');
                    const { $rows: $searchRows, totalRows: searchTotalRows, $searchClear } = getElem();

                    expect(searchTotalRows).toBe(0);
                    expect($searchRows.length).toBe(0);
                    expect(hsTargetRow($searchRows, $targetRow)).toBeFalsy();

                    // Clear the search
                    TestUtil.triggerEvt($searchClear, 'click');
                    const { $rows, totalRows } = getElem();

                    expect(totalRows).toBe(3);
                    expect($rows.length).toBe(2);
                    expect(hsTargetRow($rows, $targetRow)).toBeFalsy();
                });

                it('should delete single sub row', () => {
                    // Expand the sub row fist
                    const $targetRow = getElem().$rows[0];
                    TestUtil.triggerEvt(getCellElem($targetRow).$expd, 'click');

                    // Delete the sub row
                    const $targetSubRow =  getElem().$subRows[0];
                    TestUtil.triggerEvt(getCellElem($targetSubRow).$del, 'click');
                    const { $subRows, totalRows } = getElem();

                    expect(totalRows).toBe(1);
                    expect($subRows.length).toBe(2);
                    expect(hsTargetRow($subRows, $targetSubRow)).toBeFalsy();
                });

                it('should delete all rows', () => {
                    const $targetRow = getElem().$rows[0];

                    // Select All & Delete
                    const { $select, $del } = getCellElem(getElem().$header, true);
                    TestUtil.triggerEvt($select, 'click');
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows } = getElem();

                    expect($rows.length).toBe(0);
                    expect(totalRows).toBe(0);
                    expect(hsTargetRow($rows, $targetRow)).toBeFalsy();
                });
            });
        });
    });
});