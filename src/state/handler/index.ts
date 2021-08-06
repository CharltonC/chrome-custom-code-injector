import { StateHandle } from '../../handle/state';
import { ModalStateHandler } from './modal';
import { OptionListViewHandler } from './option-list-view';
import { OptionEditViewHandler } from './option-edit-view';
import { IStateHandler } from './type';

export const AppStateHandler = StateHandle.BaseStateHandler.join<IStateHandler>([
    ModalStateHandler,
    OptionListViewHandler,
    OptionEditViewHandler,
]);