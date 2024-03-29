import { StateHandle } from '../../state';
import { chromeHandle } from '../../chrome';
import { queryParamHandle } from '../../query-param';

import { IStateHandle } from '../type';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { IAppState } from '../../../component/app/popup/type';
import { dataHandle } from '../../data';

export class PopupViewStateHandle extends StateHandle.BaseStateManager<IStateHandle> {
    onOpenExtOption(): Partial<IAppState> {
        chromeHandle.openExtOption();
        return null;
    }

    onOpenExtOptionForEdit(state: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const param = queryParamHandle.createEditParam(payload);
        chromeHandle.openExtOption(param);
        return null;
    }

    onOpenExtOptionForAddHost(state: IAppState, payload: { hostUrl: string }): Partial<IAppState> {
        const { hostUrl } = payload;
        const param = queryParamHandle.createAddHostParam(hostUrl);
        chromeHandle.openExtOption(param);
        return null;
    }

    onOpenExtOptionForAddPath(state: IAppState, payload: {hostId: string, path: string}): Partial<IAppState> {
        const { hostId, path } = payload;
        const param = queryParamHandle.createAddPathParam(hostId, path);
        chromeHandle.openExtOption(param);
        return null;
    }

    onOpenExtUserguide(): Partial<IAppState> {
        chromeHandle.openUserguide();
        return null;
    }

    onDelHostOrPath({ rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const { pathId } = payload;
        pathId
            ? dataHandle.rmvPath(rules, payload)
            : dataHandle.rmvHost(rules, payload);
        chromeHandle.saveState({ rules });
        return { rules };
    }
}
