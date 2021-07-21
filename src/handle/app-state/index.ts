import { StateHandle } from '../state';
import { EditViewStateHandler } from './option-edit-view';
import { ModalStateHandler } from './modal';
import { ListViewStateHandler } from './option-list-view';
import { IStateHandler } from './type';

export const AppStateHandler = StateHandle.BaseStateHandler.join<IStateHandler>([
    ListViewStateHandler,
    EditViewStateHandler,
    ModalStateHandler,
]);