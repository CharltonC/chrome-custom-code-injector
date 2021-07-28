import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { TextInputState } from '../../../model/text-input-state';
import { DataGridState } from '../../../model/data-grid-state';
import { ActiveRuleState } from '../../../model/active-rule-state';

const { defState: rowSelectDefState } = new RowSelectHandle();

export class ViewStateHandler extends StateHandle.BaseStateHandler {
    onEditView({ rules, localState }: AppState, payload): Partial<AppState> {
        const { isHost, item, parentItem, pathIdx } = payload;

        // Find the index in rules
        const ruleIdx = rules.indexOf(isHost ? item : parentItem);
        const activeRule = new ActiveRuleState({
            isHost,
            item,
            ruleIdx,
            pathIdx
        });

        // Get the title and value of the item to be used in input placeholders
        const { title, value } = item;
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

                // clear the row select state ready for use for DataGrid component in Edit View]
                ruleDataGrid: {
                    ...localState.ruleDataGrid,
                    selectState: rowSelectDefState,
                }
            }
        };
    }

    onListView({localState}: AppState): Partial<AppState> {
        // For maintain the only pagination setting
        const { ruleDataGrid } = localState;
        const resetLocalState = new LocalState();
        const resetDataGridState = new DataGridState();

        return {
            localState: {
                ...resetLocalState,
                ruleDataGrid: {
                    ...resetDataGridState,
                    pgnOption: ruleDataGrid.pgnOption,
                }
            }
        };
    }
}