import { DataGridState } from '../data-grid-state';
import { TextInputState } from '../text-input-state';
import { ActiveRuleState } from '../active-rule-state';

export interface IListViewState {
    // stores host id and path id for querying the specific host/path for add, edit, delete
    ruleIdCtx: ActiveRuleState;
    searchText: string;
    dataGrid: DataGridState;
};

export interface IEditViewState {
    // stores host id and path id for the current host/path in Edit View
    ruleIdCtx: ActiveRuleState;
    titleInput: TextInputState;
    valueInput: TextInputState;
    dataGrid: DataGridState;
}

export interface IModalState {
    currentId: string;
    ruleIdCtx: ActiveRuleState;
    exportFileInput: TextInputState;
    importFileInput: File;
    titleInput: TextInputState;
    valueInput: TextInputState;
    isConfirmBtnEnabled: boolean;
}