import { ModalStateHandler } from './modal';
import { OptionListViewHandler } from './option-list-view';

// Used for casting `this.reflect` property inside individual Handler
export interface IStateHandler extends ModalStateHandler, OptionListViewHandler {}