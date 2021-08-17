import { TestUtil } from '../../../asset/ts/test-util';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import PgnHandle from '../../../handle/pagination';
import { AppState } from '../../../model/app-state';
import { createMockAppState } from '../../../mock/state';
import { OptionApp } from '.';

// Mock the CodeMirror Edit component to prevent errors thrown during test due to the test is not within exact browser cotnext
jest.mock('react-codemirror2', () => ({
    UnControlled: () => '<div />'
}));

describe('Component - Option App (E2E)', () => {
    const selector = {
        modal: {
            CONFIRM_BTN: '.modal__footer button[type="submit"]',
            PATH_TITLE_INPUT: '#path-title',
            PATH_VALUE_INPUT: '#path-url'
        },
        listView: {
            SEARCH_INPUT: '.search__input',
            SEARCH_CLEAR_BTN: '.search__clear',
            PGN_RECORD: '.paginate__record',

            HEAD_ROW: '.datagrid__head tr',
            SELECT_ALL: `th:nth-child(1) input`,
            DEL_ALL_BTN: 'th:nth-child(10) button',

            ROWS: '.datagrid__body--root > tr',
            SUB_ROWS: '.datagrid__body--nested-1 tbody > tr',

            SELECT: `td:nth-child(1) input`,
            TITLE: 'td:nth-child(2) .datagrid__cell--id',
            HOST_BADGE: 'td:nth-child(2) .badge',
            ADDRESS: 'td:nth-child(3) .datagrid__cell--addr',
            EXPD_BTN: 'td:nth-child(2) .icon-btn',
            HTTPS_SWITCH: 'td:nth-child(3) .icon-switch[for*="https"] input',
            EXACT_MATCH_SWITCH: 'td:nth-child(3) .icon-switch[for*="exact"] input',
            CODE_EXEC_SELECT: 'td:nth-child(4) .dropdown__select--cell',
            JS_SWITCH: 'td:nth-child(5) input',
            CSS_SWITCH: 'td:nth-child(6) input',
            LIB_SWITCH: 'td:nth-child(7) input',
            ADD_BTN: 'td:nth-child(8) button',
            EDIT_BTN: 'td:nth-child(9) button',
            DEL_BTN: 'td:nth-child(10) button',
        },
        editView: {
            ACTIVE_HOST: `.side-nav__item--parent.side-nav__item--atv .side-nav__item-header .side-nav__title`,
            ACTIVE_HOST_BADGE: `.side-nav__item--parent.side-nav__item--atv .side-nav__item-header .badge`,
            ACTIVE_PATH: '.side-nav__item--child.side-nav__item--atv .side-nav__title',
            TITLE_INPUT: '#edit-target-id',
            VALUE_INPUT: '#edit-target-value',
            HTTPS_SWITCH: '#https-switch',
            EXACT_SWITCH: '#regex-switch',
            JS_EXEC_SELECT: '#js-execution',
            JS_TAB: '#rdo-tab-switch-0',
            JS_SWITCH: '@checkbox-tab-switch-0',
            CSS_TAB: '#rdo-tab-switch-1',
            CSS_SWITCH: '@checkbox-tab-switch-1',
            LIB_TAB: '#rdo-tab-switch-2',
            LIB_SWITCH: '@checkbox-tab-switch-2',
        }
    };

    let $elem: HTMLElement;
    let mockAppState: AppState;

    beforeEach(() => {
        $elem = TestUtil.setupElem();
        mockAppState = createMockAppState();    // 4 rows w/ 3 sub rows for each row
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('List View - Row CRUD', () => {
        const { listView, modal } = selector;

        function getElem() {
            const pgnRecordTxt = $elem.querySelector(listView.PGN_RECORD).textContent;
            const pgnRecordTxtTotal = pgnRecordTxt.length;

            return {
                totalRows: Number(pgnRecordTxt.slice(pgnRecordTxtTotal - 1, pgnRecordTxtTotal)),
                $searchInput: $elem.querySelector(listView.SEARCH_INPUT) as HTMLInputElement,
                $searchClear: $elem.querySelector(listView.SEARCH_CLEAR_BTN) as HTMLButtonElement,
                $header: $elem.querySelector(listView.HEAD_ROW) as HTMLElement,
                $rows: $elem.querySelectorAll(listView.ROWS) as NodeListOf<HTMLElement>,
                $subRows: $elem.querySelectorAll(listView.SUB_ROWS) as NodeListOf<HTMLElement>
            };
        }

        function getCellElem($row: HTMLElement, isTh: boolean = false) {
            return {
                $select: $row.querySelector(
                    isTh ? listView.SELECT_ALL : listView.SELECT
                ) as HTMLInputElement,
                $expd: $row.querySelector(listView.EXPD_BTN) as HTMLButtonElement,
                $badge: $row.querySelector(listView.HOST_BADGE) as HTMLElement,
                $del: $row.querySelector(
                    isTh ? listView.DEL_ALL_BTN : listView.DEL_BTN
                ) as HTMLButtonElement,
            };
        }

        function getRowCol(rowIdx: number, isPrimaryRow: boolean = true) {
            const $rows = $elem.querySelectorAll(listView.ROWS) as NodeListOf<HTMLElement>;
            const $subRows = $elem.querySelectorAll(listView.SUB_ROWS) as NodeListOf<HTMLElement>
            const $row = isPrimaryRow ? $rows[rowIdx] : $subRows[rowIdx];

            return {
                $rows,
                $subRows,
                $row,
                title: $row.querySelector(listView.TITLE).textContent,
                address: $row.querySelector(listView.ADDRESS).textContent,
                $expdToggle: $row.querySelector(listView.EXPD_BTN) as HTMLButtonElement,
                $httpsToggle: $row.querySelector(listView.HTTPS_SWITCH) as HTMLInputElement,
                $exactToggle: $row.querySelector(listView.EXACT_MATCH_SWITCH) as HTMLInputElement,
                $codeExecDropdown: $row.querySelector(listView.CODE_EXEC_SELECT) as HTMLSelectElement,
                $jsToggle: $row.querySelector(listView.JS_SWITCH) as HTMLInputElement,
                $cssToggle: $row.querySelector(listView.CSS_SWITCH) as HTMLInputElement,
                $libToggle: $row.querySelector(listView.LIB_SWITCH) as HTMLInputElement,
                $add: $row.querySelector(listView.ADD_BTN) as HTMLButtonElement,
                $edit: $row.querySelector(listView.EDIT_BTN) as HTMLButtonElement,
            };
        }

        function hsTargetRow($rows: NodeListOf<HTMLElement>, $targetRows: HTMLElement | HTMLElement[]): boolean {
            return !![].some.call($rows, ($row, i) => {
                return Array.isArray($targetRows) ?
                    $targetRows.some(($targetRow, j) => $row === $targetRow) :
                    $row === $targetRows;
            });
        }

        function mockSearch(searchText: string) {
            const { $searchInput } = getElem();
            TestUtil.setInputVal($searchInput, searchText);
            TestUtil.triggerEvt($searchInput, 'change');

            // Mocking debounce fn causes inconsistent testing issue compared to the UI
            // therefore we use timer to deal with `setTimeout` in debounce involved in search
            // jest.runAllTimers();
        }

        describe('Delete Rule(s)', () => {
            jest.useFakeTimers();

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

        describe('Modify Rule', () => {
            let firstRowCol;

            beforeEach(() => {
                TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
                    root: [ mockAppState, new AppStateHandle() ],
                }));

                firstRowCol = getRowCol(0);
            });

            it('should expand/unexpand row', () => {
                const ARW_EXPD_CLS = 'icon-btn--open';
                const { $expdToggle } = firstRowCol;

                TestUtil.triggerEvt($expdToggle , 'click');
                expect($expdToggle.className.includes(ARW_EXPD_CLS)).toBeTruthy();

                TestUtil.triggerEvt($expdToggle , 'click');
                expect($expdToggle.className.includes(ARW_EXPD_CLS)).toBeFalsy();
            });

            it('should toggle https', () => {
                const { $httpsToggle } = firstRowCol;
                TestUtil.triggerEvt($httpsToggle , 'click');

                expect($httpsToggle.checked).toBeTruthy();
            });

            it('should toggle exact match', () => {
                const { $exactToggle } = firstRowCol;
                TestUtil.triggerEvt($exactToggle , 'click');

                expect($exactToggle.checked).toBeTruthy();
            });

            it('should set code execution step', () => {
                const { $codeExecDropdown } = firstRowCol;
                $codeExecDropdown.value = 1;
                TestUtil.triggerEvt($codeExecDropdown, 'change');

                expect($codeExecDropdown.value).toBe('1');
            });

            it('should toggle js', () => {
                const { $jsToggle } = firstRowCol;
                TestUtil.triggerEvt($jsToggle , 'click');

                expect($jsToggle.checked).toBeTruthy();
            });

            it('should toggle css', () => {
                const { $cssToggle } = firstRowCol;
                TestUtil.triggerEvt($cssToggle , 'click');

                expect($cssToggle.checked).toBeTruthy();
            });

            it('should toggle library', () => {
                const { $libToggle } = firstRowCol;
                TestUtil.triggerEvt($libToggle , 'click');

                expect($libToggle.checked).toBeTruthy();
            });

            it('should add host', () => {
                // TODO:
            });

            it('should add path', () => {
                const mockTitle = 'title';
                const mockPath = '/loremsum';

                const { $add, $expdToggle } = firstRowCol;

                TestUtil.triggerEvt($add, 'click');

                const $titleInput = $elem.querySelector(modal.PATH_TITLE_INPUT) as HTMLInputElement;
                const $valueInput = $elem.querySelector(modal.PATH_VALUE_INPUT) as HTMLInputElement;
                const $save = $elem.querySelector(modal.CONFIRM_BTN) as HTMLButtonElement;

                TestUtil.setInputVal($titleInput, mockTitle);
                TestUtil.triggerEvt($titleInput, 'change');

                TestUtil.setInputVal($valueInput, mockPath);
                TestUtil.triggerEvt($valueInput, 'change');

                TestUtil.triggerEvt($save, 'click');
                TestUtil.triggerEvt($expdToggle, 'click');

                const { title, address } = getRowCol(3, false);
                expect(title).toBe(mockTitle);
                expect(address).toBe(mockPath);
            });

            it('should switch to edit mode', () => {
                const { $edit } = firstRowCol;
                TestUtil.triggerEvt($edit, 'click');

                expect($elem.querySelector('.main--edit')).toBeTruthy();
            });
        });
    });

    describe('Edit View', () => {
        beforeEach(() => {
            TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
                root: [ mockAppState, new AppStateHandle() ],
            }));

            // simulateRowEdit();
        });

        // TODO: set target rule as current editable
        // TODO: tab active change
        // TODO: tab on, last active tab (if switch rule)
        // TODO: dropdown
        // TODO: inputs (invalid + valid), https, exact match
        // TODO: Delete Host, Path, all
        // TODO: Back
        // TODO: Add path
        // TODO: Library select, select all, delete all, add library, async/active toggle, set lib type, edit lib
    });
});