import { StateHandle } from '../../../handle/state';
import { AppState } from '../../model/app-state';
import { LocalState } from '../../model/local-state';
import { HostRuleConfig, PathRuleConfig } from '../../model/rule-config';
import { TextInputState } from '../../model/text-input';

export class EditViewStateHandler extends StateHandle.BaseStateHandler {
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

    onListItemChange({ rules, localState }: AppState, payload) {
        const { isChild, idx, parentIdx } = payload;
        const itemIdx = isChild ? parentIdx : idx;
        const childItemIdx = isChild ? idx : null
        const { title, value } = this.reflect.getActiveItem({
            rules,
            itemIdx,
            childItemIdx
        });
        const resetState = new TextInputState();

        return {
            localState: {
                ...localState,
                editViewTarget: {
                    itemIdx,
                    childItemIdx
                },
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
        const item = this.reflect.getActiveItem({
            rules,
            ...localState.editViewTarget
        });
        const [, idx ] = payload;
        item.jsExecPhase = idx;

        return { rules };
    }

    // TODO: Payload as object in component
    onItemActiveTabChange({ rules, localState }: AppState, ...payload: any[]) {
        const item = this.reflect.getActiveItem({
            rules,
            ...localState.editViewTarget
        });

        const [, , idx] = payload;
        item.activeTabIdx = idx;

        return { rules };
    }

    // TODO: Payload as object in component
    onItemTabEnable({ rules, localState }: AppState, ...payload: any[]) {
        const item = this.reflect.getActiveItem({
            rules,
            ...localState.editViewTarget
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
        const item = this.reflect.getActiveItem({
            rules,
            ...localState.editViewTarget
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
    getActiveItem({ rules, itemIdx, childItemIdx }): HostRuleConfig | PathRuleConfig {
        const isChild = Number.isInteger(childItemIdx);
        const host: HostRuleConfig = rules[itemIdx];
        return isChild ? host.paths[childItemIdx] : host;
    }

    onTextInputChange({ rules, localState, payload, inputKey }): Partial<AppState> {
        const { val, validState, isGte3 } = payload;
        const { editViewTarget } = localState;
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
        const item = this.reflect.getActiveItem({ rules, ...editViewTarget });
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