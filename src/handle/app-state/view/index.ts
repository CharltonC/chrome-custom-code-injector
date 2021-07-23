import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { HandlerHelper } from '../helper';

const rowSelectHandle = new RowSelectHandle();

export class ViewStateHandler extends StateHandle.BaseStateHandler {
    onEditView({ rules, localState }: AppState, { isHost, idx, parentCtxIdx }): Partial<AppState> {
        const activeRule = {
            isHost,
            idx:  isHost ? idx : parentCtxIdx,
            pathIdx: isHost ? null : idx,
        };
        const { title, value } = HandlerHelper.getActiveItem({
            rules,
            ...activeRule,
            isActiveItem: true,
        });

        return {
            localState: {
                ...localState,
                isListView: false,
                activeRule,

                // clear the row select state ready for use for DataGrid component in Edit View
                selectState: rowSelectHandle.defState,

                // Input value, validation state
                titleInput: {
                    isValid: null,
                    errMsg: [],
                    value: title,
                },
                hostOrPathInput: {
                    isValid: null,
                    errMsg: [],
                    value
                }
            }
        };
    }

    onListView({localState}: AppState): Partial<AppState> {
        const { pgnOption } = localState;   // maintain the only pagination setting
        const resetLocalState = new LocalState();

        return {
            localState: {
                ...resetLocalState,
                pgnOption,
            }
        };
    }
}
