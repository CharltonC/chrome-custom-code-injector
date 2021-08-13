import { HostRuleConfig } from '../../../data/model/rule-config';
import * as TPgn from '../../../handle/pagination/type';
import * as TSort from '../../../handle/sort/type';

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
