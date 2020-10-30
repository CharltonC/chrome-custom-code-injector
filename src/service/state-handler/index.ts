import { StateHandle } from '../handle/state';
import { AView } from '../model/local-state/type';
import { AppState } from '../model/app-state';
import { LocalState } from '../model/local-state';
import { HostRuleConfig, PathRuleConfig } from '../model/rule-config';
import { modals } from '../constant/modals';
import { Setting } from '../model/setting';
import { resultsPerPage } from '../constant/result-per-page';

const { SETTING, IMPORT_SETTING, EXPORT_SETTING, DELETE, ADD_HOST, ADD_PATH, ADD_LIB, EDIT_LIB } = modals;

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

    setView({ localState }: AppState, currView: AView): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currView
            }
        };
    }

    //// DataGrid
    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                areAllRowsSelected: !localState.areAllRowsSelected,
                selectedRowKeys: {},        // reset existing select state for any checkboxes
            }
        };
    }

    onRowSelectToggle({ localState, rules }: AppState, idx: number) {
        const { selectRow } = this.reflect;
        const {
            areAllRowsSelected,
            selectedRowKeys: currRowKeys,
            pgnItemStartIdx, pgnIncrmIdx, pgnItemEndIdx,
        } = localState;

        const selectedRowKeys = { ...currRowKeys };
        const isCurrRowSelected = currRowKeys[idx];
        const actualRowsPerPage: number = Math.min(rules.length, resultsPerPage[pgnIncrmIdx]);

        // Add the rest of checkboxes to selected except current one
        if (areAllRowsSelected) {
            const itemEndIdx: number = pgnItemEndIdx ?? actualRowsPerPage;

            for (let i = pgnItemStartIdx; i < itemEndIdx; i++) {
                const isCurrRow = i === idx;
                const isSelected = i in selectedRowKeys;
                const isSelectedCurrRow = isCurrRow && isSelected;
                const isUnselectedOtherRows = !isCurrRow && !isSelected;

                if (isSelectedCurrRow) {
                    selectRow(selectedRowKeys, i, false);

                } else if (isUnselectedOtherRows) {
                    selectRow(selectedRowKeys, i);
                }
            }

        // Toggle the current checkbox
        } else {
            selectRow(selectedRowKeys, idx, !isCurrRowSelected);
        }

        // if All checkboxes are selected at that page AFTER the abv operation
        const wereAllRowsSelected = Object.entries(selectedRowKeys).length === actualRowsPerPage;

        return {
            localState: {
                ...localState,
                areAllRowsSelected: wereAllRowsSelected ? true : (areAllRowsSelected ? false : areAllRowsSelected),
                selectedRowKeys: wereAllRowsSelected ? {} : selectedRowKeys
            }
        };
    }

    onHttpsToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isHttps');
    }

    onJsToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isJsOn');
    }

    onCssToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isCssOn');
    }

    onLibToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isLibOn');
    }

    onJsExecStageChange({ rules }: AppState, idx: number, modIdx): Partial<AppState> {
        const clone = rules.slice();
        clone[idx].jsExecPhase = modIdx;
        return { rules: clone };
    }

    onItemEdit(state: AppState, currListItem): Partial<AppState> {
        const { localState } = state;
        const { currView } = this.reflect.onEditView(state).localState;

        return {
            localState: {
                ...localState,
                currListItem,
                currView
            }
        };
    }

    onItemRmv({ rules, localState }: AppState, idx: number, parentIdx?: number) {
        const cloneRules = rules.concat();
        const modItems = typeof parentIdx !== 'undefined' ?
            cloneRules[parentIdx].paths :
            cloneRules;

        modItems.splice(idx, 1);
        return {
            rules: cloneRules,
            localState: {
                ...localState,
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    onItemsRmv({ localState, rules }: AppState) {
        const { areAllRowsSelected, selectedRowKeys } = localState;
        let modRules: HostRuleConfig[];

        // For all rows selected
        if (areAllRowsSelected) {
            modRules = [];

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
                ...localState,
                areAllRowsSelected: false,
                selectedRowKeys: {}     // in case of side-effect on `selectedRowKeys` state
            }
        };
    }

    onListItemClick({ localState }: AppState, ...[, { item }]) {
        return {
            localState: {
                ...localState,
                currListItem: item,
            }
        };
    }

    onItemExpd({ localState }: AppState, expdState: Record<string, number>) {
        const { expdRowId } = localState;
        const [ id ]: string[] = Object.getOwnPropertyNames(expdState);

        return {
            localState: {
                ...localState,
                expdRowId: id === expdRowId ? null : id
            }
        };
    }

    toggleTbRowSwitch({ rules }: AppState, idx: number, key: string): Partial<AppState> {
        const clone = rules.slice();
        const value = clone[idx][key];
        clone[idx][key] = !value;
        return { rules: clone };
    }

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

    //// Modals
    // Generic
    openModal({ localState }: AppState, currModalId: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId
            }
        };
    }

    hideModal({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId: null
            }
        };
    }

    // Setting
    onSettingModal(state: AppState) {
        return this.reflect.openModal(state, SETTING.id);
    }

    onImportSettingModal(state: AppState) {
        return this.reflect.openModal(state, IMPORT_SETTING.id);
    }

    onExportSettingModal(state: AppState) {
        return this.reflect.openModal(state, EXPORT_SETTING.id);
    }

    // Delete
    onDelModal(appState: AppState, idx: number, parentIdx?: number) {
        const { localState, setting } = appState;

        if (!setting.showDeleteModal) {
            return this.reflect.onItemRmv(appState, idx, parentIdx);

        } else {
            return {
                localState: {
                    ...localState,
                    currModalId: DELETE.id,
                    targetChildItemIdx: idx,
                    targetItemIdx: parentIdx
                }
            };
        }
    }

    onDelModalConfirm(appState: AppState) {
        const { localState } = appState;
        const { targetChildItemIdx, targetItemIdx } = localState;
        const { rules } = this.reflect.onItemRmv(appState, targetChildItemIdx, targetItemIdx);

        return {
            rules,
            localState: {
                ...localState,
                currModalId: null,
                targetChildItemIdx: null,
                targetItemIdx: null
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

    // Add/Edit Host/Path
    onAddHostModal({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                currModalId: ADD_HOST.id,
                targetItem: new HostRuleConfig('', '')
            }
        };
    }

    onAddHostCancel({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                currModalId: null,
                targetItem: null,
            }
        };
    }

    onAddHostConfirm({ localState, rules, setting }: AppState) {
        const cloneRules = rules.concat();
        const { targetItem } = localState;

        // merge with user config before added
        Object.assign(targetItem, setting.defRuleConfig);
        cloneRules.push(localState.targetItem);

        return {
            rules: cloneRules,
            localState: {
                ...localState,
                currModalId: null,
                targetItem: null,
                allowModalConfirm: false,
                isTargetItemIdValid: false,
                isTargetItemValValid: false,
            }
        };
    }

    onAddPathModal({ localState }: AppState, idx: number) {
        return {
            localState: {
                ...localState,
                currModalId: ADD_PATH.id,
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

    onTargetItemIdChange({ localState }: AppState, { val, validState }) {
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

    onTargetItemValChange({ localState }: AppState, { val, validState }) {
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

    //// Helper (used in Reflect only)
    selectRow(selectedRowKeys, idx: number, doSelect: boolean = true) {
        selectedRowKeys[idx] = doSelect ? true : null;
        if (!doSelect) delete selectedRowKeys[idx];
    }
}