import { TextInputState } from '../text-input-state';
import { RuleIdCtxState } from '../rule-id-ctx-state';
import { IListViewState, IEditViewState } from './type';
import { DataGridState } from '../data-grid-state';
import { ModalState } from '../modal-state';

export class LocalState {
    //// VIEW
    isListView = true;
    listView: IListViewState = {
        ruleIdCtx: new RuleIdCtxState(),
        searchText: '',
        dataGrid: null, // Required to be initialized
    };
    editView: IEditViewState = {
        ruleIdCtx: new RuleIdCtxState(),
        libRuleIdCtx: new RuleIdCtxState(),
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