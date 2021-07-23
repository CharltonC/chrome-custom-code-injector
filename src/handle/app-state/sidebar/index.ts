import { StateHandle } from '../../state';
import { HandlerHelper } from '../helper';
import { AppState } from '../../../model/app-state';
import { TextInputState } from '../../../model/text-input-state';

export class SidebarStateHandler extends StateHandle.BaseStateHandler {
    onActiveItemChange({ rules, localState }: AppState, payload) {
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