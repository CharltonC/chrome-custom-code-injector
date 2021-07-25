import { resultsPerPage } from '../../constant/result-per-page';
import { HostRuleConfig } from '../rule-config';
import { SettingState } from '../setting-state';
import * as TSort from '../../handle/sort/type';
import * as TPgn from '../../handle/pagination/type';
import * as TRowSelect from '../../handle/row-select/type';

const { resultsPerPageIdx } = new SettingState();

export class DataGridState {
    // Rows used by Modal Delete Confirm `onDelModalConfirm`
    // - temp storage which points to the current full set of sorted data if exist or plain data (either searched or non-search)
    // - unpaginated
    dataSrc: HostRuleConfig[] = null;

    // Sort
    sortOption: Partial<TSort.IOption> = { reset: true };

    // Select
    selectState: TRowSelect.IState = {
        areAllRowsSelected: false,
        selectedRowKeys: {}
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