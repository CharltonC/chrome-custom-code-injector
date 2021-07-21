import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { HostRuleConfig, PathRuleConfig } from '../../../model/rule-config';
import { TextInputState } from '../../../model/text-input';
import { ActiveRuleState } from '../../../model/active-rule';

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

    //// Helper
    // TODO: Common
    getEditViewActiveItem({ rules, isHost, idx, pathIdx }): HostRuleConfig | PathRuleConfig {
        const host: HostRuleConfig = rules[idx];
        return isHost ? host : host.paths[pathIdx];
    }
}