import { DataGridState } from '../data-grid-state';
import { TextInputState } from '../text-input-state';
import { RuleIdCtxState } from '../rule-id-ctx-state';

export interface IListViewState {
    // stores host id and path id for querying the specific host/path for add, edit, delete
    ruleIdCtx: RuleIdCtxState;
    searchText: string;
    dataGrid: DataGridState;
};

export interface IEditViewState {
    // stores host id and path id for the current host/path in Edit View
    ruleIdCtx: RuleIdCtxState;
    titleInput: TextInputState;
    valueInput: TextInputState;
    dataGrid: DataGridState;
}
