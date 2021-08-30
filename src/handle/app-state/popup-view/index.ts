import { StateHandle } from '../../state';
import { chromeHandle } from '../../chrome';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { AppState } from '../../../model/app-state';

export class PopupViewStateHandle extends StateHandle.BaseStateManager {
    onOpenExtOption(state: AppState, payload?: RuleIdCtxState) {
        chromeHandle.openExtOptionTab(payload);
        return {};
    }

    onOpenExtUserguide() {
        chromeHandle.openUserguideTab();
        return {};
    }
}
