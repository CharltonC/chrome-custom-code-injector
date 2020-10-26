import { AView, AObj } from './type';

export class LocalState {
    // Common
    currView: AView = 'LIST';
    currSearchText: string = '';

    // List View
    isAllRowsSelected: boolean = false;

    // Edit View
    currListItem: AObj = null;

    // Modal
    currModalId: string = null;
    isModalConfirmDisabled: boolean = false;
}