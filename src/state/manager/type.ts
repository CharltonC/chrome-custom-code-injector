import { ModalStateManager } from './modal';
import { OptionListViewStateManager } from './option-list-view';
import { OptionEditViewStateManager } from './option-edit-view';
import { HostRuleConfig } from '../../data/model/rule-config';
import * as TPgn from '../../handle/pagination/type';
import * as TSort from '../../handle/sort/type';

// Used for casting `this.reflect` property inside individual Handler
export interface IStateHandler extends ModalStateManager, OptionListViewStateManager, OptionEditViewStateManager {}

// Payload
export interface IOnPaginatePayload {
    pgnOption: TPgn.IOption;
    pgnState: TPgn.IState;
}

export interface IOnSortPayload {
    sortOption: TSort.IOption,
    sortState: TSort.IState;
}

export interface IOnRowSelectTogglePayload {
    dataSrc: HostRuleConfig[];
    hostId: string
}

export interface IOnJsExecStepChangePayload {
    hostId: string;
    pathId: string;
    selectValueAttrVal: number;
}

export interface IOnDelHostsModalPayload {
    srcRules: HostRuleConfig[];
    sliceIdxCtx: {
        startIdx: number;
        endIdx: number;
    };
}
