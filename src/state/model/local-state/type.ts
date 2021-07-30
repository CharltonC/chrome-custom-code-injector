import { DataGridState } from '../data-grid-state';
import { TextInputState } from '../text-input-state';
import { ActiveRuleState } from '../active-rule-state';

export interface IListViewState {
    searchText: string;
    dataGrid: DataGridState;
};

export interface IEditViewState {
    activeRuleIdCtx: ActiveRuleState;
    titleInput: TextInputState;
    valueInput: TextInputState;
    dataGrid: DataGridState;
}

export interface IModalState {
    currentId: string;
    activeRuleIdCtx: ActiveRuleState;
    exportFileInput: TextInputState;
    importFileInput: File;
    titleInput: TextInputState;
    valueInput: TextInputState;
    isConfirmBtnEnabled: false;
}