import { ModalStateHandle } from "./modal";
import { OptionListViewStateHandle } from "./option-list-view";
import { OptionEditViewStateHandle } from "./option-edit-view";
import { PopupViewStateHandle } from "./popup-view";

// Used for casting `this.reflect` property inside individual Handler
export interface IStateHandle
    extends ModalStateHandle,
        OptionListViewStateHandle,
        OptionEditViewStateHandle,
        PopupViewStateHandle {
    new (...args: any[]): IStateHandle;
    reflect: any;
}
