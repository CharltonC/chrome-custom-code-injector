import { StateHandle } from '../../../handle/state';
import { AppState } from '../../model/app-state';
import { LocalState } from '../../model/local-state';
import { HostRuleConfig, PathRuleConfig } from '../../model/rule-config';
import { TextInputState } from '../../model/text-input';
import { ActiveRuleState } from '../../model/active-rule';

export class EditViewStateHandler extends StateHandle.BaseStateHandler {
    onListView({localState}: AppState): Partial<AppState> {
        const { pgnOption } = localState;   // maintain the only pagination setting
        const resetLocalState = new LocalState();

        return {
            localState: {
                ...resetLocalState,
                pgnOption,
                isListView: true,
                activeRule: new ActiveRuleState(),
            }
        };
    }

    onListItemChange({ rules, localState }: AppState, payload) {
        const { isChild, idx, parentIdx } = payload;
        const itemIdx = isChild ? parentIdx : idx;
        const childItemIdx = isChild ? idx : null
        const activeRule = {
            isHost: !isChild,
            idx: itemIdx,
            pathIdx: childItemIdx
        };
        const { title, value } = this.reflect.getEditViewActiveItem({
            rules,
            ...activeRule,
        });
        const resetState = new TextInputState();

        return {
            localState: {
                ...localState,
                activeRule,
                titleInput: {
                    ...resetState,
                    value: title,
                },
                hostOrPathInput: {
                    ...resetState,
                    value
                }
            }
        };
    }

    //// Text Input
    onItemTitleChange({ rules, localState }: AppState, payload) {
        return this.reflect.onTextInputChange({
            inputKey: 'titleInput',
            payload,
            rules,
            localState,
        });
    }

    onItemHostOrPathChange({ rules, localState }: AppState, payload) {
        return this.reflect.onTextInputChange({
            inputKey: 'hostOrPathInput',
            payload,
            rules,
            localState,
        });
    }

    // TODO: Payload as object in component
    onItemJsExecStageChange({ rules, localState }: AppState, ...payload: any[]) {
        const item = this.reflect.getEditViewActiveItem({
            rules,
            ...localState.activeRule
        });
        const [, idx ] = payload;
        item.jsExecPhase = idx;

        return { rules };
    }

    // TODO: Payload as object in component
    onItemActiveTabChange({ rules, localState }: AppState, ...payload: any[]) {
        const item = this.reflect.getEditViewActiveItem({
            rules,
            ...localState.activeRule
        });

        const [, , idx] = payload;
        item.activeTabIdx = idx;

        return { rules };
    }

    // TODO: Payload as object in component
    onItemTabEnable({ rules, localState }: AppState, ...payload: any[]) {
        const item = this.reflect.getEditViewActiveItem({
            rules,
            ...localState.activeRule
        });

        const [ , { id, isOn } ] = payload;
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
        item[key] = !isOn;

        return { rules };
    }

    onItemEditorCodeChange({ rules, localState }: AppState, payload) {
        const item = this.reflect.getEditViewActiveItem({
            rules,
            ...localState.activeRule
        });
        const { codeMode, value } = payload;
        const key = `${codeMode}Code`;
        const hsKey = key in item;
        if (!hsKey) throw new Error('key does not match');

        item[key] = value;
        return { rules };
    }

    //// Helper
    // TODO: Common
    getEditViewActiveItem({ rules, isHost, idx, pathIdx }): HostRuleConfig | PathRuleConfig {
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
}