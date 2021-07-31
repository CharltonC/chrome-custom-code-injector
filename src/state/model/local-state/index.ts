import { TextInputState } from '../text-input-state';
import { DataGridState } from '../data-grid-state';
import { ActiveRuleState } from '../active-rule-state';
import { IListViewState, IEditViewState, IModalState } from './type';

export class LocalState {
    //// VIEW
    isListView = true;
    listView: IListViewState = {
        relativeRuleIdCtx: new ActiveRuleState(),
        searchText: '',
        dataGrid: new DataGridState(),
    };
    editView: IEditViewState = {
        activeRuleIdCtx: new ActiveRuleState(),
        titleInput: new TextInputState(),
        valueInput: new TextInputState(),
        dataGrid: new DataGridState(),
    };

    //// MODAL
    modal: IModalState = {
        currentId: null,
        activeRuleIdCtx: new ActiveRuleState(),
        exportFileInput: new TextInputState(),
        importFileInput: null,
        titleInput: new TextInputState(),
        valueInput: new TextInputState(),
        isConfirmBtnEnabled: false,
    }
}