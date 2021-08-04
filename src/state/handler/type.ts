import { ModalStateHandler } from './modal';
import { OptionListViewHandler } from './option-list-view';
import * as TPgn from '../../handle/pagination/type';
import * as TSort from '../../handle/sort/type';

// Used for casting `this.reflect` property inside individual Handler
export interface IStateHandler extends ModalStateHandler, OptionListViewHandler {}

// Payload
export interface IOnPaginatePayload {
    pgnOption: TPgn.IOption;
    pgnState: TPgn.IState;
}

export interface IOnSortPayload {
    sortOption: TSort.IOption,
    sortState: TSort.IState;
}