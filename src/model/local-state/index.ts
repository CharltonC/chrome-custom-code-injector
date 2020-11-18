import { HostRuleConfig } from '../rule-config';
import { Setting } from '../setting';
import { AView } from './type';
import * as TSort from '../../service/sort-handle/type';

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
    currView: AView = 'LIST';

    //// DATA GRID ROWS
    // * rows used by Modal Delete Confirm `onDelModalConfirm`
    // - temp storage which points to the current full set of sorted data if exist or plain data (either searched or non-search)
    dataSrc: HostRuleConfig[] = null;

    // * sort
    sortOption: Partial<TSort.IOption> = { reset: true };

    // * select
    areAllRowsSelected: boolean = false;
    selectedRowKeys: Record<string, boolean> = {};

    // * expand (only for allow 1 row to be expanded at the same time)
    expdRowId: string = null;

    // * pagination (TODO: make this an pagination state object)
    pgnPageIdx: number = 0;
    pgnIncrmIdx: number = resultsPerPageIdx;
    pgnItemStartIdx: number = 0;
    pgnItemEndIdx: number = null;

    //// MODAL
    // * ID & Confirm disabled
    currModalId: string = null;
    allowModalConfirm: boolean = false;

    // * Host/Path add/edit item (table row)
    targetItem: HostRuleConfig = null;
    targetItemIdx: number = null;
    targetChildItemIdx: number = null;
    isTargetItemIdValid: boolean = false;
    isTargetItemValValid: boolean = false;
}