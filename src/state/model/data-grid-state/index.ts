import { resultsPerPage } from '../../../constant/result-per-page';
import { SettingState } from '../setting-state';
import * as TSort from '../../../handle/sort/type';
import * as TPgn from '../../../handle/pagination/type';
import * as TRowSelect from '../../../handle/row-select/type';

const { resultsPerPageIdx } = new SettingState();

export class DataGridState {
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