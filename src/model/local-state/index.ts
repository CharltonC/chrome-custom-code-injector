import { resultsPerPage } from '../../constant/result-per-page';
import { HostRuleConfig, PathRuleConfig } from '../rule-config';
import { RuleValidState } from '../rule-valid-state';
import { Setting } from '../setting';
import * as TSort from '../../service/sort-handle/type';
import * as TPgn from '../../service/pagination-handle/type';
import * as TRowSelect from '../../service/row-select-handle/type';
import { DelTarget } from '../del-target';

const { resultsPerPageIdx } = new Setting();

export class LocalState {
    //// HEADER
    // * Search
    searchedText: string = '';
    searchedRules: HostRuleConfig[] = null;

    // * Import/Export
    importFile: File = null;
    exportFileName: string = null;

    // * Views
    editViewTarget: HostRuleConfig | PathRuleConfig = null;

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
    allowModalConfirm: boolean = false;

    // * Validation for Add/Edit
    targetValidState: RuleValidState = new RuleValidState();

    // * Add New Row/Sub-row or Edit Row/Sub-row (w/ Validation)
    editTarget: HostRuleConfig = null;
    addSubTargetIdx: number = null;     // index of rule for adding Sub-row only

    // * Delete Row/Sub-row
    delTarget: DelTarget = new DelTarget();
}