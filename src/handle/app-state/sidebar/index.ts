import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { TextInputState } from '../../../model/text-input-state';
import { DataGridState } from '../../../model/data-grid-state';
import { LibRuleConfig } from '../../../model/rule-config';
import * as TSideNav from '../../../component/base/side-nav/type';

export class SidebarStateHandler extends StateHandle.BaseStateHandler {
    onActiveItemChange({ rules, localState }: AppState, payload: TSideNav.IClickEvtArg): Partial<AppState> {
        const { isChild, idx, parentIdx } = payload;
        const isHost = !isChild;
        const ruleIdx = isHost ? idx : parentIdx;
        const pathIdx = isChild ? idx : null;
        const item = isHost ? rules[ruleIdx] : rules[ruleIdx].paths[pathIdx];
        const { title, value } = item;
        const resetInputState = new TextInputState();
        const resetLibDatagridState = new DataGridState<LibRuleConfig>();

        return {
            localState: {
                ...localState,
                activeRule: {
                    isHost,
                    item,
                    ruleIdx,
                    pathIdx,
                },
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