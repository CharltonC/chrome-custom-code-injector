import { StateHandle } from '../handle/state';
import { AView } from '../model/local-state/type';

export class StateHandler extends StateHandle.BaseStoreHandler {
    openModal({ localState }, currModalId: string) {
        return {
            localState: {
                ...localState,
                currModalId
            }
        };
    }

    hideModal({ localState }) {
        return {
            localState: {
                ...localState,
                currModalId: null
            }
        };
    }

    setView({ localState }, currView: AView) {
        return {
            localState: {
                ...localState,
                currView
            }
        };
    }

    onSearch(store) {
        console.log(store);
    }
}