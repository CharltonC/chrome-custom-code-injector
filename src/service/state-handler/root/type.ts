import { GeneralStateHandler } from './general.partial';
import { ModalToggleStateHandler } from './modal-toggle.partial';
import { ModalContentStateHandler } from './modal-content.partial';
import { TbRowStateHandler } from './tb-row.partial';

export interface IStateHandler extends GeneralStateHandler, ModalToggleStateHandler, ModalContentStateHandler, TbRowStateHandler {}