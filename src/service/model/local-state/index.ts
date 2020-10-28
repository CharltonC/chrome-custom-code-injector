import { AView, AObj } from './type';
import { HostRuleConfig } from '../rule-config';

export class LocalState {
    // Common
    currView: AView = 'LIST';
    searchedText: string = '';
    searchedRules: HostRuleConfig[] = null;

    // List View
    isAllRowsSelected: boolean = false;
    expdRowId: string = null;

    // Edit View (TODO: rename it to editListItem)
    currListItem: AObj = null;

    // Modal
    currModalId: string = null;
    allowModalConfirm: boolean = false;

    // Host/Path add/edit item (table row)
    targetItem: HostRuleConfig = null;
    targetItemIdx: number = null;
    targetChildItemIdx: number = null;
    isTargetItemIdValid: boolean = false;
    isTargetItemValValid: boolean = false;
}