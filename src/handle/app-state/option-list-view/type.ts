import { HostRule } from '../../../model/rule';
import * as TPgn from '../../pagination/type';
import * as TSort from '../../sort/type';

export interface IOnPaginatePayload {
    pgnOption: TPgn.IOption;
    pgnState: TPgn.IState;
}

export interface IOnSortPayload {
    sortOption: TSort.IOption,
    sortState: TSort.IState;
}

export interface IOnRowSelectTogglePayload {
    dataSrc: HostRule[];
    hostId: string
}

export interface IOnJsExecStepChangePayload {
    hostId: string;
    pathId: string;
    selectValueAttrVal: number;
}
