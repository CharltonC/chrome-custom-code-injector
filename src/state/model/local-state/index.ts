import { TextInputState } from '../text-input-state';
import { ActiveRuleState } from '../active-rule-state';
import { IListViewState, IEditViewState } from './type';
import { DataGridState } from '../data-grid-state';
import { ModalState } from '../modal-state';

export class LocalState {
    //// VIEW
    isListView = true;
    listView: IListViewState = {
        ruleIdCtx: new ActiveRuleState(),
        searchText: '',
        dataGrid: null, // Required to be initialized
    };
    editView: IEditViewState = {
        ruleIdCtx: new ActiveRuleState(),
        titleInput: new TextInputState(),
        valueInput: new TextInputState(),
        dataGrid: new DataGridState(),
    };

    //// MODAL
    modal = new ModalState();

    constructor(totalRecord: number) {
        // Set the Pagination state of Data Grid in List View when instantiated
        this.listView.dataGrid = new DataGridState({ totalRecord });
    }
}