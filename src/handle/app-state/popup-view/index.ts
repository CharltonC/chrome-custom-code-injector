import { cloneDeep } from 'lodash';
import { StateHandle } from '../../state';
import { chromeHandle } from '../../chrome';
import { queryParamHandle } from '../../query-param';

import { HostRule } from '../../../model/rule';
import { RuleIdCtxState } from '../../../model/rule-id-ctx-state';
import { IAppState } from '../../../component/app/popup/type';
import { dataHandle } from '../../data';

export class PopupViewStateHandle extends StateHandle.BaseStateManager {
    onOpenExtOption(): Partial<IAppState> {
        chromeHandle.openExtOption();
        return {};
    }

    onOpenExtOptionForEdit(state: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const param = queryParamHandle.createEditParam(payload);
        chromeHandle.openExtOption(param);
        return {};
    }

    onOpenExtOptionForAddHost(state: IAppState, payload: { hostUrl: string }): Partial<IAppState> {
        const { hostUrl } = payload;
        const param = queryParamHandle.createAddHostParam(hostUrl);
        chromeHandle.openExtOption(param);
        return {};
    }

    onOpenExtOptionForAddPath(state: IAppState, payload: {hostId: string, path: string}): Partial<IAppState> {
        const { hostId, path } = payload;
        const param = queryParamHandle.createAddPathParam(hostId, path);
        chromeHandle.openExtOption(param);
        return {};
    }

    onOpenExtUserguide(): Partial<IAppState> {
        chromeHandle.openUserguide();
        return {};
    }

    onDelHostOrPath({ rules: _rules }: IAppState, payload: RuleIdCtxState): Partial<IAppState> {
        const { pathId } = payload;
        const rules: HostRule[] = cloneDeep(_rules);
        pathId
            ? dataHandle.rmvPath(rules, payload)
            : dataHandle.rmvHost(rules, payload);
        chromeHandle.saveState({ rules });
        return { rules };
    }
}
