import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import PgnHandle from '../../../handle/pagination';
import { DomHandle } from '../../../handle/dom';
import { OptionApp } from '.';

import { AppState } from '../../../model/app-state';
import { createMockAppState } from '../../../mock/state';
import { AMethodSpy } from '../../../asset/ts/test-util/type';
import { EGlobalTarget } from '../../../handle/dom/type';


// Mock the CodeMirror Edit component to prevent errors thrown during test due to the test is not within exact browser cotnext
// - props API to align with CodeMirror component for testing
jest.mock('react-codemirror2', () => ({
    Controlled: ({ value, onBeforeChange }) => (
        <textarea
            className="mock-textarea"
            value={value}
            onChange={({ target }) => {
                const codeMirrorArgs = [null, null, target.value];
                onBeforeChange(...codeMirrorArgs);
            }}
            />
    )
}));

describe('Component - Option App (E2E)', () => {
    const modal = {
        CONFIRM_BTN: '.modal__footer button[type="submit"]',
        HOST_TITLE_INPUT: '#host-title',
        HOST_VALUE_INPUT: '#host-value',
        PATH_TITLE_INPUT: '#path-title',
        PATH_VALUE_INPUT: '#path-url',
        LIB_TITLE_INPUT: '#lib-title',
        LIB_VALUE_INPUT: '#lib-value',
        ERR_MSG: '.text-ipt__err'
    };
    const listView = {
        MAIN: '.main--list',

        SEARCH_INPUT: '.search__input',
        SEARCH_CLEAR_BTN: '.search__clear',
        PGN_RECORD: '.paginate__record',

        HEAD_ROW: '.datagrid__head tr',
        SELECT_ALL: `th:nth-child(1) input`,
        SORT_TITLE_BTN: `th:nth-child(2) button`,
        SORT_ADDR_BTN: `th:nth-child(3) button`,
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

        BACK: '.header__ctrl--edit button:first-child',
        DEL_RULE: '.header__ctrl--edit button:nth-child(2)',
        ADD_PATH: '.header__ctrl--edit button:last-child',

        ACTIVE_HOST: `.side-nav__item--parent.side-nav__item--atv .side-nav__item-header .side-nav__title`,
        ACTIVE_HOST_1ST_PATH: `.side-nav__item--parent.side-nav__item--atv .side-nav__list--child li:first-child`,
        ACTIVE_HOST_BADGE: `.side-nav__item--parent.side-nav__item--atv .side-nav__item-header .badge`,
        ACTIVE_PATH: '.side-nav__item--child.side-nav__item--atv .side-nav__title',
        TITLE_INPUT: '#edit-target-id',
        TITLE_INPUT_ERR: '#edit-target-id + .text-ipt__err',
        VALUE_INPUT: '#edit-target-value',
        VALUE_INPUT_ERR: '#edit-target-value + .text-ipt__err',
        HTTPS_SWITCH: '#https-switch',
        EXACT_SWITCH: '#regex-switch',
        JS_EXEC_SELECT: '#js-execution',
        JS_TAB: '#rdo-tab-switch-0',
        JS_SWITCH: '#checkbox-tab-switch-0',
        CSS_TAB: '#rdo-tab-switch-1',
        CSS_SWITCH: '#checkbox-tab-switch-1',
        LIB_TAB: '#rdo-tab-switch-2',
        LIB_SWITCH: '#checkbox-tab-switch-2',
        CODE_MIRROR: '.mock-textarea',

        LIB_ROWS: '.datagrid__body--root > tr',
        LIB_HEAD_ROW: '.datagrid__head tr',
        LIB_SELECT_ALL: `th:nth-child(1) input`,
        LIB_SORT_TITLE_BTN: `th:nth-child(2) button`,
        LIB_SORT_URL_BTN: `th:nth-child(3) button`,
        LIB_ADD_BTN: 'th:nth-child(7) button',
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
            $main: $elem.querySelector(listView.MAIN),

            $searchInput: $elem.querySelector(listView.SEARCH_INPUT) as HTMLInputElement,
            $searchClear: $elem.querySelector(listView.SEARCH_CLEAR_BTN) as HTMLButtonElement,

            $rows,
            $subRows,
            totalRows,

            $header,
            $selectAll: $header.querySelector(listView.SELECT_ALL) as HTMLInputElement,
            $titleSort: $header.querySelector(listView.SORT_TITLE_BTN) as HTMLButtonElement,
            $addrSort: $header.querySelector(listView.SORT_ADDR_BTN) as HTMLButtonElement,
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

            $back: $elem.querySelector(editView.BACK) as HTMLButtonElement,
            $del: $elem.querySelector(editView.DEL_RULE) as HTMLButtonElement,
            $addPath: $elem.querySelector(editView.ADD_PATH) as HTMLButtonElement,

            $activeHost: $elem.querySelector(editView.ACTIVE_HOST) as HTMLElement,
            $activeHost1stPath: $elem.querySelector(editView.ACTIVE_HOST_1ST_PATH) as HTMLElement,
            $activeHostBadge: $elem.querySelector(editView.ACTIVE_HOST_BADGE),
            activeHost: $elem.querySelector(editView.ACTIVE_HOST)?.textContent,
            activeHostBadge: $elem.querySelector(editView.ACTIVE_HOST_BADGE)?.textContent,
            activePath: $elem.querySelector(editView.ACTIVE_PATH)?.textContent,

            $titleInput: $elem.querySelector(editView.TITLE_INPUT) as HTMLInputElement,
            $titleInputErr: $elem.querySelector(editView.TITLE_INPUT_ERR) as HTMLElement,
            $valueInput: $elem.querySelector(editView.VALUE_INPUT) as HTMLInputElement,
            $valueInputErr: $elem.querySelector(editView.VALUE_INPUT_ERR) as HTMLElement,
            $httpsSwitch: $elem.querySelector(editView.HTTPS_SWITCH) as HTMLInputElement,
            $exactSwitch: $elem.querySelector(editView.EXACT_SWITCH) as HTMLInputElement,
            $jsExecSelect: $elem.querySelector(editView.JS_EXEC_SELECT) as HTMLSelectElement,
            $jsTab: $elem.querySelector(editView.JS_TAB) as HTMLInputElement,
            $cssTab: $elem.querySelector(editView.CSS_TAB) as HTMLInputElement,
            $libTab: $elem.querySelector(editView.LIB_TAB) as HTMLInputElement,
            $jsSwitch: $elem.querySelector(editView.JS_SWITCH) as HTMLInputElement,
            $cssSwitch: $elem.querySelector(editView.CSS_SWITCH) as HTMLInputElement,
            $libSwitch: $elem.querySelector(editView.LIB_SWITCH) as HTMLInputElement,
            $codeMirror: $elem.querySelector(editView.CODE_MIRROR) as HTMLTextAreaElement,

            $libRows,
            $libHeaderRow,
            $libSelectAll: $libHeaderRow?.querySelector(editView.LIB_SELECT_ALL) as HTMLInputElement,
            $libTitleSort: $libHeaderRow?.querySelector(editView.LIB_SORT_TITLE_BTN) as HTMLButtonElement,
            $libUrlSort: $libHeaderRow?.querySelector(editView.LIB_SORT_URL_BTN) as HTMLButtonElement,
            $libAdd: $libHeaderRow?.querySelector(editView.LIB_ADD_BTN) as HTMLButtonElement,
            $libDelAll: $libHeaderRow?.querySelector(editView.LIB_DEL_ALL_BTN) as HTMLButtonElement,
            $libRow,
            $libSelect: $libRow?.querySelector(editView.LIB_SELECT) as HTMLInputElement,
            libTitle: $libRow?.querySelector(editView.LIB_TITLE)?.textContent,
            libUrl: $libRow?.querySelector(editView.LIB_URL)?.textContent,
            $libTypeDropdown: $libRow?.querySelector(editView.LIB_TYPE) as HTMLSelectElement,
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
            $hostValueInput: $elem.querySelector(modal.HOST_VALUE_INPUT) as HTMLInputElement,
            $pathTitleInput: $elem.querySelector(modal.PATH_TITLE_INPUT) as HTMLInputElement,
            $pathValueInput: $elem.querySelector(modal.PATH_VALUE_INPUT) as HTMLInputElement,
            $libTitleInput: $elem.querySelector(modal.LIB_TITLE_INPUT) as HTMLInputElement,
            $libValueInput: $elem.querySelector(modal.LIB_VALUE_INPUT) as HTMLInputElement,
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
        $elem = TestUtil.teardown($elem);
    });

    describe('Component Class', () => {
        // mock props + spy appStateHandle
        let appStateHandleSpy: AMethodSpy<typeof AppStateHandle>;
        let domHandleSpy: AMethodSpy<DomHandle>;
        let cmpSpy: AMethodSpy<OptionApp>;
        let cmp: OptionApp;
        const mockFn = () => {};

        beforeEach(() => {
            const mockProps: any = {
                appState: mockAppState,
                appStateHandle: new AppStateHandle(),
            };
            cmp = new OptionApp(mockProps);

            cmpSpy = TestUtil.spyProtoMethods(OptionApp);
            jest.spyOn(cmp.onEscKey as any, 'bind').mockReturnValue(mockFn);

            domHandleSpy = TestUtil.spyProtoMethods(DomHandle);
            domHandleSpy.addGlobalEvt.mockImplementation(mockFn);

            appStateHandleSpy = TestUtil.spyProtoMethods(AppStateHandle);
            appStateHandleSpy.onModalCancel.mockImplementation(mockFn);
        });

        describe('Method - componentDidMount', () => {
            it('should add the ESC key event and cache the event handler for later removal when unmount', () => {
                cmp.componentDidMount();
                expect(cmp.cachedOnEscKey).toBe(mockFn);
                expect(cmpSpy.toggleEscKeyEvt).toHaveBeenCalledWith(mockFn);
            });
        });

        describe('Method - componentWillUnmount', () => {
            it('should skip if there is no cached event handler', () => {
                cmp.componentWillUnmount();
                expect(cmpSpy.toggleEscKeyEvt).not.toHaveBeenCalled();
            });

            it('should remove event handler and clear cached event handler', () => {
                cmp.cachedOnEscKey = mockFn;
                cmp.componentWillUnmount();

                expect(cmpSpy.toggleEscKeyEvt).toHaveBeenCalled();
                expect(cmp.cachedOnEscKey).toBeFalsy();
            });
        });

        describe('Method - toggleEscKeyEvt', () => {
            it('should add event', () => {
                cmp.toggleEscKeyEvt(mockFn);

                expect(domHandleSpy.addGlobalEvt).toHaveBeenCalledWith({
                    targetType: EGlobalTarget.DOC,
                    evtType: 'keyup',
                    handler: mockFn,
                }, true);
            });

            it('should remove event', () => {
                cmp.toggleEscKeyEvt(mockFn, false);

                expect(domHandleSpy.addGlobalEvt).toHaveBeenCalledWith({
                    targetType: EGlobalTarget.DOC,
                    evtType: 'keyup',
                    handler: mockFn,
                }, false);
            });
        });

        describe('Method - onEscKey', () => {
            it('should skip if it is not esc key', () => {
                const mockEvt: any = { key: 'lorem' };
                cmp.onEscKey(mockEvt);
                expect(appStateHandleSpy.onModalCancel).not.toHaveBeenCalled();
            });

            it('should skip if there is no current modal ID', () => {
                const mockEvt: any = { key: 'Escape' };
                cmp.onEscKey(mockEvt);
                expect(appStateHandleSpy.onModalCancel).not.toHaveBeenCalled();
            });

            it('should cancel modal if it is esc key and has current modal ID', () => {
                const mockModalId = 'lorem';
                const mockEvt: any = { key: 'Escape' };
                cmp.props.appState.localState.modal.currentId = mockModalId;
                cmp.onEscKey(mockEvt);

                expect(appStateHandleSpy.onModalCancel).toHaveBeenCalled();
            });
        });
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

                const $2ndOption = $codeExecDropdown.children[1] as HTMLOptionElement;
                expect($2ndOption.selected).toBeTruthy();
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

            it('should switch to edit mode', () => {
                const { $edit } = getListViewElem();
                TestUtil.triggerEvt($edit, 'click');

                expect($elem.querySelector(editView.MAIN)).toBeTruthy();
            });
        });

        describe('Add Host/Path', () => {
            beforeEach(() => {
                initApp();
            });

            it('should dismiss modal via ESC key', () => {
                const { $addHost } = getListViewElem();
                TestUtil.triggerEvt($addHost, 'click');

                expect( getModalElem().$confirm).toBeTruthy();

                TestUtil.triggerEvt(
                    document,
                    'keyup',
                    KeyboardEvent,
                    { key: 'Escape' }
                );
                expect( getModalElem().$confirm).toBeFalsy();
            });

            it('should add valid host', () => {
                const { $addHost } = getListViewElem();
                TestUtil.triggerEvt($addHost, 'click');

                const mockTitle = 'lorem';
                const mockValue = 'sum.com';
                const { $confirm, $hostTitleInput, $hostValueInput } = getModalElem();
                TestUtil.setInputVal($hostTitleInput, mockTitle);
                TestUtil.triggerEvt($hostTitleInput, 'change');
                TestUtil.setInputVal($hostValueInput, mockValue);
                TestUtil.triggerEvt($hostValueInput, 'change');
                TestUtil.triggerEvt($confirm, 'click');

                const { totalRows } = getListViewElem();
                expect(totalRows).toBe(5);
            });

            it('should not add invalid host', () => {
                const { $addHost } = getListViewElem();
                TestUtil.triggerEvt($addHost, 'click');

                const mockTitle = 'a b';
                const mockValue = 'sum';
                const { $confirm, $hostTitleInput, $hostValueInput } = getModalElem();
                TestUtil.setInputVal($hostTitleInput, mockTitle);
                TestUtil.triggerEvt($hostTitleInput, 'change');
                TestUtil.setInputVal($hostValueInput, mockValue);
                TestUtil.triggerEvt($hostValueInput, 'change');

                expect($confirm.disabled).toBeTruthy();
                expect($elem.querySelector(`${modal.HOST_TITLE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
                expect($elem.querySelector(`${modal.HOST_VALUE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
            });

            it('should add valid path', () => {
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

            it('should not add invalid path', () => {
                const { $addPath } = getListViewElem();
                TestUtil.triggerEvt($addPath, 'click');

                const mockTitle = 'a b';
                const mockValue = 'sum';
                const { $confirm, $pathTitleInput, $pathValueInput } = getModalElem();
                TestUtil.setInputVal($pathTitleInput, mockTitle);
                TestUtil.triggerEvt($pathTitleInput, 'change');
                TestUtil.setInputVal($pathValueInput, mockValue);
                TestUtil.triggerEvt($pathValueInput, 'change');

                expect($confirm.disabled).toBeTruthy();
                expect($elem.querySelector(`${modal.PATH_TITLE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
                expect($elem.querySelector(`${modal.PATH_VALUE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
            });
        });

        describe('Select Row(s)', () => {
            beforeEach(() => {
                initApp();
            });

            it('should disable all form elements except other row selects and delete all button when a row is selected', () => {
                const { $select, $selectAll, $rows, $addHost, $addPath, $del, $delAll, $titleSort, $addrSort } = getListViewElem();
                TestUtil.triggerEvt($select, 'click');

                expect($addHost.disabled).toBeTruthy();
                expect($addPath.disabled).toBeTruthy();
                expect($del.disabled).toBeTruthy();
                expect($titleSort.disabled).toBeTruthy();
                expect($addrSort.disabled).toBeTruthy();
                expect($delAll.disabled).toBeFalsy();
                expect($selectAll.disabled).toBeFalsy();
                expect($rows[1].querySelector<HTMLInputElement>(listView.SELECT).disabled).toBeFalsy();
            });

            it('should disable all form elements except other row selects and delete all button when all rows are selected', () => {
                const { $select, $selectAll, $addHost, $addPath, $del, $delAll, $titleSort, $addrSort } = getListViewElem();
                TestUtil.triggerEvt($selectAll, 'click');

                expect($addHost.disabled).toBeTruthy();
                expect($addPath.disabled).toBeTruthy();
                expect($del.disabled).toBeTruthy();
                expect($titleSort.disabled).toBeTruthy();
                expect($addrSort.disabled).toBeTruthy();
                expect($delAll.disabled).toBeFalsy();
                expect($select.disabled).toBeFalsy();
            });
        });
    });

    describe('Edit View', () => {
        beforeEach(() => {
            mockAppState.setting.showDeleteModal = false;
            initApp();
            const { $edit } = getListViewElem();
            TestUtil.triggerEvt($edit, 'click');
        });

        describe('target editable', () => {
            it('should set target rule as editable', () => {
                const { activeHost, activePath, $titleInput, $valueInput } = getEditViewElem();

                const { title, value } = mockAppState.rules[0];
                expect(activeHost).toBe(title);
                expect(activePath).toBeFalsy();
                expect($titleInput.value).toBe(title);
                expect($valueInput.value).toBe(value);
            });

            it('should update the editable when click another target rule', () => {
                // CLick its 1st path
                const { $activeHost1stPath } = getEditViewElem();
                TestUtil.triggerEvt($activeHost1stPath, 'click');
                const { activeHost, activePath, $titleInput, $valueInput } = getEditViewElem();

                const { title: hostTitle, paths } = mockAppState.rules[0];
                const { title, value } = paths[0];

                expect(activeHost).toBe(hostTitle);
                expect(activePath).toBe(title);
                expect($titleInput.value).toBe(title);
                expect($valueInput.value).toBe(value);
            });

            it('should go back to List view', () => {
                const { $back } = getEditViewElem();
                TestUtil.triggerEvt($back, 'click');

                expect(getEditViewElem().$main).toBeFalsy();
                expect(getListViewElem().$main).toBeTruthy();
            });
        });

        describe('Delete editable', () => {
            it('should set 1st host as editable if a host is deleted and there are remaining hosts', () => {
                const nextHostTitle = mockAppState.rules[1].title;
                const { $del, $activeHost } = getEditViewElem();
                TestUtil.triggerEvt($del, 'click');

                expect($activeHost.textContent).toBe(nextHostTitle);
            });

            it('should go back to list view if a host is deleted and no more host after a host is deleted', () => {
                const { $del } = getEditViewElem();
                TestUtil.triggerEvt($del, 'click');
                TestUtil.triggerEvt($del, 'click');
                TestUtil.triggerEvt($del, 'click');
                TestUtil.triggerEvt($del, 'click');

                const { $main, $rows } = getListViewElem();
                expect(getEditViewElem().$main).toBeFalsy();
                expect($main).toBeTruthy();
                expect($rows).toBeTruthy();
            });

            it('should set 1st path as editable if a path is deleted', () => {
                // CLick its 1st path and delete it
                const nextPathTitle = mockAppState.rules[0].paths[1].title;
                const { $activeHost1stPath, $del } = getEditViewElem();
                TestUtil.triggerEvt($activeHost1stPath, 'click');
                TestUtil.triggerEvt($del, 'click');

                expect($activeHost1stPath.textContent).toBe(nextPathTitle);
            });
        });

        describe('Add Path', () => {
            it('should add valid path', () => {
                const mockTitle = 'lorem';
                const mockValue = '/sum';

                const { $addPath, $activeHostBadge } = getEditViewElem();
                TestUtil.triggerEvt($addPath, 'click');

                const { $pathTitleInput, $pathValueInput, $confirm } = getModalElem();
                TestUtil.setInputVal($pathTitleInput, mockTitle);
                TestUtil.triggerEvt($pathTitleInput, 'change');
                TestUtil.setInputVal($pathValueInput, mockValue);
                TestUtil.triggerEvt($pathValueInput, 'change');
                TestUtil.triggerEvt($confirm, 'click');

                expect($activeHostBadge.textContent).toBe('4');
            });

            it('should not add invalid path', () => {
                const { $addPath } = getEditViewElem();
                TestUtil.triggerEvt($addPath, 'click');

                const mockTitle = 'a b';
                const mockValue = 'sum';
                const { $confirm, $pathTitleInput, $pathValueInput } = getModalElem();
                TestUtil.setInputVal($pathTitleInput, mockTitle);
                TestUtil.triggerEvt($pathTitleInput, 'change');
                TestUtil.setInputVal($pathValueInput, mockValue);
                TestUtil.triggerEvt($pathValueInput, 'change');

                expect($confirm.disabled).toBeTruthy();
                expect($elem.querySelector(`${modal.PATH_TITLE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
                expect($elem.querySelector(`${modal.PATH_VALUE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
            });
        });

        describe('host text input', () => {
            it('should validate/update the title text input and title at side bar only if it is valid', () => {
                const mockValue = 'loremsum';
                const { $activeHost, activeHost, $titleInput } = getEditViewElem();
                TestUtil.setInputVal($titleInput, mockValue);
                TestUtil.triggerEvt($titleInput, 'change');

                const { $titleInputErr } = getEditViewElem();
                expect($titleInput.value).toBe(mockValue);
                expect($activeHost.textContent).toBe(mockValue);
                expect($activeHost.textContent).not.toBe(activeHost);
                expect($titleInputErr).toBeFalsy();
            });

            it('should validate/update the title text input and not set the title at side bar if it is not valid', () => {
                const mockValue = 'lorem sum'; // space is invalid
                const { $activeHost, activeHost, $titleInput } = getEditViewElem();
                TestUtil.setInputVal($titleInput, mockValue);
                TestUtil.triggerEvt($titleInput, 'change');

                const { $titleInputErr } = getEditViewElem();
                expect($titleInput.value).toBe(mockValue);
                expect($titleInputErr).toBeTruthy();
                expect($activeHost.textContent).not.toBe(mockValue);
                expect($activeHost.textContent).toBe(activeHost);
            });

            it('should validate/update the value text input when it is valid', () => {
                const mockValue = 'loremsum.com';
                const { $valueInput } = getEditViewElem();
                TestUtil.setInputVal($valueInput, mockValue);
                TestUtil.triggerEvt($valueInput, 'change');

                const { $valueInputErr } = getEditViewElem();
                expect($valueInput.value).toBe(mockValue);
                expect($valueInputErr).toBeFalsy();
            });

            it('should validate/update the value text input when it is not valid', () => {
                const mockValue = 'lore msum';
                const { $valueInput } = getEditViewElem();
                TestUtil.setInputVal($valueInput, mockValue);
                TestUtil.triggerEvt($valueInput, 'change');

                const { $valueInputErr } = getEditViewElem();
                expect($valueInput.value).toBe(mockValue);
                expect($valueInputErr).toBeTruthy();
            });

            it('should toggle the https switch and exact match switch', () => {
                const { $httpsSwitch, $exactSwitch } = getEditViewElem();
                TestUtil.triggerEvt($httpsSwitch, 'click');
                TestUtil.triggerEvt($httpsSwitch, 'change');
                TestUtil.triggerEvt($exactSwitch, 'click');
                TestUtil.triggerEvt($exactSwitch, 'change');

                expect($httpsSwitch.checked).toBeTruthy();
                expect($exactSwitch.checked).toBeTruthy();
            });
        });

        describe('dropdown, tabs and code input', () => {
            it('should set the code execution step', () => {
                const mockOptioValue = '1';
                const { $jsExecSelect } = getEditViewElem();
                $jsExecSelect.value = mockOptioValue;
                TestUtil.triggerEvt($jsExecSelect, 'change');

                const $2ndOption = $jsExecSelect.children[1] as HTMLOptionElement;
                expect($2ndOption.selected).toBeTruthy();
            });

            it('should update the active tab, tab switch and should remember when switch back from other active rule', () => {
                const {  $cssSwitch, $cssTab, $activeHost, $activeHost1stPath } = getEditViewElem();

                // Click the Css Switch and Css Tab
                TestUtil.triggerEvt($cssSwitch, 'click');
                TestUtil.triggerEvt($cssSwitch, 'change');
                TestUtil.triggerEvt($cssTab, 'click');
                TestUtil.triggerEvt($cssTab, 'change');

                expect($cssSwitch.checked).toBeTruthy();
                expect($cssTab.checked).toBeTruthy();

                // Click its 1st path
                TestUtil.triggerEvt($activeHost1stPath, 'click');

                expect($cssSwitch.checked).toBeFalsy();
                expect($cssTab.checked).toBeFalsy();

                // Click back the host
                TestUtil.triggerEvt($activeHost, 'click');

                expect($cssSwitch.checked).toBeTruthy();
                expect($cssTab.checked).toBeTruthy();
            });

            it('should set the code in code mirror component', () => {
                const mockCode = 'ABC';
                const { $codeMirror } = getEditViewElem();
                TestUtil.setInputVal($codeMirror, mockCode, false);
                TestUtil.triggerEvt($codeMirror, 'change');

                expect($codeMirror.textContent).toBe(mockCode);
            });
        });

        describe('Library data grid', () => {
            beforeEach(() => {
                const { $libTab } = getEditViewElem();
                TestUtil.triggerEvt($libTab, 'click');
                TestUtil.triggerEvt($libTab, 'change');
            });

            describe('Sort', () => {
                it('should sort', () => {
                    const ASC = 'asc';
                    const { $libTitleSort, $libUrlSort } = getEditViewElem();
                    expect($libTitleSort.className.includes(ASC)).toBeFalsy();

                    TestUtil.triggerEvt($libTitleSort, 'click');
                    expect($libTitleSort.className.includes(ASC)).toBeTruthy();

                    TestUtil.triggerEvt($libUrlSort, 'click');
                    expect($libTitleSort.className.includes(ASC)).toBeFalsy();
                    expect($libUrlSort.className.includes(ASC)).toBeTruthy();
                });
            });

            describe('Select', () => {
                it('should disable specific form elements when a row is selected', () => {
                    const { $libSelect, $libRows, $libAdd, $libDel, $libTitleSort, $libUrlSort, $libDelAll, $libSelectAll } = getEditViewElem();
                    TestUtil.triggerEvt($libSelect, 'click');

                    expect($libTitleSort.disabled).toBeTruthy();
                    expect($libUrlSort.disabled).toBeTruthy();
                    expect($libAdd.disabled).toBeTruthy();
                    expect($libDel.disabled).toBeTruthy();

                    expect($libDelAll.disabled).toBeFalsy();
                    expect($libSelectAll.disabled).toBeFalsy();
                    expect($libRows[1].querySelector<HTMLInputElement>(editView.LIB_SELECT).disabled).toBeFalsy();
                });

                it('should disable specific form elements when all rows are selected', () => {
                    const { $libSelect, $libAdd, $libDel, $libTitleSort, $libUrlSort, $libDelAll, $libSelectAll } = getEditViewElem();
                    TestUtil.triggerEvt($libSelectAll, 'click');

                    expect($libTitleSort.disabled).toBeTruthy();
                    expect($libUrlSort.disabled).toBeTruthy();
                    expect($libAdd.disabled).toBeTruthy();
                    expect($libDel.disabled).toBeTruthy();

                    expect($libDelAll.disabled).toBeFalsy();
                    expect($libSelect.disabled).toBeFalsy();
                });
            });

            describe('Delete', () => {
                it('should delete single row', () => {
                    const { $libDel, libTitle: oldTItle, libUrl: oldUrl } = getEditViewElem();
                    TestUtil.triggerEvt($libDel, 'click');

                    const { libTitle, libUrl } = getEditViewElem();
                    expect(libTitle).not.toBe(oldTItle);
                    expect(libUrl).not.toBe(oldUrl);
                });

                it('should delete selected multiple rows', () => {
                    const { $libSelect, $libRows, $libDelAll } = getEditViewElem();
                    const $2ndRowSelect = $libRows[1].querySelector<HTMLInputElement>(editView.LIB_SELECT);
                    const thirdRowTitle = $libRows[2].querySelector(editView.LIB_TITLE).textContent;
                    const thirdRowUrl = $libRows[2].querySelector(editView.LIB_URL).textContent;
                    TestUtil.triggerEvt($libSelect, 'click');
                    TestUtil.triggerEvt($2ndRowSelect, 'click');
                    TestUtil.triggerEvt($libDelAll, 'click');

                    const { libTitle, libUrl } = getEditViewElem();
                    expect(libTitle).toBe(thirdRowTitle);
                    expect(libUrl).toBe(thirdRowUrl);
                });

                it('should delete all rows', () => {
                    const { $libSelectAll, $libDelAll } = getEditViewElem();
                    TestUtil.triggerEvt($libSelectAll, 'click');
                    TestUtil.triggerEvt($libDelAll, 'click');

                    const { $libRows } = getEditViewElem();
                    expect($libRows.length).toBeFalsy();
                });
            });

            describe('Add Library', () => {
                it('should add valid library', () => {
                    // Modal
                    const { $libAdd } = getEditViewElem();
                    TestUtil.triggerEvt($libAdd, 'click');

                    // Input
                    const mockTitle = 'loremsum';
                    const mockUrl = 'http://abc.com';
                    const { $libTitleInput, $libValueInput, $confirm } = getModalElem();
                    TestUtil.setInputVal($libTitleInput, mockTitle);
                    TestUtil.triggerEvt($libTitleInput, 'change');
                    TestUtil.setInputVal($libValueInput, mockUrl);
                    TestUtil.triggerEvt($libValueInput, 'change');
                    TestUtil.triggerEvt($confirm, 'click');

                    const { $libRows } = getEditViewElem();
                    const $4thRowTitle = $libRows[3].querySelector(editView.LIB_TITLE).textContent;
                    const $4thRowUrl = $libRows[3].querySelector(editView.LIB_URL).textContent;
                    expect($libRows.length).toBe(4);
                    expect($4thRowTitle).toBe(mockTitle);
                    expect($4thRowUrl).toBe(mockUrl);
                });

                it('should not add invalid library', () => {
                    const { $libAdd } = getEditViewElem();
                    TestUtil.triggerEvt($libAdd, 'click');

                    const mockTitle = 'a b';
                    const mockValue = 'sum';
                    const { $confirm, $libTitleInput, $libValueInput } = getModalElem();
                    TestUtil.setInputVal($libTitleInput, mockTitle);
                    TestUtil.triggerEvt($libTitleInput, 'change');
                    TestUtil.setInputVal($libValueInput, mockValue);
                    TestUtil.triggerEvt($libValueInput, 'change');

                    expect($confirm.disabled).toBeTruthy();
                    expect($elem.querySelector(`${modal.LIB_TITLE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
                    expect($elem.querySelector(`${modal.LIB_VALUE_INPUT} + ${modal.ERR_MSG}`)).toBeTruthy();
                });
            });

            describe('Modify', () => {
                it('should set library type', () => {
                    const { $libTypeDropdown } = getEditViewElem();
                    $libTypeDropdown.value = '1';
                    TestUtil.triggerEvt($libTypeDropdown, 'change');

                    const $2ndOption = $libTypeDropdown.children[1] as HTMLOptionElement;
                    expect($2ndOption.selected).toBeTruthy();
                });

                it('should toggle async switch', () => {
                    const { $libAsyncSwitch } = getEditViewElem();
                    TestUtil.triggerEvt($libAsyncSwitch, 'click');
                    TestUtil.triggerEvt($libAsyncSwitch, 'change');

                    expect($libAsyncSwitch.checked).toBeFalsy();
                });

                it('should toggle active switch', () => {
                    const { $libActiveSwitch } = getEditViewElem();
                    TestUtil.triggerEvt($libActiveSwitch, 'click');
                    TestUtil.triggerEvt($libActiveSwitch, 'change');

                    expect($libActiveSwitch.checked).toBeTruthy();
                });

                it('should edit title/url via modal', () => {
                    const { $libEdit } = getEditViewElem();
                    TestUtil.triggerEvt($libEdit, 'click');

                    const mockTitle = 'loremsum';
                    const mockUrl = 'http://abc.com';
                    const { $libTitleInput, $libValueInput, $confirm } = getModalElem();
                    TestUtil.setInputVal($libTitleInput, mockTitle);
                    TestUtil.triggerEvt($libTitleInput, 'change');
                    TestUtil.setInputVal($libValueInput, mockUrl);
                    TestUtil.triggerEvt($libValueInput, 'change');
                    TestUtil.triggerEvt($confirm, 'click');

                    const { libTitle, libUrl } = getEditViewElem();
                    expect(libTitle).toBe(mockTitle);
                    expect(libUrl).toBe(mockUrl);
                });
            });
        });
    });
});