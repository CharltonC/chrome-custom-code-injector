import { ModalStateManager } from './modal';
import { OptionListViewStateManager } from './option-list-view';
import { OptionEditViewStateManager } from './option-edit-view';

// Used for casting `this.reflect` property inside individual Handler
export interface IStateHandler extends ModalStateManager, OptionListViewStateManager, OptionEditViewStateManager {
    new(...args: any[]): IStateHandler;
}
