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
        const { areAllRowsSelected, searchedRules, selectedRowKeys, pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx } = localState;
        const totalRules: number = searchedRules?.length || rules.length;

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

    onImportConfigModal(state: AppState) {
        return this.reflect.onModalOpen(state, importConfig.id);
    }

    onExportConfigModal(state: AppState) {
        return this.reflect.onModalOpen(state, exportConfig.id);
    }

    // Delete
    onDelModal(appState: AppState, idx?: number, parentIdx?: number) {
        const { localState, setting } = appState;
        const { showDeleteModal } = setting;
        const isDelSingleItem = typeof idx !== 'undefined';
        const partialModState: Partial<AppState> = {
            localState: isDelSingleItem ? {
                    ...localState,
                    currModalId: removeConfirm.id,
                    targetChildItemIdx: idx,
                    targetItemIdx: parentIdx
                } : {
                    ...localState,
                    currModalId: removeConfirm.id
                }
        };
        return showDeleteModal ? partialModState : this.reflect.onDelModalConfirm({...appState, ...partialModState});
    }

    onDelModalConfirm(state: AppState) {
        const { targetChildItemIdx, targetItemIdx, searchedRules } = state.localState;
        const isDelSingleItem = Number.isInteger(targetChildItemIdx);
        const hsSearchResults = searchedRules?.length;

        const resetLocalState = {
            ...this.reflect.onModalCancel(state).localState,
            pgnPageIdx: 0,
            pgnItemStartIdx: 0,
            pgnItemEndIdx: null
        };

        if (isDelSingleItem) {
            const { rules, localState } = hsSearchResults ?
                this.reflect.rmvSearchedRow(state, targetChildItemIdx, targetItemIdx) :
                this.reflect.rmvRow(state, targetChildItemIdx, targetItemIdx);

            return {
                rules,
                localState: {
                    ...localState,
                    ...resetLocalState,
                }
            };

        // If remove all items
        } else {
            const { rules, localState } = hsSearchResults ?
                this.reflect.rmvSearchedRows(state) :
                this.reflect.rmvRows(state);

            return {
                localState: {
                    ...localState,
                    ...resetLocalState,
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
        const rulesCopy = rules.concat();
        const modItems = isNumber(parentIdx) ? rulesCopy[parentIdx].paths : rulesCopy;
        modItems.splice(idx, 1);

        return {
            rules: rulesCopy,
            localState: {
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    rmvSearchedRow({ rules: currRules, localState: currLocalState }: AppState, idx: number, parentIdx?: number) {
        const { searchedRules } = currLocalState;
        const searchedRulesCopy = searchedRules.concat();
        const isPathRule = isNumber(parentIdx);
        const idxInRules = currRules.indexOf(searchedRulesCopy[isPathRule ? parentIdx : idx], 0);

        // modify the global rules
        const { rules, localState } = this.reflect.rmvRow({ rules: currRules } as any, idxInRules, parentIdx);

        // We only need to modify the searched rule if it is NOT a child item, in order to async with the global rules
        if (!isPathRule) searchedRulesCopy.splice(idx, 1);

        return {
            rules,
            localState: {
                ...localState,
                searchedRules: searchedRulesCopy,
            }
        }

    }

    rmvRows({ localState, rules }: AppState) {
        const { getRowIndexCtx } = this.reflect;
        const totalRules = rules.length;
        const { areAllRowsSelected, selectedRowKeys, pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx } = localState;
        const { startRowIdx, totalVisibleRows } = getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules });
        let modRules: HostRuleConfig[] = rules.concat();

        // For all rows selected
        if (areAllRowsSelected) {
            // - if only 1 page regardless of pagination or not, remove all items
            // - if not, then only remove all items at that page
            const hsOnlyOnePage = totalRules <= totalVisibleRows;
            if (hsOnlyOnePage) {
                modRules = [];
            } else {
                modRules.splice(startRowIdx, totalVisibleRows);
            }

        // For partial rows selected
        } else {
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

    rmvSearchedRows({ localState, rules }: AppState) {
        const { searchedRules,
            areAllRowsSelected, selectedRowKeys,
            pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx
        } = localState;

        // Contextual to Searched Rules (not the global rules)
        const totalRules = searchedRules.length;
        const { startRowIdx, totalVisibleRows } = this.reflect.getRowIndexCtx({ pgnIncrmIdx, pgnItemStartIdx, pgnItemEndIdx, totalRules });

        let modSearchedRules: HostRuleConfig[] = searchedRules.concat();
        let modRules: HostRuleConfig[];

        // For all rows selected
        if (areAllRowsSelected) {
            const hsOnlyOnePage = totalRules <= totalVisibleRows;

            // If only 1 page, i.e. all selected
            if (hsOnlyOnePage) {
                modSearchedRules = [];
                modRules = rules.filter((rule) => {
                    // exclude all the rules that are in `searchRules` (i.e. the removed ones in `modSearchedRules`)
                    return !searchedRules.includes(rule);
                });

            // If > 1 page, i.e. only all selected at that page
            } else {
                const rmvRules = searchedRules.slice(startRowIdx, pgnItemEndIdx);
                modSearchedRules.splice(startRowIdx, totalVisibleRows);
                modRules = rules.filter((rule) => !rmvRules.includes(rule));
            }

        // For partial rows selected
        } else {
            const rowIndexes: [string, boolean][] = Object.entries(selectedRowKeys);
            const selectedRowsTotal: number = rowIndexes.length - 1;

            // Remove the item from the end of array so that it doesnt effect the indexes from the beginning
            for (let i = selectedRowsTotal; i >= 0; i--) {
                const rowIdx: number = Number(rowIndexes[i][0]);
                modSearchedRules.splice(rowIdx, 1);
            }

            // Update the global rules
            modRules = rules.filter((rule) => modSearchedRules.includes(rule));
        }

        // TODO: clear pagination index as well
        return {
            rules: modRules,
            localState: {
                searchedRules: modSearchedRules,
                areAllRowsSelected: false,
                selectedRowKeys: {},     // in case of side-effect on `selectedRowKeys` state
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