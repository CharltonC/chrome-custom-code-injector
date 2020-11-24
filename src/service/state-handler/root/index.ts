import { StateHandle } from '../../state-handle';
import { GeneralStateHandler } from './general.partial';
import { ModalToggleStateHandler } from './modal-toggle.partial';
import { ModalContentStateHandler } from './modal-content.partial';
import { TbRowStateHandler } from './tb-row.partial';
import { IStateHandler } from './type';

export const StateHandler = StateHandle.BaseStoreHandler.join<IStateHandler>([
    GeneralStateHandler,
    ModalToggleStateHandler,
    ModalContentStateHandler,
    TbRowStateHandler
]);