import { RowSelectHandle } from '../../handle/row-select';
import { StateHandle } from '../../handle/state';
import { AView } from '../../model/local-state/type';
import { AppState } from '../../model/app-state';
import { LocalState } from '../../model/local-state';
import { HostRuleConfig, PathRuleConfig } from '../../model/rule-config';
import { modals } from '../../constant/modals';
import { Setting } from '../../model/setting';
import { resultsPerPage } from '../../constant/result-per-page';
import { FileHandle } from '../../handle/file';
import { isNumber } from 'util';

const { defSetting, importConfig, exportConfig, removeConfirm, editHost, editPath, addLib, editLib } = modals;
const fileHandle = new FileHandle();
const rowSelectHandle = new RowSelectHandle();

export class StateHandler extends StateHandle.BaseStoreHandler {
    //// Router/Views
    onListView(state: AppState): Partial<AppState> {
        const { currView } = this.reflect.setView(state, 'LIST').localState;
        const { pgnIncrmIdx } = state.localState;   // maintain the only pagination setting
        const resetLocalState = new LocalState();

        return {
            localState: {
                ...resetLocalState,
                pgnIncrmIdx,
                currView,
            }
        };
    }

    onEditView(state: AppState) {
        return this.reflect.setView(state, 'EDIT');
    }

