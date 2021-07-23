import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { DataSrcStateHandler } from './data-src';
import { RuleDatagridStateHandler } from './rule-datagrid';
import { EditViewStateHandler } from './option-edit-view';
import { ViewStateHandler } from './view';

export interface IStateHandler extends RuleDatagridStateHandler, EditViewStateHandler, ModalStateHandler, SettingStateHandler, DataSrcStateHandler, ViewStateHandler {}