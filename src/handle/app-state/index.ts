import { StateHandle } from '../state';
import { ModalStateHandler } from './modal';
import { SettingStateHandler } from './setting';
import { DataSrcStateHandler } from './data-src';
import { SidebarStateHandler } from './sidebar';
import { RuleDatagridStateHandler } from './rule-datagrid';
import { IStateHandler } from './type';
import { ViewStateHandler } from './view';

export const AppStateHandler = StateHandle.BaseStateHandler.join<IStateHandler>([
    RuleDatagridStateHandler,
    SidebarStateHandler,
    ModalStateHandler,
    SettingStateHandler,
    DataSrcStateHandler,
    ViewStateHandler,
]);