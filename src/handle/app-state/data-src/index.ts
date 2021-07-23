import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig, AActiveTabIdx } from '../../../model/rule-config';
import { HandlerHelper } from '../helper';
import * as TCheckboxTabSwitch from '../../../component/base/checkbox-tab-switch/type';

export class DataSrcStateHandler extends StateHandle.BaseStateHandler {
    //// REMOVE RULE (Host/Path; used only in `reflect`)
    onRmvItem({ localState }: AppState, idx: number, parentIdx?: number) {
        const { dataSrc } = localState;      // set by `onDelModal`
        const isSubRow = Number.isInteger(parentIdx);
        const modItems = isSubRow ? dataSrc[parentIdx].paths : dataSrc;
        modItems.splice(idx, 1);

        return {
            rules: dataSrc,
            localState: {}
        };
    }

    onRmvSearchItem(state: AppState, idx: number, parentIdx?: number) {
        const { reflect } = this;
        const { rules: currRules, localState } = state;
        const { searchedRules: currSearchedRules } = localState;
        const isSubRow = Number.isInteger(parentIdx);

        // Remove either row or sub row for searched rules
        const { rules: searchedRules } = reflect.onRmvItem(state, idx, parentIdx);

        // If Not sub row, Remove corresponding row in global rules as well
        const ruleIdx = isSubRow ? null : currRules.indexOf(currSearchedRules[idx]);
        const modRules = isSubRow ? currRules : reflect.onRmvItem({
            ...state,
            localState: {
                ...localState,
                dataSrc: currRules       // replace the ref & point to global rules
            }
        }, ruleIdx, null).rules;

        return {
            rules: modRules,
            localState: {
                searchedRules
            }
        };
    }

    onRmvItems(state: AppState) {
        const { areAllRowsSelected } = state.localState.selectState;
        const { reflect } = this;
        return areAllRowsSelected ? reflect.onRmvAllItems(state) : reflect.onRmvPartialItems(state);
    }

    onRmvAllItems({ localState }: AppState) {
        const { dataSrc, pgnOption, pgnState } = localState;
        const totalRules = dataSrc.length;
        const { startRowIdx, totalVisibleRows } = HandlerHelper.getRowIndexCtx(totalRules, pgnOption, pgnState);
        let modRules: HostRuleConfig[] = dataSrc.concat();

        // - if only 1 page regardless of pagination or not, remove all items
        // - if not, then only remove all items at that page
        if (totalRules <= totalVisibleRows) {
            modRules = [];

        } else {
            modRules.splice(startRowIdx, totalVisibleRows);
        }

        return {
            rules: modRules,
            localState: {}
        };
    }

    onRmvPartialItems({ localState }: AppState ) {
        const { selectState, dataSrc } = localState;
        const rowIndexes: [string, boolean][] = Object.entries(selectState.selectedRowKeys);
        const selectedRowsTotal: number = rowIndexes.length - 1;
        let modRules: HostRuleConfig[] = dataSrc.concat();

        // Remove the item from the end of array so that it doesnt effect the indexes from the beginning
        for (let i = selectedRowsTotal; i >= 0; i--) {
            const rowIdx: number = Number(rowIndexes[i][0]);
            modRules.splice(rowIdx, 1);
        }

        return {
            rules: modRules,
            localState: {}
        };
    }

    onRmvSearchItems(state: AppState) {
        const { reflect } = this;
        const { localState, rules } = state;
        const { searchedRules } = localState;

        // Update the searched rules
        const { rules: modSearchedRules } = reflect.onRmvItems(state);

        // Update corresponding global rules by Excluding all removed searched rows
        const removedSearchedRules = searchedRules.filter(rule => !modSearchedRules.includes(rule));
        const modRules: HostRuleConfig[] = rules.filter(rule => !removedSearchedRules.includes(rule));

        return {
            rules: modRules,
            localState: {
                searchedRules: modSearchedRules
            }
        };
    }

    //// SCRIPT EXEC STAGE & SWITCH
    onItemJsExecStepChange({ rules, localState }: AppState, payload): Partial<AppState> {
        const { isActiveItem, parentCtxIdx, ctxIdx, selectValueAttrVal } = payload;
        const item = HandlerHelper.getActiveItem({
            rules,
            isActiveItem,
            ...localState.activeRule,
            parentCtxIdx,
            ctxIdx,
        })
        item.jsExecPhase = selectValueAttrVal;
        return { rules };
    }

    onItemExecSwitchToggle({ rules, localState }: AppState, payload): Partial<AppState> {
        const {
            isActiveItem, tab,         // For Active Edit, Item
            parentCtxIdx, ctxIdx, key, // For Non-Active Item
        } = payload;

        const itemKey: string = isActiveItem ? `is${tab.id}On` : key;
        const item = HandlerHelper.getActiveItem({
            ...localState.activeRule,
            parentCtxIdx, ctxIdx,
            isActiveItem,
            rules,
        });
        item[itemKey] = !item[itemKey];
        return { rules };
    }

    onItemActiveExecTabChange({ rules, localState }: AppState, payload: TCheckboxTabSwitch.IOnTabChange) {
        const item = HandlerHelper.getActiveItem({
            rules,
            ...localState.activeRule,
            isActiveItem: true,
        });
        const { idx } = payload;
        item.activeTabIdx = idx as AActiveTabIdx;
        return { rules };
    }

    onItemExecCodeChange({ rules, localState }: AppState, payload) {
        const item = HandlerHelper.getActiveItem({
            rules,
            ...localState.activeRule,
            isActiveItem: true,
        });
        const { codeMode, value } = payload;
        const key = `${codeMode}Code`;
        const hsKey = key in item;
        if (!hsKey) throw new Error('key does not match');

        item[key] = value;
        return { rules };
    }
}