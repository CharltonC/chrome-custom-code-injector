import { AView, AObj } from './type';
import { resultsPerPage } from '../../constant/result-per-page';
import { HostRuleConfig } from '../rule-config';
import { Setting } from '../../model/setting';

const { resultsPerPageIdx } = new Setting();
const totalPerPage: number = resultsPerPage[resultsPerPageIdx];

export class LocalState {
    //// Common
    // - Search
    searchedText: string = '';
    searchedRules: HostRuleConfig[] = null;

    // - Data Grid Rows
    selectedRowKeys: Record<string, boolean> = {};
    pgnPageIdx: number = 0;
    pgnIncrmIdx: number = resultsPerPageIdx;
    pgnItemStartIdx: number = 0;
    pgnItemEndIdx: number = totalPerPage;

    //// Views
    // Current
    currView: AView = 'LIST';

    // - List View
    isAllRowsSelected: boolean = false;
    expdRowId: string = null;

    // - Edit View (TODO: rename it to editListItem)
    currListItem: AObj = null;

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