    //// DataGrid
    onPaginate({ localState}: AppState, { curr, perPage, startIdx, endIdx }) {
        const pgnIncrmIdx: number = resultsPerPage.indexOf(perPage);

        return {
            localState: {
                ...localState,

                // clear all selections
                areAllRowsSelected: false,
                selectedRowKeys: {},

                // pagination state
                pgnPageIdx: curr,
                pgnIncrmIdx,
                pgnItemStartIdx: startIdx,
                pgnItemEndIdx: endIdx,
            }
        };
    }

    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const { areAllRowsSelected, selectedRowKeys } = localState;

        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: { areAllRowsSelected, selectedRowKeys }
        });

        return {
            localState: { ...localState, ...rowSelectState }
        };
    }

    onRowSelectToggle({ localState, rules }: AppState, rowIdx: number) {
        const { areAllRowsSelected, selectedRowKeys, pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx } = localState;
        const totalRules: number = rules.length;

        const { startRowIdx, endRowIdx } = this.reflect.getRowIndexCtx({
            totalRules,
            pgnIncrmIdx,
            pgnItemStartIdx,
            pgnItemEndIdx
        });

        const rowSelectState = rowSelectHandle.getState({
            isAll: false,
            currState: { areAllRowsSelected, selectedRowKeys },
            rowsCtx: { startRowIdx, endRowIdx, rowIdx }
        });

        return {
            localState: { ...localState, ...rowSelectState }
        };
    }

    onRowJsStageChange({ rules }: AppState, idx: number, modIdx): Partial<AppState> {
        const clone = rules.slice();
        clone[idx].jsExecPhase = modIdx;
        return { rules: clone };
    }

    onRowEdit(state: AppState, targetItem): Partial<AppState> {
        const { localState } = state;
        const { currView } = this.reflect.onEditView(state).localState;

        return {
            localState: {
                ...localState,
                targetItem,
                currView
            }
        };
    }

    onRowExpand({ localState }: AppState, expdState: Record<string, number>) {
        const { expdRowId } = localState;
        const [ id ]: string[] = Object.getOwnPropertyNames(expdState);

        return {
            localState: {
                ...localState,
                expdRowId: id === expdRowId ? null : id
            }
        };
    }

    //// Edit View
    onListItemClick({ localState }: AppState, ...[, { item }]) {
        return {
            localState: {
                ...localState,
                targetItem: item,
            }
        };
    }

    //// Search
    // TODO: debounce
    onSearch({ localState, rules }: AppState, evt, val: string, gte3Char: boolean): Partial<AppState> {
        const baseLocalState = {
            ...localState,
            searchedText: val
        };

        if (!val) return {
            localState: {
                ...baseLocalState,
                searchedRules: null,
            }
        };

        if (!gte3Char) return { localState: baseLocalState };

        const searchedRules: HostRuleConfig[] = val
            .split(/\s+/)
            .reduce((filteredRules: HostRuleConfig[], text: string) => {
                return filteredRules.filter(({ id, value, paths }: HostRuleConfig) => {
                    const isIdMatch = id.indexOf(text) !== -1;
                    if (isIdMatch) return true;

                    const isValMatch = value.indexOf(text) !== -1;
                    if (isValMatch) return true;

                    return paths.some(({ id: childId, value: childValue}) => {
                        return (childId.indexOf(text) !== -1) || (childValue.indexOf(text) !== -1);
                    });
                });
            }, rules);

        return {
            localState: {
                ...baseLocalState,
                searchedRules,
            }
        };
    }

    onSearchClear({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                searchedRules: null,
                searchedText: ''
            }
        };
    }

    //// Settings
    onResultsPerPageChange({ setting }: AppState, resultsPerPageIdx: number) {
        return {
            setting: {
                ...setting,
                resultsPerPageIdx
            }
        };
    }

    onResetAll() {
        return {
            setting: new Setting()
        };
    }

    onDefHostRuleToggle({ setting }: AppState, key: string) {
        const { defRuleConfig } = setting;
        const isValid: boolean = key in defRuleConfig && typeof defRuleConfig[key] === 'boolean';
        if (!isValid) throw new Error('key is not valid');
        const val: boolean = defRuleConfig[key];

        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    [key]: !val
                }
            }
        };
    }

    onDefJsExecStageChange({ setting }: AppState, evt, idx: number) {
        const { defRuleConfig } = setting;
        return {
            setting: {
                ...setting,
                defRuleConfig: {
                    ...defRuleConfig,
                    jsExecPhase: idx
                }
            }
        };
    }

    onDelConfirmToggle({ setting }: AppState) {
        return {
            setting: {
                ...setting,
                showDeleteModal: !setting.showDeleteModal
            }
        };
    }

    //// Modals
    // Generic
    onModalOpen({ localState }: AppState, currModalId: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId
            }
        };
    }

    onModalCancel({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId: null,
                allowModalConfirm: false,
                targetItem: null,
                targetItemIdx: null,
                targetChildItemIdx: null,
                isTargetItemIdValid:  false,
                isTargetItemValValid:  false,
            }
        };
    }

    // Setting
    onSettingModal(state: AppState) {
        return this.reflect.onModalOpen(state, defSetting.id);
    }

    onimportConfigModal(state: AppState) {
        return this.reflect.onModalOpen(state, importConfig.id);
    }

    onexportConfigModal(state: AppState) {
        return this.reflect.onModalOpen(state, exportConfig.id);
    }

    // Delete
    onDelModal(appState: AppState, idx?: number, parentIdx?: number) {
        const { rmvRow, rmvRows } = this.reflect;
        const { localState, setting } = appState;
        const isDelSingleItem = typeof idx !== 'undefined';

        // Direct delete w/o confirmation
        if (!setting.showDeleteModal) return isDelSingleItem ?
            rmvRow(appState, idx, parentIdx) :
            rmvRows(appState);

        // With confirmation (set the cache so when `onDelModalConfirm` know the context of the item)
        return isDelSingleItem ? {
            localState: {
                ...localState,
                currModalId: removeConfirm.id,
                targetChildItemIdx: idx,
                targetItemIdx: parentIdx
            }
        } : {
            localState: {
                ...localState,
                currModalId: removeConfirm.id
            }
        };
    }

    onDelModalConfirm(state: AppState) {
        const { targetChildItemIdx, targetItemIdx } = state.localState;
        const isDelSingleItem = Number.isInteger(targetChildItemIdx);
        const baseResetLocalState = this.reflect.onModalCancel(state);

        if (isDelSingleItem) {
            const { rules } = this.reflect.rmvRow(state, targetChildItemIdx, targetItemIdx);
            return {
                ...baseResetLocalState,
                rules
            };

        } else {
            const { rules, localState } = this.reflect.rmvRows(state);
            return {
                localState: {
                    ...baseResetLocalState.localState,
                    ...localState
                },
                rules
            };
        }
    }

    // Add/Edit Host/Path
    onAddHostModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                currModalId: editHost.id,
                targetItem: new HostRuleConfig('', '')
            }
        };
    }

    onAddHostConfirm(state: AppState) {
        const { localState, rules, setting } = state;
        const cloneRules = rules.concat();
        const { targetItem } = localState;
        const resetState = this.reflect.onModalCancel(state);

        // merge with user config before added
        Object.assign(targetItem, setting.defRuleConfig);
        cloneRules.push(localState.targetItem);

        return {
            ...resetState,
            rules: cloneRules
        };
    }

    onAddPathModal({ localState }: AppState, idx: number) {
        return {
            localState: {
                ...localState,
                currModalId: editPath.id,
                targetItemIdx: idx,
                targetItem: new PathRuleConfig('', '')
            }
        };
    }

    onAddPathConfirm({ localState, rules, setting }: AppState) {
        const cloneRules = rules.concat();
        const { targetItem, targetItemIdx } = localState;
        const { isHttps, ...defConfig } = setting.defRuleConfig

        // merge with user config before added
        Object.assign(targetItem, defConfig);
        cloneRules[targetItemIdx].paths.push(targetItem);

        return {
            rules: cloneRules,
            localState: {
                ...localState,
                currModalId: null,
                targetItemIdx: null,
                allowModalConfirm: false,
                isTargetItemIdValid: false,
                isTargetItemValValid: false,
            }
        };
    }

    // Modal Input (common)
    onEditItemIdChange({ localState }: AppState, { val, validState }) {
        const { targetItem, isTargetItemValValid } = localState;
        return {
            localState: {
                ...localState,
                isTargetItemIdValid: validState.isValid,
                allowModalConfirm: isTargetItemValValid && validState.isValid,
                targetItem: {
                    ...targetItem,
                    id: val
                },
            }
        };
    }

    onEditItemValChange({ localState }: AppState, { val, validState }) {
        const { targetItem, isTargetItemIdValid } = localState;
        return {
            localState: {
                ...localState,
                isTargetItemValValid: validState.isValid,
                allowModalConfirm: isTargetItemIdValid && validState.isValid,
                targetItem: {
                    ...targetItem,
                    value: val
                },
            }
        };
    }

    onImportFileChange({ localState }, { target }, { isValid }) {
        return {
            localState: {
                ...localState,
                importFile: target.files.item(0),
                allowModalConfirm: isValid
            }
        };
    }

    async onImportModalConfirm({ localState }: AppState) {
        return {
            rules: await fileHandle.readJson(localState.importFile),
            localState: {
                ...localState,
                currView: 'LIST',
                allowModalConfirm: false,
                importFile: null,
                currModalId: null
            }
        };
    }

    onExportFileNameChange({ localState }: AppState, { validState, val }) {
        const isValid = validState?.isValid ?? true;

        return {
            localState: {
                ...localState,
                allowModalConfirm: isValid,
                exportFileName: isValid ? val : null
            }
        };
    }

    onExportModalConfirm({ rules, localState }: AppState) {
        const { exportFileName } = localState;
        fileHandle.saveJson(rules, exportFileName, true);

        return {
            localState: {
                ...localState,
                currModalId: null,
                allowModalConfirm: false,
                exportFileName: null
            }
        };
    }

    //// Helper (used in Reflect only)
    onRowSwitchToggle({ rules }: AppState, idx: number, key: string): Partial<AppState> {
        const clone = rules.slice();
        const value = clone[idx][key];
        clone[idx][key] = !value;
        return { rules: clone };
    }

    rmvRow({ rules }: AppState, idx: number, parentIdx?: number) {
        const cloneRules = rules.concat();
        const modItems = typeof parentIdx !== 'undefined' ?
            cloneRules[parentIdx].paths :
            cloneRules;

        modItems.splice(idx, 1);

        return {
            rules: cloneRules,
            localState: {
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    rmvRows({ localState, rules }: AppState) {
        const { getRowIndexCtx } = this.reflect;
        const totalRules = rules.length;
        const { areAllRowsSelected, selectedRowKeys, pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx } = localState;
        const { startRowIdx, totalVisibleRows } = getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules });
        let modRules: HostRuleConfig[];

        // For all rows selected
        if (areAllRowsSelected) {
            // - if only 1 page regardless of pagination or not, remove all items
            // - if not, then only remove all items at that page
            const hsOnlyOnePage = totalRules <= totalVisibleRows;
            modRules = hsOnlyOnePage ? [] : rules.concat().splice(startRowIdx, totalVisibleRows);

        // For partial rows selected
        } else {
            modRules = rules.concat();
            const rowIndexes: [string, boolean][] = Object.entries(selectedRowKeys);
            const selectedRowsTotal: number = rowIndexes.length - 1;

            // Remove the item from the end of array so that it doesnt effect the indexes from the beginning
            for (let i = selectedRowsTotal; i >= 0; i--) {
                const rowIdx: number = Number(rowIndexes[i][0]);
                modRules.splice(rowIdx, 1);
            }
        }

        return {
            rules: modRules,
            localState: {
                areAllRowsSelected: false,
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    /**
     *
     * Formula for calculating a row's end index used for rows removal at a specific page when all rows are selected
     * - e.g.
     * Total Rows | Per Page | Start Row Index | Removal Indexes | End Index (which needs to be calculated)
     * -----------------------------------------------------------------
     * 3          | 2        | 0               | 0-1             | 2
     * 3          | 2        | 2               | 2               | 3
     * 5          | 10       | 0               | 0-4             | 5
     * 2          | 1        | 0               | 0               | 1
     * 2          | 1        | 1               | 1               | 2
     */
    // TODO: param type & rtn type
    getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules }) {
        // either the total no. of results per page OR the total results
        // - e.g. 10 per page, 5 total results --> max no. of items shown on that page is 5
        // - e.g. 5 per page, 10 results --> max no. of items shown on that page is 5
        const totalVisibleRowsAllowed: number = Math.min(totalRules, resultsPerPage[pgnIncrmIdx]);

        // Find in the actual end index of the row in the actual data based on the pagination context
        const assumeEndIdx: number = pgnItemStartIdx + (isNumber(pgnItemEndIdx) ? pgnItemEndIdx : totalVisibleRowsAllowed);
        const endRowIdx: number = assumeEndIdx <= totalRules ? assumeEndIdx : totalRules;

        return {
            startRowIdx: pgnItemStartIdx,
            endRowIdx,
            totalVisibleRows: endRowIdx - pgnItemStartIdx,
            totalVisibleRowsAllowed
        };
    }

    setView({ localState }: AppState, currView: AView): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currView
            }
        };
    }
}