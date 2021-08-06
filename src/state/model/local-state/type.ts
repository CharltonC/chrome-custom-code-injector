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
    //// current host/path
    // stores host id and path id
    ruleIdCtx: RuleIdCtxState;

    // title and value
    titleInput: TextInputState;
    valueInput: TextInputState;

    //// Libraries of current host path
    // similar to `ruleIdCtx` but specifically for library (used when removing library)
    libRuleIdCtx: RuleIdCtxState;

    dataGrid: DataGridState;
}
