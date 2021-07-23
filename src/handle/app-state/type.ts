import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { DataSrcStateHandler } from './data-src';
import { ListViewStateHandler } from './option-list-view';
import { EditViewStateHandler } from './option-edit-view';
import { ViewStateHandler } from './view';

export interface IStateHandler extends ListViewStateHandler, EditViewStateHandler, ModalStateHandler, SettingStateHandler, DataSrcStateHandler, ViewStateHandler {}