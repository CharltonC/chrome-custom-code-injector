import { StateHandle } from '../state';
import { ModalStateHandle } from './modal';
import { OptionListViewStateHandle } from './option-list-view';
import { OptionEditViewStateHandle } from './option-edit-view';
import { PopupViewStateHandle } from './popup-view';
import { IStateHandle } from './type';

export const AppStateHandle = StateHandle.BaseStateManager.join<IStateHandle>([
    ModalStateHandle,
    OptionListViewStateHandle,
    OptionEditViewStateHandle,
    PopupViewStateHandle,
]);