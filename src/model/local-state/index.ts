import { HostRuleConfig } from '../rule-config';
import { TextInputState } from '../text-input-state';
import { ActiveRuleState } from '../active-rule-state';
import { DataGridState } from '../data-grid-state';
import { DelRuleState } from '../del-rule-state';

export class LocalState {
    //// VIEW
    isListView = true;

    //// SEARCH
    searchedText = '';
    searchedRules: HostRuleConfig[] = null;

    //// CURRENT RULE
    activeRule = new ActiveRuleState();         // stores indexes of where to find item
    activeTitleInput = new TextInputState();    // text input for title in edit mode
    activeValueInput = new TextInputState();    // text input for host/path in edit mode

    //// RULE TO DELETE
    delRule = new DelRuleState();

    //// MODAL
    activeModalId: string = null;
    isModalConfirmBtnEnabled = false;
    modalExportFileInput = new TextInputState();
    modalImportFileInput: File = null;
    modalTitleInput = new TextInputState();
    modalValueInput = new TextInputState();
    modalRuleIdx: number = null; // for targeting the host where new path will be added to

    //// DATA GRID ROWS
    ruleDataGrid = new DataGridState();
    libDataGrid = new DataGridState();

    // // Rows used by Modal Delete Confirm `onDelModalConfirm`
    // // - temp storage which points to the current full set of sorted data if exist or plain data (either searched or non-search)
    // // - unpaginated
    // dataSrc: HostRuleConfig[] = null;

    // // Sort
    // sortOption: Partial<TSort.IOption> = { reset: true };

    // // Select
    // selectState: TRowSelect.IState = {
    //     areAllRowsSelected: false,
    //     selectedRowKeys: {}
    // };

    // // Expand (only for allow 1 row to be expanded at the same time)
    // expdRowId: string = null;

    // // Pagination
    // pgnOption = {
    //     increment: resultsPerPage,
    //     incrementIdx: resultsPerPageIdx
    // } as TPgn.IOption;

    // pgnState = {
    //     curr: 0,
    //     startIdx: 0,
    //     endIdx: null
    // } as TPgn.IState;
}