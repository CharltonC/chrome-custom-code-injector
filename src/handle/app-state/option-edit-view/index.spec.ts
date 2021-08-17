import { ChromeHandle } from '../../chrome';
import { DataHandle } from '../../data';
import { RowSelectHandle } from '../../row-select';

import { AppState } from '../../../model/app-state';
import { SettingState } from '../../../model/setting-state';
import { LocalState } from '../../../model/local-state';
import { TestUtil } from '../../../asset/ts/test-util';
import { HostRule } from '../../../model/rule';
import { AMethodSpy } from '../../../asset/ts/test-util/type';

import { OptionEditViewStateHandle } from '.';


const handle = new OptionEditViewStateHandle();

describe('Option Edit View State Handle', () => {
    const mockRecordTotal = 5;
    const mockFn = () => {};
    let mockState: AppState;
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;
    let dataHandleSpy: AMethodSpy<DataHandle>;
    let rowSelectHandleSpy: AMethodSpy<RowSelectHandle>;

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

    describe('Method - onListView', () => {
        it('should go to List view', () => {
            const { isListView } = handle.onListView(mockState).localState;
            expect(isListView).toBeTruthy();
        });
    });

    describe('Method - onActiveRuleChange', () => {
        let mockHost: HostRule;
        let mockClickedRule: any;
        let mockBasePayload: any;

        beforeEach(() => {
            mockHost = new HostRule('host-title', 'host-value');
            mockState.rules.push(mockHost);

            mockClickedRule = {
                id: 'id',
                title: 'title',
                value: 'value'
            };
            mockBasePayload = {
                isChild: true,
                parentIdx: 0,
                item: mockClickedRule
            };
        });

        it('should update a path as the current active rule', () => {
            const {
                ruleIdCtx,
                titleInput,
                valueInput
            } = handle.onActiveRuleChange(mockState, mockBasePayload).localState.editView;

            expect(ruleIdCtx.hostId).toBe(mockHost.id);
            expect(ruleIdCtx.pathId).toBe('id');
            expect(titleInput.value).toBe(mockClickedRule.title);
            expect(valueInput.value).toBe(mockClickedRule.value);
        });

        it('should update a host as the current active rule', () => {
            const mockPayload = { ...mockBasePayload, isChild: false };
            const {
                ruleIdCtx,
                titleInput,
                valueInput
            } = handle.onActiveRuleChange(mockState, mockPayload).localState.editView;

            expect(ruleIdCtx.hostId).toBe(mockClickedRule.id);
            expect(ruleIdCtx.pathId).toBeFalsy();
            expect(titleInput.value).toBe(mockClickedRule.title);
            expect(valueInput.value).toBe(mockClickedRule.value);
        });
    });

    describe('Method - onActiveTitleInput', () => {
        const mockBasePayload: any = {
            isValid: false,
            val: 'title',
            errMsg: []
        };

        beforeEach(() => {
            dataHandleSpy.setTitle.mockImplementation(mockFn);
        });

        it('should set the title input state', () => {
            const { isValid, val: value, errMsg } = mockBasePayload;
            const { titleInput } = handle.onActiveTitleInput(mockState, mockBasePayload).localState.editView;

            expect(dataHandleSpy.setTitle).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).not.toHaveBeenCalled();
            expect(titleInput).toEqual({ isValid, value, errMsg });
        });

        it('should sync/set the title in data and save to chrome if the title input is valid', () => {
            const mockPayload = { ...mockBasePayload, isValid: true };
            handle.onActiveTitleInput(mockState, mockPayload);

            expect(dataHandleSpy.setTitle).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });

    describe('Method - onActiveValueInput: should set the value input state', () => {
        const mockBasePayload: any = {
            isValid: false,
            val: 'value',
            errMsg: []
        };

        beforeEach(() => {
            dataHandleSpy.setValue.mockImplementation(mockFn);
        });

        it('should set the value input state', () => {
            const { isValid, val: value, errMsg } = mockBasePayload;
            const { valueInput } = handle.onActiveValueInput(mockState, mockBasePayload).localState.editView;

            expect(dataHandleSpy.setValue).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).not.toHaveBeenCalled();
            expect(valueInput).toEqual({ isValid, value, errMsg });
        });

        it('should sync/set the value in data and save to chrome if the value input is valid', () => {
            const mockPayload = { ...mockBasePayload, isValid: true };
            handle.onActiveValueInput(mockState, mockPayload);

            expect(dataHandleSpy.setValue).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });

    describe('Method - onActiveTabChange', () => {
        it('should set the active tab', () => {
            const mockPayload: any = {
                ruleIdCtx: { hostId: 'host' },
                idx: 1
            };
            dataHandleSpy.setLastActiveTab.mockImplementation(mockFn);
            const state = handle.onActiveTabChange(mockState, mockPayload);

            expect(state).toEqual({});
            expect(dataHandleSpy.setLastActiveTab).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });

    describe('Method - onTabToggle', () => {
        const mockRuleIdCtx: any = {};

        it('should enable/disable the js tab and save to chrome', () => {
            const mockPayload = {
                ruleIdCtx: mockRuleIdCtx,
                tab: { id: 'js' }
            };
            dataHandleSpy.toggleJsSwitch.mockImplementation(mockFn);
            handle.onTabToggle(mockState, mockPayload);

            expect(dataHandleSpy.toggleJsSwitch).toHaveBeenCalled();
            expect(dataHandleSpy.toggleCssSwitch).not.toHaveBeenCalled();
            expect(dataHandleSpy.toggleLibSwitch).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should enable/disable the css tab and save to chrome', () => {
            const mockPayload = {
                ruleIdCtx: mockRuleIdCtx,
                tab: { id: 'css' }
            };
            dataHandleSpy.toggleCssSwitch.mockImplementation(mockFn);
            handle.onTabToggle(mockState, mockPayload);

            expect(dataHandleSpy.toggleJsSwitch).not.toHaveBeenCalled();
            expect(dataHandleSpy.toggleCssSwitch).toHaveBeenCalled();
            expect(dataHandleSpy.toggleLibSwitch).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should enable/disable the library tab and save to chrome', () => {
            const mockPayload = {
                ruleIdCtx: mockRuleIdCtx,
                tab: { id: 'lib' }
            };
            dataHandleSpy.toggleLibSwitch.mockImplementation(mockFn);
            handle.onTabToggle(mockState, mockPayload);

            expect(dataHandleSpy.toggleJsSwitch).not.toHaveBeenCalled();
            expect(dataHandleSpy.toggleCssSwitch).not.toHaveBeenCalled();
            expect(dataHandleSpy.toggleLibSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should exit if tab id is not js/css/lib', () => {
            const mockPayload = {
                ruleIdCtx: mockRuleIdCtx,
                tab: { id: 'lorem' }
            };
            handle.onTabToggle(mockState, mockPayload);

            expect(dataHandleSpy.toggleJsSwitch).not.toHaveBeenCalled();
            expect(dataHandleSpy.toggleCssSwitch).not.toHaveBeenCalled();
            expect(dataHandleSpy.toggleLibSwitch).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).not.toHaveBeenCalled();
        });
    });

    describe('Method - onCodeChange', () => {
        const mockBasePayload: any = {
            ruleIdCtx: {},
            codeMirrorArgs: [null, null, 'code']
        };

        it('should set the js code value', () => {
            const mockPayload = { ...mockBasePayload, codeMode: 'js' };
            dataHandleSpy.setJsCode.mockImplementation(mockFn);
            handle.onCodeChange(mockState, mockPayload);

            expect(dataHandleSpy.setJsCode).toHaveBeenCalled();
            expect(dataHandleSpy.setCssCode).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should set the css code value', () => {
            const mockPayload = { ...mockBasePayload, codeMode: 'css' };
            dataHandleSpy.setCssCode.mockImplementation(mockFn);
            handle.onCodeChange(mockState, mockPayload);

            expect(dataHandleSpy.setJsCode).not.toHaveBeenCalled();
            expect(dataHandleSpy.setCssCode).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });

        it('should skip if neither js or css code', () => {
            const mockPayload = { ...mockBasePayload, codeMode: 'lorem' };
            handle.onCodeChange(mockState, mockPayload);

            expect(dataHandleSpy.setJsCode).not.toHaveBeenCalled();
            expect(dataHandleSpy.setCssCode).not.toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).not.toHaveBeenCalled();
        });
    });

    describe('Method - onLibSort', () => {
        it('should set the sort option for the grid', () => {
            const mockPayload: any = { sortOption: 'option' };
            const { sortOption } = handle.onLibSort(mockState, mockPayload).localState.editView.dataGrid;
            expect(sortOption).toEqual(mockPayload.sortOption);
        });
    });

    describe('Method - onLibRowSelectToggle', () => {
        it('should update the select state when a row is selected/unselected', () => {
            const mockPayload = { libs: [], id: 'id' };
            const mockSelectState = 'select-state';
            rowSelectHandleSpy.getState.mockReturnValue(mockSelectState);
            const { selectState } = handle.onLibRowSelectToggle(mockState, mockPayload).localState.editView.dataGrid;

            expect(selectState).toBe(mockSelectState);
        });
    });

    describe('Method - onLibRowsSelectToggle', () => {
        it('should update the select state when rows are selected/unselected', () => {
            const mockSelectState = 'select-state';
            rowSelectHandleSpy.getState.mockReturnValue(mockSelectState);
            const { selectState } = handle.onLibRowsSelectToggle(mockState).localState.editView.dataGrid;

            expect(selectState).toBe(mockSelectState);
        });
    });

    describe('Method - onLibTypeChange ', () => {
        it('should set the library type', () => {
            const mockPayload: any = { selectValue: 'val', id: 'id' };
            dataHandleSpy.setLibType.mockImplementation(mockFn);
            handle.onLibTypeChange(mockState, mockPayload);

            expect(dataHandleSpy.setLibType).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });

    describe('Method - onLibAsyncToggle ', () => {
        it('should enable/disable the async switch of library', () => {
            const mockPayload: any = {  id: 'id' };
            dataHandleSpy.toggleLibAsyncSwitch.mockImplementation(mockFn);
            handle.onLibAsyncToggle(mockState, mockPayload);

            expect(dataHandleSpy.toggleLibAsyncSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });

    describe('Method - onLibIsOnToggle ', () => {
        it('should enable/disable the library', () => {
            const mockPayload: any = {  id: 'id' };
            dataHandleSpy.toggleLibIsOnSwitch.mockImplementation(mockFn);
            handle.onLibIsOnToggle(mockState, mockPayload);

            expect(dataHandleSpy.toggleLibIsOnSwitch).toHaveBeenCalled();
            expect(chromeHandleSpy.saveState).toHaveBeenCalled();
        });
    });
});