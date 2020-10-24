import { AView } from './type';

export class LocalState {
    // Common
    currView: AView = 'LIST';
    currSearchText: string = '';

    // List View
    isAllRowsSelected: boolean = false;

    // Edit View
    currListItemIdx: number = 0;
    currNestedListItemIdx: number = 0;

    // TODO: current host/path input for add/edit
    // currHost;
    // currPath;
    // currLib;

    // Modal
    currModalId: string = null;
    isModalConfirmDisabled: boolean = false;
}

export const localState = new LocalState();
