import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';
import { HandlerHelper } from '../helper';
import { TextInputState } from '../../../model/text-input-state';
import { DataGridState } from '../../../model/data-grid-state';
import { HostRuleConfig } from '../../../model/rule-config';

const { defState: rowSelectDefState } = new RowSelectHandle();

export class ViewStateHandler extends StateHandle.BaseStateHandler {
    onEditView({ rules, localState }: AppState, { isHost, idx, parentCtxIdx }): Partial<AppState> {
        let activeRule = {
            isHost,
            idx:  isHost ? idx : parentCtxIdx,
            pathIdx: isHost ? null : idx,
        };

        // TODO: Check sort status (i.e. if data table is using `dataSrc`)

        // TODO: this is also `dataSrc`?
        // TODO: refactor as method?
        // If search, we need to find the host item to be edited (relative to search rules),
        // then find the corresp. index in `rules`
        const { searchedRules } = localState;
        if (searchedRules?.length) {
            const item = HandlerHelper.getActiveItem({
                rules: searchedRules,
                isActiveItem: true,
                isHost: true,
                idx: isHost ? idx : parentCtxIdx,
            }) as HostRuleConfig;

            activeRule = {
                ...activeRule,
                idx: rules.indexOf(item),
            }
        }

        // Get the title and value of the item to be used in input placeholders
        const { title, value } = HandlerHelper.getActiveItem({
            ...activeRule,
            isActiveItem: true,
            rules,
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