import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { OptionListViewHandler } from './option-list-view';
import { OptionEditViewHandler } from './option-edit-view';

// Used for casting `this.reflect` property inside individual Handler
export interface IStateHandler extends ModalStateHandler, SettingStateHandler, OptionListViewHandler, OptionEditViewHandler {}