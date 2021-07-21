import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import * as TPgn from '../../pagination/type';

export class HelperHandler extends StateHandle.BaseStateHandler {
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
    }

    // TODO: Common
    getEditViewActiveItem({ rules, isHost, idx, pathIdx }): HostRuleConfig | PathRuleConfig {
        const host: HostRuleConfig = rules[idx];
        return isHost ? host : host.paths[pathIdx];
    }

    getListViewActiveItem({ rules, isHost, idx, pathIdx }): HostRuleConfig | PathRuleConfig {
        const host: HostRuleConfig = rules[idx];
        return isHost ? host : host.paths[pathIdx];
    }

    onTextInputChange({ rules, localState, payload, inputKey }): Partial<AppState> {
        const { val, validState, isGte3 } = payload;
        const { activeRule } = localState;
        const inputState = localState[inputKey];

        if (!isGte3) return {
            localState: {
                ...localState,
                [inputKey]: {
                    isValid: false,
                    errMsg: [ 'value must be 3 characters or more' ],
                    value: val
                }
            }
        };;

        if (!validState.isValid) return {
            localState: {
                ...localState,
                [inputKey]: {
                    ...validState,
                    value: val
                }
            }
        };

        // If valid value, set the item title or value
        const item = this.reflect.getEditViewActiveItem({ rules, ...activeRule });
        const { title, value } = item;
        const isTitle = inputKey === 'titleInput';
        item.title = isTitle ? val : title;
        item.value = isTitle ? value : val;

        return {
            rules: [...rules], // force rerender
            localState: {
                ...localState,
                [inputKey]: {
                    ...inputState,
                    isValid: true,
                    value: val
                }
            }
        };
    }

    // Search Helper
    hsText(vals: string[], text: string): boolean {
        return vals.some((val: string) => (val.toLowerCase().indexOf(text) !== -1));
    }
}