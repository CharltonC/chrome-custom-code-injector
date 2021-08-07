import { StateHandle } from '../../handle/state';
import { ModalStateManager } from './modal';
import { OptionListViewStateManager } from './option-list-view';
import { OptionEditViewStateManager } from './option-edit-view';
import { IStateHandler } from './type';

export const AppStateManager = StateHandle.BaseStateManager.join<IStateHandler>([
    ModalStateManager,
    OptionListViewStateManager,
    OptionEditViewStateManager,
]);