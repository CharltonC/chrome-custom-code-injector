import { TestUtil } from '../../../asset/ts/test-util';
import { RowSelectHandle } from '../../row-select';
import { DataHandle } from '../../data';
import { ChromeHandle } from '../../chrome';

import { AppState } from '../../../model/app-state';
import { SettingState } from '../../../model/setting-state';
import { LocalState } from '../../../model/local-state';
import { HostRule } from '../../../model/rule';
import { AMethodSpy } from '../../../asset/ts/test-util/type';

import { OptionListViewStateHandle } from '.';

const handle = new OptionListViewStateHandle();

describe('Option List View State Handle', () => {
    const mockRecordTotal = 5;
    const mockFn = () => {};
    let mockState: AppState;
    let rowSelectHandleSpy: AMethodSpy<RowSelectHandle>;
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;
    let dataHandleSpy: AMethodSpy<DataHandle>;

    beforeEach(() => {
        rowSelectHandleSpy = TestUtil.spyProtoMethods(RowSelectHandle);
        dataHandleSpy = TestUtil.spyProtoMethods(DataHandle);
        chromeHandleSpy = TestUtil.spyProtoMethods(ChromeHandle);
        chromeHandleSpy.saveState.mockImplementation(mockFn);

        mockState = {
            setting: new SettingState(),
            rules: [],
            localState: new LocalState(mockRecordTotal)
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Search', () => {
        it('Method - onSearchTextChange: should set search text', () => {
            const mockPayload = { value: 'lorem' };
            const { searchText } = handle.onSearchTextChange(mockState, mockPayload).localState.listView;
            expect(searchText).toBe(mockPayload.value);
        });

        it('Method - onSearchTextClear: should clear search text', () => {
            const { searchText } = handle.onSearchTextClear(mockState).localState.listView;
            expect(searchText).toBeFalsy();
        });
    });

    describe('Pagination, Sorting, Row Select, Row Expand', () => {
        it('Method - onPaginate: should set pagination option/state and clear row select state', () => {
            const mockPayload: any = {
                pgnOption: 'pgn-option',
                pgnState: 'pgn-state'
            };
            const { listView } = handle.onPaginate(mockState, mockPayload).localState;
            const { selectState, pgnOption, pgnState } = listView.dataGrid;

            expect(selectState).toEqual({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {},
            });
            expect(pgnOption).toEqual(mockPayload.pgnOption);
            expect(pgnState).toEqual(mockPayload.pgnState);
        });

        it('Method - onSort: should set sort option', () => {
            const mockPayload: any = { sortOption: 'sort-option' };
            const { sortOption } = handle.onSort(mockState, mockPayload).localState.listView.dataGrid;
            expect(sortOption).toEqual(mockPayload.sortOption);
        });

        it('Method - onRowSelectToggle: should set row select state when a row select is toggled', () => {
            const mockRtnSelectState = 'select-state';
            const mockPayload = { dataSrc: [], hostId: 'host' };
            rowSelectHandleSpy.getState.mockReturnValue(mockRtnSelectState);
            const { selectState } = handle.onRowSelectToggle(mockState, mockPayload).localState.listView.dataGrid;

            expect(selectState).toBe(mockRtnSelectState);
        });

        it('Method - onRowsSelectToggle: should set row select state when rows select is toggled', () => {
            const mockRtnSelectState = 'select-state';
            rowSelectHandleSpy.getState.mockReturnValue(mockRtnSelectState);
            const { selectState } = handle.onRowsSelectToggle(mockState).localState.listView.dataGrid;

            expect(selectState).toBe(mockRtnSelectState);
        });

        describe('Method - onRowExpand', () => {
            const mockHostId = 'host';
            const mockPayload = { hostId: mockHostId };

            it('should set as current row id if it is not same as the clicked host id', () => {
                const { expdRowId } = handle.onRowExpand(mockState, mockPayload).localState.listView.dataGrid;
                expect(expdRowId).toBe(mockHostId);
            });

            it('should unset as the current row id if the host id is already same as current expand id', () => {
                mockState.localState.listView.dataGrid.expdRowId = mockHostId;
                const { expdRowId } = handle.onRowExpand(mockState, mockPayload).localState.listView.dataGrid;

                expect(expdRowId).toBeFalsy();
            });
        });
    });

    describe('Edit Mode and Rule CRUD', () => {
        const mockPayload: any = {
            hostId: 'host',
            pathId: 'path',
        };

        it('Method - onEditView: should switch to edit mode/view for the target rule', () => {
            const mockRtnRule = new HostRule('title', 'value');
            dataHandleSpy.getRuleFromIdCtx.mockReturnValue(mockRtnRule);
            const { isListView, editView } = handle.onEditView(mockState, mockPayload).localState;
            const { ruleIdCtx, titleInput, valueInput } = editView;

            expect(isListView).toBeFalsy();
            expect(ruleIdCtx).toEqual(mockPayload);
            expect(titleInput.value).toBe(mockRtnRule.title);
            expect(valueInput.value).toBe(mockRtnRule.value);
        });

        it('should enable/disable the HTTPS and save to chrome', () => {
            dataHandleSpy.toggleHttpsSwitch.mockImplementation(mockFn);
            const state = handle.onHttpsToggle(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.toggleHttpsSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should enable/disable the exact match and save to chrome', () => {
            dataHandleSpy.toggleExactSwitch.mockImplementation(mockFn);
            const state = handle.onExactMatchToggle(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.toggleExactSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should set the js execution step and save to chrome', () => {
            dataHandleSpy.toggleJsExecStep.mockImplementation(mockFn);
            const state = handle.onJsExecStepChange(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.toggleJsExecStep).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should enable/disable the js and save to chrome', () => {
            dataHandleSpy.toggleJsSwitch.mockImplementation(mockFn);
            const state = handle.onJsToggle(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.toggleJsSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should enable/disable the css and save to chrome', () => {
            dataHandleSpy.toggleCssSwitch.mockImplementation(mockFn);
            const state = handle.onCssToggle(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.toggleCssSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should enable/disable the library and save to chrome', () => {
            dataHandleSpy.toggleLibSwitch.mockImplementation(mockFn);
            const state = handle.onLibToggle(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.toggleLibSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });
});
