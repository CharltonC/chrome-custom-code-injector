import { EditViewStateHandler } from './edit-view';
import { ModalStateHandler } from './modal';
import { ListViewStateHandler } from './list-view';

export interface IStateHandler extends ListViewStateHandler, EditViewStateHandler, ModalStateHandler {}