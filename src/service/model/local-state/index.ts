import { AView } from './type';
import { HostRuleConfig } from '../rule-config';
import { Setting } from '../../model/setting';

const { resultsPerPageIdx } = new Setting();

export class LocalState {
    //// Common
    // - Search
    searchedText: string = '';
    searchedRules: HostRuleConfig[] = null;

    // Data Grid Rows
    // temp storage which points to the current full set of sorted data if exist or plain data (either searched or non-search)
    // - used by Modal Delete Confirm `onDelModalConfirm`
    sortedData: HostRuleConfig[] = null;

    selectedRowKeys: Record<string, boolean> = {};
    pgnPageIdx: number = 0;
    pgnIncrmIdx: number = resultsPerPageIdx;
    pgnItemStartIdx: number = 0;
    pgnItemEndIdx: number = null;

    // - Import/Export
    importFile: File = null;
    exportFileName: string = null;

    //// Views
    currView: AView = 'LIST';

    // - List View
    areAllRowsSelected: boolean = false;
    expdRowId: string = null;

    //// Modal
    currModalId: string = null;
    allowModalConfirm: boolean = false;

    //// Host/Path add/edit item (table row)
    targetItem: HostRuleConfig = null;
    targetItemIdx: number = null;
    targetChildItemIdx: number = null;
    isTargetItemIdValid: boolean = false;
    isTargetItemValValid: boolean = false;
}