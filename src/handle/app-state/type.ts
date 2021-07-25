import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { DataSrcStateHandler } from './data-src';
import { RuleDatagridStateHandler } from './rule-datagrid';
import { LibDatagridStateHandler } from './lib-datagrid';
import { SidebarStateHandler } from './sidebar';
import { ViewStateHandler } from './view';

export interface IStateHandler extends RuleDatagridStateHandler, SidebarStateHandler, ModalStateHandler, SettingStateHandler, DataSrcStateHandler, ViewStateHandler, LibDatagridStateHandler {}