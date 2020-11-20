import { resultsPerPage } from '../../constant/result-per-page';
import { HostRuleConfig, PathRuleConfig } from '../rule-config';
import { Setting } from '../setting';
import * as TSort from '../../service/sort-handle/type';
import * as TPgn from '../../service/pagination-handle/type';
import * as TRowSelect from '../../service/row-select-handle/type';

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

    // * Host/Path add/edit item (table row)
    targetItem: HostRuleConfig = null;
    isTargetItemIdValid: boolean = false;
    isTargetItemValValid: boolean = false;

    // * Delete row
    targetCtxIdx: number = null;
    targetParentCtxIdx: number = null;
}