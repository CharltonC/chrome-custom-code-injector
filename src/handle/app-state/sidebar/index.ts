import { StateHandle } from '../../state';
import { HandlerHelper } from '../helper';
import { AppState } from '../../../model/app-state';
import { TextInputState } from '../../../model/text-input-state';
import { DataGridState } from '../../../model/data-grid-state';
import { LibRuleConfig } from '../../../model/rule-config';
import * as TSideNav from '../../../component/base/side-nav/type';

export class SidebarStateHandler extends StateHandle.BaseStateHandler {
    onActiveItemChange({ rules, localState }: AppState, payload: TSideNav.IClickEvtArg): Partial<AppState> {
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
        const resetInputState = new TextInputState();
        const resetLibDatagridState = new DataGridState<LibRuleConfig>();

        return {
            localState: {
                ...localState,
                activeRule,
                activeTitleInput: {
                    ...resetInputState,
                    value: title,
                },
                activeValueInput: {
                    ...resetInputState,
                    value
                },
                libDataGrid: resetLibDatagridState
            }
        };
    }
}