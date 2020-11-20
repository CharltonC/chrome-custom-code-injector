import { StateHandle } from '../../state-handle';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import * as TPgn from '../../pagination-handle/type';
import * as TSort from '../../sort-handle/type';

export class GeneralStateHandler extends StateHandle.BaseStoreHandler {
    //// Common
    // TODO: debounce at component
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
                // TODO: case insensitive
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

    //// List View
    onListView({localState}: AppState): Partial<AppState> {
        const { pgnOption } = localState;   // maintain the only pagination setting
        const resetLocalState = new LocalState();

        return {
            localState: {
                ...resetLocalState,
                pgnOption,
                editViewTarget: null
            }
        };
    }

    onListItemClick({ localState }: AppState, ...[, { item }]) {
        return {
            localState: {
                ...localState,
                editViewTarget: item,
            }
        };
    }

    //// Edit View
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

    onSort({ localState }: AppState, { sortOption }: { sortOption: TSort.IOption, sortState: TSort.IState }) {
        return {
            localState: {
                ...localState,
                sortOption
            }
        };
    }

    onActiveTabChange({ localState }: AppState, ...[,,idx]: any[]) {
        const modLocalState = { ...localState };
        modLocalState.editViewTarget.activeTabIdx = idx;

        return {
            localState: modLocalState
        };
    }

    onTabEnable({ localState }: AppState, evt, { id, isOn }) {
        const modLocalState = { ...localState };
        let key: string;

        switch(id) {
            case 'css':
                key = 'isCssOn';
                break;
            case 'js':
                key = 'isJsOn';
                break;
            case 'lib':
                key = 'isLibOn';
                break;
            default:
                throw new Error('key does not match');
        }

        modLocalState.editViewTarget[key] = !isOn;

        return {
            localState: modLocalState
        };
    }

    onEditorCodeChange({ localState }: AppState, { codeMode, value }) {
        const modLocalState = { ...localState };
        const key: string = `${codeMode}Code`;
        const hsKey = key in modLocalState.editViewTarget;

        if (!hsKey) throw new Error('key does not match');

        modLocalState.editViewTarget[key] = value;
        return {
            localState: modLocalState
        };
    }
}