import { AView, AObj } from './type';
import { HostRuleConfig } from '../rule-config';

export class LocalState {
    // Common
    currView: AView = 'LIST';
    searchedText: string = '';
    searchedRules: HostRuleConfig[] = null;

    // List View
    isAllRowsSelected: boolean = false;

    // Edit View (TODO: rename it to editListItem)
    currListItem: AObj = null;

    // Modal
    currModalId: string = null;
    allowModalConfirm: boolean = false;

    targetEditItem: HostRuleConfig = null;
    isTargetEditItemIdValid: boolean = false;
    isTargetEditItemValValid: boolean = false;

    targetRmvItemIdx: number = null;
    targetRmvItemParentIdx: number = null;
}