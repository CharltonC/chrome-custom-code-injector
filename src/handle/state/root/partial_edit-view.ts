import { StoreHandle } from '../../store';
import { AppState } from '../../../model/app-state';
import { LocalState } from '../../../model/local-state';

export class EditViewStateHandler extends StoreHandle.BaseStoreHandler {
    onListView({localState}: AppState): Partial<AppState> {
        const { pgnOption } = localState;   // maintain the only pagination setting
        const resetLocalState = new LocalState();

        return {
            localState: {
                ...resetLocalState,
                pgnOption,
                editViewTarget: null
            }
        };
    }

    onListItemChange({ localState }: AppState, item) {
        return {
            localState: {
                ...localState,
                editViewTarget: item,
            }
        };
    }

    onActiveTabChange({ localState }: AppState, ...[,,idx]: any[]) {
        const modLocalState = { ...localState };
        modLocalState.editViewTarget.activeTabIdx = idx;

        return {
            localState: modLocalState
        };
    }

    onTabEnable({ localState }: AppState, evt, { id, isOn }) {
        const modLocalState = { ...localState };
        let key: string;

        switch(id) {
            case 'css':
                key = 'isCssOn';
                break;
            case 'js':
                key = 'isJsOn';
                break;
            case 'lib':
                key = 'isLibOn';
                break;
            default:
                throw new Error('key does not match');
        }

        modLocalState.editViewTarget[key] = !isOn;

        return {
            localState: modLocalState
        };
    }

    onEditorCodeChange({ localState }: AppState, { codeMode, value }) {
        const modLocalState = { ...localState };
        const key: string = `${codeMode}Code`;
        const hsKey = key in modLocalState.editViewTarget;

        if (!hsKey) throw new Error('key does not match');

        modLocalState.editViewTarget[key] = value;
        return {
            localState: modLocalState
        };
    }
}