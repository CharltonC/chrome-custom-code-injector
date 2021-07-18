import { resultsPerPage } from '../../../constant/result-per-page';
import { HostRuleConfig } from '../rule-config';
import { RuleValidState } from '../rule-valid-state';
import { Setting } from '../setting';
import * as TSort from '../../../handle/sort/type';
import * as TPgn from '../../../handle/pagination/type';
import * as TRowSelect from '../../../handle/row-select/type';
import { modalDelTarget } from '../del-target';

const { resultsPerPageIdx } = new Setting();

export class LocalState {
    //// HEADER
    // * Search
    searchedText = '';
    searchedRules: HostRuleConfig[] = null;

    // * Import/Export
    importFile: File = null;
    exportFileName: string = null;

    // * Views
    // TODO: type
    /**
     * {
        itemIdx: null,
        childItemIdx: null,
    };
     */
    editViewTarget = null;

    //// DATA GRID ROWS
    // * rows used by Modal Delete Confirm `onDelModalConfirm`
    // - temp storage which points to the current full set of sorted data if exist or plain data (either searched or non-search)
    // - unpaginated
    dataSrc: HostRuleConfig[] = null;

    // * sort
    sortOption: Partial<TSort.IOption> = { reset: true };

    // * select
    selectState: TRowSelect.IState = {
        areAllRowsSelected: false,
        selectedRowKeys: {}
    };

    // * expand (only for allow 1 row to be expanded at the same time)
    expdRowId: string = null;

    // * pagination
    pgnOption = {
        increment: resultsPerPage,
        incrementIdx: resultsPerPageIdx
    } as TPgn.IOption;

    pgnState = {
        curr: 0,
        startIdx: 0,
        endIdx: null
    } as TPgn.IState;

    //// MODAL
    // * ID & Confirm disabled
    currModalId: string = null;
    allowModalConfirm = false;

    // * Validation for Add/Edit
    modalEditTargetValidState = new RuleValidState();

    // * Add New Row/Sub-row or Edit Row/Sub-row (w/ Validation)
    modalEditTarget: HostRuleConfig = null;
    modalAddSubTargetIdx: number = null;     // index of rule for adding Sub-row only

    // * Delete Row/Sub-row
    modalDelTarget = new modalDelTarget();
}