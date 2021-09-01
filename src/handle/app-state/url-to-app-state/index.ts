import { DataHandle } from '../../data';
import { OptionListViewStateHandle } from '../option-list-view';
import { ModalStateHandle } from '../modal';
import { AppState } from '../../../model/app-state';
import { TextInputState } from '../../../model/text-input-state';
import { EQueryParam, EPrefillAction } from '../../query-param/type';

const { EDIT, ADD_HOST, ADD_PATH } = EPrefillAction;
const { ACTION, HOST_ID, HOST_URL, PATH_ID, PATH } = EQueryParam;

/**
 * Get a prefilled partial app state (based on the url query params) to be merged with existing state when initializing the React App
 * - this is a shortcut to get a state to be used in App initialisation rather than getting the state at callback
 * - this is not used directly in React App (event binding) but used outside of React App context prior to App is mounted
 *
 * How this works:
 * 1. Popup page
 *      --> State Handle
 *          --> queryParamHandle, chromeHandle
 * 2. Open Option page in a new Tab
 *      --> option page init script
 *          --> UrlToAppStateHandle
 */
export class UrlToAppStateHandle {
    dataHandle = new DataHandle();
    optionListViewStateHandle = new OptionListViewStateHandle();
    modalStateHandle = new ModalStateHandle();

    //// MAIN
    getState(appState: AppState, url: string): Partial<AppState> {
        let params: URLSearchParams;
        try {
            params = new URL(url).searchParams;
        } catch {
            return {};
        }

        const action = params.get(ACTION);
        if (!action) return {};

        switch(action) {
            case EDIT:
                return this.onOptionEdit(appState, params);
            case ADD_HOST:
                return this.onOptionListAddHost(appState, params);
            case ADD_PATH:
                return this.onOptionListAddPath(appState, params);
            default:
                return {};
        }
    }

    //// HELPER
    onOptionEdit(appState: AppState, params: URLSearchParams): Partial<AppState> {
        const hostId = params.get(HOST_ID);
        const pathId = params.get(PATH_ID);
        if (!hostId) return {};

        const { rules } = appState;
        const ruleIdCtx = { hostId, pathId };
        const rule = this.dataHandle.getRuleFromIdCtx(rules, ruleIdCtx);
        if (!rule) return {};

        return this.optionListViewStateHandle.onEditView(appState, ruleIdCtx);
    }

    onOptionListAddHost(appState: AppState, params: URLSearchParams): Partial<AppState> {
        const hostUrl = params.get(HOST_URL);
        if (!hostUrl) return {};

        const valueInput = new TextInputState({ value: hostUrl, isValid: true });
        const { localState } = this.modalStateHandle.onAddHostModal(appState);
        return {
            localState: {
                ...localState,
                modal: {
                    ...localState.modal,
                    valueInput,
                }
            }
        };
    }

    onOptionListAddPath(appState: AppState, params: URLSearchParams): Partial<AppState> {
        const hostId = params.get(HOST_ID);
        const path = params.get(PATH);
        if (!hostId || !path) return {};

        const valueInput = new TextInputState({ value: path, isValid: true });
        const ruleIdCtx = { hostId };
        const { localState } = this.modalStateHandle.onAddPathModal(appState, ruleIdCtx);
        return {
            localState: {
                ...localState,
                modal: {
                    ...localState.modal,
                    valueInput,
                }
            }
        };
    }
}

export const urlToAppStateHandle = new UrlToAppStateHandle();
