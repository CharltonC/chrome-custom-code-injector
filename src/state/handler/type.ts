import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { OptionListViewHandler } from './option-list-view';
import { OptionEditViewHandler } from './option-edit-view';

export interface IStateHandler extends ModalStateHandler, SettingStateHandler, OptionListViewHandler, OptionEditViewHandler {}