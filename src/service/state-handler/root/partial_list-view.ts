import { StateHandle } from '../../store-handle';
import { AppState } from '../../../model/app-state';
import { HostRuleConfig } from '../../../model/rule-config';
import * as TPgn from '../../pagination-handle/type';

export class ListViewStateHandler extends StateHandle.BaseStoreHandler {
    onSearchTextChange({ localState }: AppState, val: string): Partial<AppState> {
        const { searchedRules } = localState;
        return {
            localState: {
                ...localState,
                searchedText: val,
                searchedRules: val ? searchedRules : null
            }
        };
    }

    onSearchTextClear({ localState }: AppState) {
        return {
            localState: {
                ...localState,
                searchedRules: null,
                searchedText: ''
            }
        };
    }

    onSearchPerform({ localState, rules }: AppState, val: string) {
        const { hsText } = this.reflect;
        const searchedRules: HostRuleConfig[] = val
            .split(/\s+/)
            .reduce((filteredRules: HostRuleConfig[], text: string) => {
                text = text.toLowerCase();

                return filteredRules.filter(({ id, value, paths }: HostRuleConfig) => {
                    // Check Row Id, Value
                    if (hsText([id, value], text)) return true;

                    // Check Sub Row Id, Value
                    return paths.some(({ id: subId, value: subValue }) => hsText([subId, subValue], text));
                });
            }, rules);

        return {
            localState: {
                ...localState,
                searchedRules,
            }
        };
    }

    onPaginate({ localState}: AppState, payload: { pgnOption: TPgn.IOption, pgnState: TPgn.IState }) {
        return {
            localState: {
                ...localState,

                // clear all selections
                selectState: {
                    areAllRowsSelected: false,
                    selectedRowKeys: {},
                },

                // Update pagination
                ...payload
            }
        };
    }

    //// HELPER
    hsText(vals: string[], text: string): boolean {
        return vals.some((val: string) => (val.toLowerCase().indexOf(text) !== -1));
    }
}