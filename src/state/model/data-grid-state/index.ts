import { resultsPerPage } from '../../../constant/result-per-page';
import { SettingState } from '../setting-state';
import { HostRuleConfig } from '../../../data/model/rule-config';
import { PgnHandle } from '../../../handle/pagination';
import * as TSort from '../../../handle/sort/type';
import * as TPgn from '../../../handle/pagination/type';
import * as TRowSelect from '../../../handle/row-select/type';

const { resultsPerPageIdx } = new SettingState();
const pgnHandle = new PgnHandle();
const defPgnOption = {
    increment: resultsPerPage,
    incrementIdx: resultsPerPageIdx
};

export class DataGridState {
    // Sort
    sortOption: Partial<TSort.IOption> = { reset: true };

    // Current Data used in Data Grid component
    // - could be sorted data hence diff. to original data source `rules`
    // - used in case external state handler can't access the data grid data
    srcRules: HostRuleConfig[] = null;

    // Select
    selectState: TRowSelect.IState = {
        areAllRowsSelected: false,
        selectedRowKeyCtx: {}
    };

    // Expand (only for allow 1 row to be expanded at the same time)
    expdRowId: string = null;

    // Pagination (optional)
    // - By def leave them as unless pagination is required
    // - `pgnState` is required to be set when instantiated
    // - `pgnState` should be auto set in this App here whenever a paginated state is changed
    pgnOption?: TPgn.IOption;
    pgnState?: TPgn.IState;

    constructor(arg?: { totalRecord: number, pgnOption?: Partial<TPgn.IOption> }) {
        if (!arg) return;

        const { totalRecord, pgnOption } = arg;
        if (totalRecord < 0) return;
        const option = (
            pgnOption
                ? { ...defPgnOption, ...pgnOption }
                : defPgnOption
        ) as TPgn.IOption;
        this.pgnOption = option;
        this.pgnState = pgnHandle.getState(totalRecord, option);
    }
}