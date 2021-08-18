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
    const modal = {
        CONFIRM_BTN: '.modal__footer button[type="submit"]',
        HOST_TITLE_INPUT: '#host-title',
        HOST_VALUE_INPUT: '#host-value',
        PATH_TITLE_INPUT: '#path-title',
        PATH_VALUE_INPUT: '#path-url',
        LIB_TITLE_INPUT: '#lib-add-title',
        LIB_VALUE_INPUT: '#lib-add-value'
    };
    const listView = {
        MAIN: '.main--list',

        SEARCH_INPUT: '.search__input',
        SEARCH_CLEAR_BTN: '.search__clear',
        PGN_RECORD: '.paginate__record',

        HEAD_ROW: '.datagrid__head tr',
        SELECT_ALL: `th:nth-child(1) input`,
        ADD_HOST_BTN: 'th:nth-child(8) button',
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
        CODE_EXEC_SELECT: 'td:nth-child(4) select',
        JS_SWITCH: 'td:nth-child(5) input',
        CSS_SWITCH: 'td:nth-child(6) input',
        LIB_SWITCH: 'td:nth-child(7) input',
        ADD_BTN: 'td:nth-child(8) button',
        EDIT_BTN: 'td:nth-child(9) button',
        DEL_BTN: 'td:nth-child(10) button',
    };
    const editView = {
        MAIN: '.main--edit',

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

        LIB_ROWS: '.datagrid__body--root > tr',
        LIB_HEAD_ROW: '.datagrid__head tr',
        LIB_SELECT_ALL: `th:nth-child(1) input`,
        LIB_SORT_TITLE_BTN: `th:nth-child(2) button`,
        LIB_SORT_URL_BTN: `th:nth-child(3) button`,
        LIB_ADD_LIB_BTN: 'th:nth-child(7) button',
        LIB_DEL_ALL_BTN: 'th:nth-child(8) button',

        LIB_SELECT: `td:nth-child(1) input`,
        LIB_TITLE: 'td:nth-child(2) .datagrid__cell--title',
        LIB_URL: 'td:nth-child(3) .datagrid__cell--url',
        LIB_TYPE: 'td:nth-child(4) select',
        LIB_ASYNC_SWITCH: 'td:nth-child(5) input',
        LIB_ACTIVE_SWITCH: 'td:nth-child(6) input',
        LIB_EDIT_BTN: 'td:nth-child(7) button',
        LIB_DEL_BTN: 'td:nth-child(8) button',
    };

    let $elem: HTMLElement;
    let mockAppState: AppState;

    function getListViewElem(rowIdx: number = 0, isPrimaryRow: boolean = true) {
        const $rows = $elem.querySelectorAll(listView.ROWS) as NodeListOf<HTMLElement>;
        const $subRows = $elem.querySelectorAll(listView.SUB_ROWS) as NodeListOf<HTMLElement>
        const $row = isPrimaryRow ? $rows[rowIdx] : $subRows[rowIdx];
        const $header = $elem.querySelector(listView.HEAD_ROW) as HTMLElement;

        const pgnRecordTxt = $elem.querySelector(listView.PGN_RECORD).textContent;
        const pgnRecordTxtTotal = pgnRecordTxt.length;
        const totalRows = Number(pgnRecordTxt.slice(pgnRecordTxtTotal - 1, pgnRecordTxtTotal));

        return {
            $searchInput: $elem.querySelector(listView.SEARCH_INPUT) as HTMLInputElement,
            $searchClear: $elem.querySelector(listView.SEARCH_CLEAR_BTN) as HTMLButtonElement,

            $rows,
            $subRows,
            totalRows,

            $header,
            $selectAll: $header.querySelector(listView.SELECT_ALL) as HTMLInputElement,
            $addHost: $header.querySelector(listView.ADD_HOST_BTN) as HTMLButtonElement,
            $delAll: $header.querySelector(listView.DEL_ALL_BTN) as HTMLButtonElement,

            $row,
            $select: $row?.querySelector(listView.SELECT) as HTMLInputElement,
            title: $row?.querySelector(listView.TITLE).textContent,
            badge: $row?.querySelector(listView.HOST_BADGE)?.textContent,
            address: $row?.querySelector(listView.ADDRESS).textContent,
            $expdToggle: $row?.querySelector(listView.EXPD_BTN) as HTMLButtonElement,
            $httpsToggle: $row?.querySelector(listView.HTTPS_SWITCH) as HTMLInputElement,
            $exactToggle: $row?.querySelector(listView.EXACT_MATCH_SWITCH) as HTMLInputElement,
            $codeExecDropdown: $row?.querySelector(listView.CODE_EXEC_SELECT) as HTMLSelectElement,
            $jsToggle: $row?.querySelector(listView.JS_SWITCH) as HTMLInputElement,
            $cssToggle: $row?.querySelector(listView.CSS_SWITCH) as HTMLInputElement,
            $libToggle: $row?.querySelector(listView.LIB_SWITCH) as HTMLInputElement,
            $addPath: $row?.querySelector(listView.ADD_BTN) as HTMLButtonElement,
            $edit: $row?.querySelector(listView.EDIT_BTN) as HTMLButtonElement,
            $del: $row?.querySelector(listView.DEL_BTN) as HTMLButtonElement,
        };
    }

    function getEditViewElem(rowIdx: number = 0) {
        const $libHeaderRow = $elem.querySelector(editView.LIB_HEAD_ROW) as HTMLElement;
        const $libRows = $elem.querySelectorAll(editView.LIB_ROWS) as NodeListOf<HTMLElement>;
        const $libRow = $libRows[rowIdx];

        return {
            $main: $elem.querySelector(editView.MAIN),

            activeHost: $elem.querySelector(editView.ACTIVE_HOST)?.textContent,
            activeHostBadge: $elem.querySelector(editView.ACTIVE_HOST_BADGE)?.textContent,
            activePath: $elem.querySelector(editView.ACTIVE_PATH)?.textContent,

            $titleInput: $elem.querySelector(editView.TITLE_INPUT) as HTMLInputElement,
            $valueInput: $elem.querySelector(editView.VALUE_INPUT) as HTMLInputElement,
            $httpsSwitch: $elem.querySelector(editView.HTTPS_SWITCH) as HTMLInputElement,
            $exactSwitch: $elem.querySelector(editView.EXACT_SWITCH) as HTMLInputElement,
            $jsExecSelect: $elem.querySelector(editView.JS_EXEC_SELECT) as HTMLSelectElement,
            $jsTab: $elem.querySelector(editView.JS_TAB) as HTMLInputElement,
            $cssTab: $elem.querySelector(editView.CSS_TAB) as HTMLInputElement,
            $libTab: $elem.querySelector(editView.LIB_TAB) as HTMLInputElement,
            $jsSwitch: $elem.querySelector(editView.JS_SWITCH) as HTMLInputElement,
            $cssSwitch: $elem.querySelector(editView.CSS_SWITCH) as HTMLInputElement,
            $libSwitch: $elem.querySelector(editView.LIB_SWITCH) as HTMLInputElement,

            $libRows,
            $libHeaderRow,
            $libSelectAll: $libHeaderRow?.querySelector(editView.LIB_SELECT_ALL) as HTMLInputElement,
            $libTitleSort: $libHeaderRow?.querySelector(editView.LIB_SORT_TITLE_BTN) as HTMLButtonElement,
            $libUrlSort: $libHeaderRow?.querySelector(editView.LIB_SORT_URL_BTN) as HTMLButtonElement,
            $libAddLib: $libHeaderRow?.querySelector(editView.LIB_ADD_LIB_BTN) as HTMLButtonElement,
            $libDelAll: $libHeaderRow?.querySelector(editView.LIB_DEL_ALL_BTN) as HTMLButtonElement,
            $libRow,
            $libSelect: $libRow?.querySelector(editView.LIB_SELECT) as HTMLInputElement,
            libTitle: $libRow?.querySelector(editView.LIB_TITLE)?.textContent,
            libUrl: $libRow?.querySelector(editView.LIB_URL)?.textContent,
            $libTypeSelect: $libRow?.querySelector(editView.LIB_TYPE) as HTMLSelectElement,
            $libAsyncSwitch: $libRow?.querySelector(editView.LIB_ASYNC_SWITCH) as HTMLInputElement,
            $libActiveSwitch: $libRow?.querySelector(editView.LIB_ACTIVE_SWITCH) as HTMLInputElement,
            $libEdit: $libRow?.querySelector(editView.LIB_EDIT_BTN) as HTMLButtonElement,
            $libDel: $libRow?.querySelector(editView.LIB_DEL_BTN) as HTMLButtonElement,
        };
    }

    function getModalElem() {
        return {
            $confirm: $elem.querySelector(modal.CONFIRM_BTN) as HTMLButtonElement,
            $hostTitleInput: $elem.querySelector(modal.HOST_TITLE_INPUT) as HTMLInputElement,
            $hostValueInput: $elem.querySelector(modal.HOST_TITLE_INPUT) as HTMLInputElement,
            $pathTitleInput: $elem.querySelector(modal.PATH_TITLE_INPUT) as HTMLInputElement,
            $pathValueInput: $elem.querySelector(modal.PATH_VALUE_INPUT) as HTMLInputElement,
            $libTitleInput: $elem.querySelector(modal.LIB_TITLE_INPUT) as HTMLInputElement,
            $libValueInput: $elem.querySelector(modal.LIB_TITLE_INPUT) as HTMLInputElement,
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
        const { $searchInput } = getListViewElem();
        TestUtil.setInputVal($searchInput, searchText);
        TestUtil.triggerEvt($searchInput, 'change');

        // Mocking debounce fn causes inconsistent testing issue compared to the UI
        // therefore we use timer to deal with `setTimeout` in debounce involved in search
        // jest.runAllTimers();
    }

    function initApp() {
        TestUtil.renderPlain($elem, StateHandle.init(OptionApp, {
            root: [ mockAppState, new AppStateHandle() ],
        }));
    }

    beforeEach(() => {
        $elem = TestUtil.setupElem();
        mockAppState = createMockAppState();    // 4 rows w/ 3 sub rows for each row
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('List View - Row CRUD', () => {
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
                    initApp();
                });

                it('should have 4 displayed rows of total 4 rows', () => {
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(4);
                    expect($rows.length).toBe(4);
                });

                it('should delete single row', () => {
                    const { $row, $del }= getListViewElem();
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(3);
                    expect($rows.length).toBe(3);
                    expect(hsTargetRow($rows, $row)).toBeFalsy();
                });

                it('should delete single sub row (path)', () => {
                    // Expand the sub row fist
                    const { $expdToggle }= getListViewElem();
                    TestUtil.triggerEvt($expdToggle, 'click');

                    // Delete the sub row
                    const { $del, $row } = getListViewElem(0, false);
                    TestUtil.triggerEvt($del, 'click');
                    const { $subRows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(4);
                    expect($subRows.length).toBe(2);
                    expect(hsTargetRow($subRows, $row)).toBeFalsy();
                });

                it('should delete multiple partial rows', () => {
                    // Expand the sub row fist
                    const { $row, $delAll, $select } = getListViewElem();
                    const { $row: $2ndRow, $select: $2ndRowSelect} = getListViewElem(2);
                    TestUtil.triggerEvt($select, 'click');
                    TestUtil.triggerEvt($2ndRowSelect, 'click');
                    TestUtil.triggerEvt($delAll, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(2);
                    expect($rows.length).toBe(2);
                    expect(hsTargetRow($rows, [$row, $2ndRow])).toBeFalsy();
                });

                it('should delete all rows', () => {
                    const { $selectAll, $delAll } = getListViewElem();
                    TestUtil.triggerEvt($selectAll, 'click');
                    TestUtil.triggerEvt($delAll, 'click');
                    const { $rows, totalRows } = getListViewElem();

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

                    initApp();
                });

                it('should have 2 displayed rows of total 4 rows', () => {
                    const { $rows, totalRows } = getListViewElem();
                    expect($rows.length).toBe(2);
                    expect(totalRows).toBe(4);
                });

                it('should delete single row', () => {
                    const { $row, $del } = getListViewElem();
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(3);
                    expect($rows.length).toBe(2);
                    expect(hsTargetRow($rows, $row)).toBeFalsy();
                });

                it('should delete single sub row (path)', () => {
                    // Expand the sub row fist
                    const { $expdToggle } = getListViewElem();
                    TestUtil.triggerEvt($expdToggle, 'click');

                    // Delete the sub row
                    const { $row, $del } = getListViewElem(0, false);
                    TestUtil.triggerEvt($del, 'click');
                    const { $subRows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(4);
                    expect($subRows.length).toBe(2);
                    expect(hsTargetRow($subRows, $row)).toBeFalsy();
                });

                it('should delete multiple partial rows', () => {
                    const { $delAll, $row, $select } = getListViewElem();
                    TestUtil.triggerEvt($select, 'click');
                    TestUtil.triggerEvt($delAll, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(3);
                    expect($rows.length).toBe(2);        // 1st page has been replaced with 2 remianing rows
                    expect(hsTargetRow($rows, $row)).toBeFalsy();
                });

                it('should delete all rows', () => {
                    const { $selectAll, $delAll } = getListViewElem();
                    TestUtil.triggerEvt($selectAll, 'click');
                    TestUtil.triggerEvt($delAll, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(2);
                    expect($rows.length).toBe(2);            // 1st page has been replaced with 2 remianing rows
                });
            });

            describe('Searched + Non-paginated', () => {
                beforeEach(() => {
                    initApp();
                    mockSearch('ebay');
                });

                it('should delete all rows for search', () => {
                    const { $selectAll, $delAll, $row } = getListViewElem()
                    TestUtil.triggerEvt($selectAll, 'click');
                    TestUtil.triggerEvt($delAll, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect($rows.length).toBe(0);
                    expect(totalRows).toBe(0);
                    expect(hsTargetRow($rows, $row)).toBeFalsy();

                    // Clear the search
                    mockSearch('');
                    const { $rows: $newRows, totalRows: newTotalRows } = getListViewElem();
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

                    initApp();
                    mockSearch('ebay');
                });

                it('should have 1 display row of total 1 row', () => {
                    const { $rows, totalRows } = getListViewElem();

                    expect(totalRows).toBe(1);
                    expect($rows.length).toBe(1);
                });

                it('should delete single row and clear the search results', () => {
                    // Delete the search row
                    const { $row, $del } = getListViewElem();
                    TestUtil.triggerEvt($del, 'click');
                    const { $rows, totalRows, $searchClear } = getListViewElem();

                    expect(totalRows).toBe(0);
                    expect($rows.length).toBe(0);
                    expect(hsTargetRow($rows, $row)).toBeFalsy();

                    // Clear the search
                    TestUtil.triggerEvt($searchClear, 'click');
                    const { $rows: $newRows, totalRows: newTotalRows } = getListViewElem();

                    expect(newTotalRows).toBe(3);
                    expect($newRows.length).toBe(2);
                    expect(hsTargetRow($newRows, $row)).toBeFalsy();
                });

                it('should delete single sub row', () => {
                    // Expand the sub row fist
                    const { $expdToggle } = getListViewElem();
                    TestUtil.triggerEvt($expdToggle, 'click');

                    // Delete the sub row
                    const { $row, $del } = getListViewElem(0, false);
                    TestUtil.triggerEvt($del, 'click');
                    const { $subRows, totalRows } = getListViewElem(0, false);

                    expect(totalRows).toBe(1);
                    expect($subRows.length).toBe(2);
                    expect(hsTargetRow($subRows, $row)).toBeFalsy();
                });

                it('should delete all rows', () => {
                    const { $selectAll, $delAll, $row } = getListViewElem();

                    // Select All & Delete
                    TestUtil.triggerEvt($selectAll, 'click');
                    TestUtil.triggerEvt($delAll, 'click');
                    const { $rows, totalRows } = getListViewElem();

                    expect($rows.length).toBe(0);
                    expect(totalRows).toBe(0);
                    expect(hsTargetRow($rows, $row)).toBeFalsy();
                });
            });
        });

        describe('Modify Rule', () => {
            beforeEach(() => {
                initApp();
            });

            it('should expand/unexpand row', () => {
                const ARW_EXPD_CLS = 'icon-btn--open';
                const { $expdToggle } = getListViewElem();

                TestUtil.triggerEvt($expdToggle , 'click');
                expect($expdToggle.className.includes(ARW_EXPD_CLS)).toBeTruthy();

                TestUtil.triggerEvt($expdToggle , 'click');
                expect($expdToggle.className.includes(ARW_EXPD_CLS)).toBeFalsy();
            });

            it('should toggle https', () => {
                const { $httpsToggle } = getListViewElem();
                TestUtil.triggerEvt($httpsToggle , 'click');

                expect($httpsToggle.checked).toBeTruthy();
            });

            it('should toggle exact match', () => {
                const { $exactToggle } = getListViewElem();
                TestUtil.triggerEvt($exactToggle , 'click');

                expect($exactToggle.checked).toBeTruthy();
            });

            it('should set code execution step', () => {
                const { $codeExecDropdown } = getListViewElem();
                $codeExecDropdown.value = '1';
                TestUtil.triggerEvt($codeExecDropdown, 'change');

                expect($codeExecDropdown.value).toBe('1');
            });

            it('should toggle js', () => {
                const { $jsToggle } = getListViewElem();
                TestUtil.triggerEvt($jsToggle , 'click');

                expect($jsToggle.checked).toBeTruthy();
            });

            it('should toggle css', () => {
                const { $cssToggle } = getListViewElem();
                TestUtil.triggerEvt($cssToggle , 'click');

                expect($cssToggle.checked).toBeTruthy();
            });

            it('should toggle library', () => {
                const { $libToggle } = getListViewElem();
                TestUtil.triggerEvt($libToggle , 'click');

                expect($libToggle.checked).toBeTruthy();
            });

            it('should add host', () => {
                // TODO:
            });

            it('should add path', () => {
                const mockTitle = 'title';
                const mockPath = '/loremsum';

                // Open add path modal
                const { $addPath, $expdToggle } = getListViewElem();
                TestUtil.triggerEvt($addPath, 'click');

                // Add path
                const { $pathTitleInput, $pathValueInput, $confirm } = getModalElem();
                TestUtil.setInputVal($pathTitleInput, mockTitle);
                TestUtil.triggerEvt($pathTitleInput, 'change');
                TestUtil.setInputVal($pathValueInput, mockPath);
                TestUtil.triggerEvt($pathValueInput, 'change');
                TestUtil.triggerEvt($confirm, 'click');

                // Expand nested rows
                TestUtil.triggerEvt($expdToggle, 'click');
                const { title, address } = getListViewElem(3, false);
                expect(title).toBe(mockTitle);
                expect(address).toBe(mockPath);
            });

            it('should switch to edit mode', () => {
                const { $edit } = getListViewElem();
                TestUtil.triggerEvt($edit, 'click');

                expect($elem.querySelector(editView.MAIN)).toBeTruthy();
            });
        });
    });

    describe('Edit View', () => {
        beforeEach(() => {
            initApp();

            // // simulateRowEdit();
            // TestUtil.triggerEvt($edit, 'click');
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