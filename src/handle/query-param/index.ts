import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { EPrefillAction } from '../app-state-prefill/type';
import { EQueryParam } from './type';

const { EDIT, ADD_HOST, ADD_PATH } = EPrefillAction;
const { HOST_ID, HOST_URL, PATH_ID, PATH } = EQueryParam;

export class QueryParamHandle {
    createEditParam(ruleIdCtx: RuleIdCtxState): string {
        const { hostId, pathId } = ruleIdCtx;
        if (!hostId) return '';

        const actionParam = `?action=${EDIT}`;
        const hostIdParam = `&${HOST_ID}=${hostId}`;
        const pathIdParam = pathId && `&${PATH_ID}=${pathId}`;
        const baseParam = actionParam + hostIdParam;
        return pathIdParam
            ? baseParam + pathIdParam
            : baseParam;
    }

    createAddHostParam(host: string): string {
        if (!host) return '';

        const actionParam = `?action=${ADD_HOST}`;
        const hostUrlParam = `&${HOST_URL}=${host}`;
        return actionParam + hostUrlParam;
    }

    createAddPathParam(hostId: string, path: string) {
        if (!hostId || !path) return '';

        const actionParam = `?action=${ADD_PATH}`;
        const hostIdParam = `&${HOST_ID}=${hostId}`;
        const pathUrlParam = `&${PATH}=${path}`;
        return actionParam + hostIdParam + pathUrlParam;
    }
}

export const queryParamHandle = new QueryParamHandle();