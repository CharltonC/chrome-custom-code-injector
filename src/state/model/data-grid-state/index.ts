import { resultsPerPage } from '../../../constant/result-per-page';
import { SettingState } from '../setting-state';
import * as TSort from '../../../handle/sort/type';
import * as TPgn from '../../../handle/pagination/type';
import * as TRowSelect from '../../../handle/row-select/type';

const { resultsPerPageIdx } = new SettingState();

export class DataGridState {
    // Sort
    sortOption: Partial<TSort.IOption> = { reset: true };
    sortedData: AObj[] = null;

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

    // By def leave it as empty
    // - the state will be auto generated inside the component (however no access)
    // - will be auto set here whenever a paginated state is changed
    pgnState: TPgn.IState = null;
}