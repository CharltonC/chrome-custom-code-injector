import { resultsPerPage } from '../../../constant/result-per-page';
import { HostRuleConfig } from '../../../data/model/rule-config';
import { SettingState } from '../setting-state';
import * as TSort from '../../../handle/sort/type';
import * as TPgn from '../../../handle/pagination/type';
import * as TRowSelect from '../../../handle/row-select/type';

const { resultsPerPageIdx } = new SettingState();

export class DataGridState<T = HostRuleConfig> {
    // Rows used by Modal Delete Confirm `onDelModalConfirm`
    // - temp storage which points to the current FULL SET of sorted data if exist or plain data (either searched or non-search)
    // - UNPAGINATED
    dataSrc: T[]= null;

    // Sort
    sortOption: Partial<TSort.IOption> = { reset: true };

    // Select
    selectState: TRowSelect.IState = {
        areAllRowsSelected: false,
        selectedRowKeyCtx: {}
    };

    // Expand (only for allow 1 row to be expanded at the same time)
    expdRowId: string = null;

    // Pagination
    pgnOption = {
        increment: resultsPerPage,
        incrementIdx: resultsPerPageIdx
    } as TPgn.IOption;

    pgnState = {
        curr: 0,
        startIdx: 0,
        endIdx: null
    } as TPgn.IState;
}