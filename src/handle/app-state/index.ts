import { StateHandle } from '../state';
import { EditViewStateHandler } from './edit-view';
import { ModalStateHandler } from './modal';
import { ListViewStateHandler } from './list-view';
import { IStateHandler } from './type';

export const AppStateHandler = StateHandle.BaseStateHandler.join<IStateHandler>([
    ListViewStateHandler,
    EditViewStateHandler,
    ModalStateHandler,
]);