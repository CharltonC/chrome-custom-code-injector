import { StateHandle } from '../handle/state';
import { AView } from '../model/local-state/type';
import { AppState } from '../model/app-state';
import { LocalState } from '../model/local-state';

export class StateHandler extends StateHandle.BaseStoreHandler {
    //// Modals
    openModal({ localState }: AppState, currModalId: string): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId
            }
        };
    }

    hideModal({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currModalId: null
            }
        };
    }

    //// Router/Views
    onListView(state: AppState): Partial<AppState> {
        const { currView } = this.reflect.setView(state, 'LIST').localState;
        const resetLocalState = new LocalState();
        return {
            localState: {
                ...resetLocalState,
                currView
            }
        };
    }

    onEditView(state: AppState) {
        return this.reflect.setView(state, 'EDIT');
    }

    setView({ localState }: AppState, currView: AView): Partial<AppState> {
        return {
            localState: {
                ...localState,
                currView
            }
        };
    }

    //// DataGrid rows
    onAllRowsToggle({ localState }: AppState): Partial<AppState> {
        return {
            localState: {
                ...localState,
                isAllRowsSelected: !localState.isAllRowsSelected
            }
        };
    }

    onHttpsToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isHttps');
    }

    onJsToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isJsOn');
    }

    onCssToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isCssOn');
    }

    onLibToggle(state: AppState, idx: number): Partial<AppState> {
        return this.reflect.toggleTbRowSwitch(state, idx, 'isLibOn');
    }

    onJsExecStageChange({ rules }: AppState, idx: number, modIdx): Partial<AppState> {
        const clone = rules.slice();
        clone[idx].jsExecPhase = modIdx;
        return { rules: clone };
    }

    onItemEdit(state: AppState, currListItem): Partial<AppState> {
        const { localState } = state;
        const { currView } = this.reflect.onEditView(state).localState;

        return {
            localState: {
                ...localState,
                currListItem,
                currView
            }
        };
    }

    toggleTbRowSwitch({ rules }: AppState, idx: number, key: string): Partial<AppState> {
        const clone = rules.slice();
        const value = clone[idx][key];
        clone[idx][key] = !value;
        return { rules: clone };
    }

    //// TODO
    onSearch(store) {
        console.log(store);
    }

    onListItemClick({ localState }: AppState, ...[, { item }]) {
        return {
            localState: {
                ...localState,
                currListItem: item,
            }
        };
    }
}