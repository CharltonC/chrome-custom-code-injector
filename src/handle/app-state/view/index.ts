import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { HandlerHelper } from '../helper';
import { TextInputState } from '../../../model/text-input-state';

const rowSelectHandle = new RowSelectHandle();

export class ViewStateHandler extends StateHandle.BaseStateHandler {
    onEditView({ rules, localState }: AppState, { isHost, idx, parentCtxIdx }): Partial<AppState> {
        // Set the current active item
        const activeRule = {
            isHost,
            idx:  isHost ? idx : parentCtxIdx,
            pathIdx: isHost ? null : idx,
        };

        // Get the title and value of the item to be used in input placeholders
        const { title, value } = HandlerHelper.getActiveItem({
            rules,
            ...activeRule,
            isActiveItem: true,
        });
        const activeTitleInput = new TextInputState({ value: title });
        const activeValueInput = new TextInputState({ value });

        return {
            localState: {
                ...localState,

                // Edit Mode & active item, item states
                isListView: false,
                activeRule,
                activeTitleInput,
                activeValueInput,

                // clear the row select state ready for use for DataGrid component in Edit View
                selectState: rowSelectHandle.defState,
            }
        };
    }

    onListView({localState}: AppState): Partial<AppState> {
        // For maintain the only pagination setting
        const { pgnOption } = localState;
        const resetLocalState = new LocalState();

        return {
            localState: {
                ...resetLocalState,
                pgnOption,
            }
        };
    }
}