import { StateHandle } from '../../state-handle';
import { GeneralStateHandler } from './partial_common';
import { ListViewStateHandler } from './partial_list-view';
import { EditViewStateHandler } from './partial_edit-view';
import { ModalToggleStateHandler } from './partial_common-modal-toggle';
import { ModalContentStateHandler } from './partial_common-modal-content';
import { TbRowStateHandler } from './partial_list-view-row';
import { IStateHandler } from './type';

export const StateHandler = StateHandle.BaseStoreHandler.join<IStateHandler>([
    GeneralStateHandler,
    ListViewStateHandler,
    EditViewStateHandler,
    ModalToggleStateHandler,
    ModalContentStateHandler,
    TbRowStateHandler,
]);