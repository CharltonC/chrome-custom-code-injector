import { AppState } from '../../../model/app-state';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import * as TPgn from '../../pagination/type';

export const HandlerHelper = {
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
    getRowIndexCtx(totalRules: number, pgnOption: TPgn.IOption, pgnState: TPgn.IState) {
        const { increment, incrementIdx } = pgnOption;
        const { startIdx, endIdx } = pgnState;

        // either the total no. of results per page OR the total results
        // - e.g. 10 per page, 5 total results --> max no. of items shown on that page is 5
        // - e.g. 5 per page, 10 results --> max no. of items shown on that page is 5
        const totalVisibleRowsAllowed: number = Math.min(totalRules, increment[incrementIdx]);

        // Find in the actual end index of the row in the actual data based on the pagination context
        const assumeEndIdx: number = startIdx + (Number.isInteger(endIdx) ? endIdx : totalVisibleRowsAllowed);
        const endRowIdx: number = assumeEndIdx <= totalRules ? assumeEndIdx : totalRules;

        return {
            startRowIdx: startIdx,
            endRowIdx,
            totalVisibleRows: endRowIdx - startIdx,
            totalVisibleRowsAllowed
        };
    },

    getActiveItem({ rules, isHost, idx, pathIdx }): HostRuleConfig | PathRuleConfig {
        const host: HostRuleConfig = rules[idx];
        return isHost ? host : host.paths[pathIdx];
    },

    onTextInputChange(arg): Partial<AppState> {
        const {
            rules, localState,
            isInModal, inputKey, key,
            val, isValid, errMsg
        } = arg;

        // If Text input is inside Modal, Check valid state of other text inputs within the same Modal
        let modalConfirmState = {};
        if (isInModal) {
            const inputKeys = ['titleInput', 'hostOrPathInput'];
            modalConfirmState = {
                isModalConfirmBtnEnabled: isValid && inputKeys
                    .filter(key => key !== inputKey)
                    .every(key => localState[key].isValid)
            };
        }

        const baseState = {
            localState: {
                ...localState,
                ...modalConfirmState,
                [inputKey]: {
                    isValid,
                    errMsg,
                    value: val
                }
            }
        };

        // If not vaild, we only update the temporary value of the input
        if (!isValid || isInModal) return baseState;

        // If valid value, set/sync the item title or value
        const { activeRule } = localState;
        const item = this.getActiveItem({ rules, ...activeRule });
        item[key] = val;
        return {
            ...baseState,
            rules: [...rules], // force rerender for Side Nav
        };
    },

    // Search Helper
    hsText(vals: string[], text: string): boolean {
        return vals.some((val: string) => (val.toLowerCase().indexOf(text) !== -1));
    },
}