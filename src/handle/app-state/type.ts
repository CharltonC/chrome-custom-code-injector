import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { DataStateHandler } from './data';
import { ListViewStateHandler } from './option-list-view';
import { EditViewStateHandler } from './option-edit-view';

export interface IStateHandler extends ListViewStateHandler, EditViewStateHandler, ModalStateHandler, SettingStateHandler, DataStateHandler {}