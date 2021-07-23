import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { HandlerHelper } from '../helper';

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
        const modalTitleInput = {
            isValid: null,
            errMsg: [],
            value: title,
        };
        const modalValueInput = {
            isValid: null,
            errMsg: [],
            value
        };

        return {
            localState: {
                ...localState,

                // Edit Mode & active item
                isListView: false,
                activeRule,

                // clear the row select state ready for use for DataGrid component in Edit View
                selectState: rowSelectHandle.defState,

                // Input value, validation state
                modalTitleInput,
                modalValueInput,
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