import { StateHandle } from '../../handle/state';
import { ModalStateHandler } from './modal';
import { OptionListViewHandler } from './option-list-view';
import { IStateHandler } from './type';

export const AppStateHandler = StateHandle.BaseStateHandler.join<IStateHandler>([
    ModalStateHandler,
    OptionListViewHandler,
    // OptionEditViewHandler,
]);