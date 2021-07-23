import { StateHandle } from '../../state';
import { HandlerHelper } from '../helper';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
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
        const { title, value } = HandlerHelper.getActiveItem({
                rules,
                ...activeRule,
                isActiveItem: true,
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
}