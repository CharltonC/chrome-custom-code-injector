import { EditViewStateHandler } from './option-edit-view';
import { ModalStateHandler } from './modal';
import { ListViewStateHandler } from './option-list-view';

export interface IStateHandler extends ListViewStateHandler, EditViewStateHandler, ModalStateHandler {}