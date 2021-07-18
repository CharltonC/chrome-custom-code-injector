import { StoreHandle } from '../store';
import { GeneralStateHandler } from './row';
import { ListViewStateHandler } from './list-view';
import { EditViewStateHandler } from './edit-view';
import { ModalToggleStateHandler } from './modal/toggle';
import { ModalContentStateHandler } from './modal/content';
import { TbRowStateHandler } from './list-view/row';
import { IStateHandler } from './type';

export const AppStateHandler = StoreHandle.BaseStoreHandler.join<IStateHandler>([
    GeneralStateHandler,
    ListViewStateHandler,
    EditViewStateHandler,
    ModalToggleStateHandler,
    ModalContentStateHandler,
    TbRowStateHandler,
]);