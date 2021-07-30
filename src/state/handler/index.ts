import { StateHandle } from '../../handle/state';
import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { OptionListViewHandler } from './option-list-view';
import { OptionEditViewHandler } from './option-edit-view';
import { IStateHandler } from './type';

export const AppStateHandler = StateHandle.BaseStateHandler.join<IStateHandler>([
    ModalStateHandler,
    SettingStateHandler,
    OptionListViewHandler,
    OptionEditViewHandler,
]);