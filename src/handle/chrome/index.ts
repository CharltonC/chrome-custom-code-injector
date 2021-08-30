import { SettingState } from '../../model/setting-state';
import { RuleIdCtxState } from '../../model/rule-id-ctx-state';
import { getDefRules } from '../../model/rule/default';
import { IState } from './type';

export class ChromeHandle {
    storeKey = 'chrome-code-injector';
    isInChromeCtx = typeof chrome !== 'undefined' && !!chrome?.storage?.sync;

    constructor(storeKey?: string) {
        if (!storeKey) return;
        this.storeKey = storeKey;
    }

    //// STATE
    async getState(): Promise<IState> {
        const resolveFn = this.getOnGetStateResolved();
        const state: string = await new Promise(resolveFn);
        return state
            ? JSON.parse(state)
            : await this.getDefState();
    }

    async getDefState(): Promise<IState> {
        const state = {
            rules: getDefRules(),
            setting: new SettingState(),
        };
        await chromeHandle.saveState(state);
        return state;
    }

    async saveState(state: Partial<IState>): Promise<void>  {
        if (!this.isInChromeCtx) return;
        const existState = await this.getState();
        const newstate = Object.assign(existState, state);
        const value = JSON.stringify(newstate);
        await chrome.storage.sync.set({
            [this.storeKey]: value
        });
    }

    //// URL/TAB
    async getTabUrl(): Promise<URL> {
        const resolveCallback = this.getOnGetCurrentResolved();
        return new Promise(resolveCallback);
    }

    isMainframeRequest(evt: AObj): boolean {
        const { frameId, type, method, statusCode } = evt;
        return frameId === 0
            && method === 'GET'
            && type === 'main_frame'
            && statusCode >= 200
            && statusCode < 300;
    }

    openExtOptionTab(ruleIdCtx?: RuleIdCtxState): void {
        const extId = chrome.runtime.id;
        const baseUrl = `chrome-extension://${extId}/option/index.html`;
        let urlParams = '';

        if (ruleIdCtx) {
            const { hostId, pathId } = ruleIdCtx;
            const hostUrlParam = hostId && `?hostId=${hostId}`;
            const pathUrlParam = pathId && `&pathId=${pathId}`;
            urlParams = hostUrlParam && pathUrlParam
                ? `${hostUrlParam}${pathUrlParam}`
                : hostUrlParam
                    ? hostUrlParam
                    : '';
        }

        chrome.tabs.create({
            url: `${baseUrl}${urlParams}`
        });
    }

    openUserguideTab(): void {
        chrome.tabs.create({
            url: `https://github.com/CharltonC/chrome-custom-code-injector-userguide`
        });
    }

    //// CSP
    /**
     * Update the CSP (if needed) to allow injection of inline Js/Css and 3rd Party JS/Stylesheets if the script/style injection calls originate from page itself (incl. from extension run within the page)
     */
    getAlteredCsp(cspValue: string, policies: string[]): string {
        const SELF = `'self'`;
        const DEF_SRC_POLICY = 'default-src';
        let csp: string = cspValue;

        policies.forEach(CSP_PARTIAL => {
            const cspPartial = this.getCspSubPolicy(cspValue, CSP_PARTIAL);

            // Add `'self'` value to partial policy if exists but has no such value
            if (cspPartial) {
                if (cspPartial.includes(SELF)) return;
                csp = this.addCspSubPolicyValue(cspValue, cspPartial);

            // Add a new policy value `<policy> 'self'` to existing policy if
            // - partial policy is not found and
            // - fallback policy `default-self` is found but has no `'self'` value
            //   OR fallback policy `default-self` is not found
            } else {
                const defSrcCspPartial = this.getCspSubPolicy(cspValue, DEF_SRC_POLICY);
                if (defSrcCspPartial?.includes(SELF)) return;
                csp = this.addCspSubPolicy(cspValue, CSP_PARTIAL);
            }
        });
        return csp;
    }

    /**
     * Get the full CSP value
     */
    getCsp(responseHeaders: AObj): { name: string; value: string } {
        const CSP_HEADER = 'Content-Security-Policy';
        return responseHeaders.find(({ name }) => name === CSP_HEADER);
    }

    /**
     * Get the value of a specific CSP policy (if exist)
     */
    getCspSubPolicy(cspValue: string, policy: string): string {
        const regex = new RegExp(`(${policy}[^;]+)(?=;)?`);
        return regex.exec(cspValue)?.[0];
    }

    /**
     * Add a new policy `<policy-name> 'self'` to the CSP value
     */
    addCspSubPolicy(cspValue: string, policy: string): string {
        const newPolicy = `; ${policy} 'self'`;
        return cspValue + newPolicy;
    }

    /**
     * Add a new value `'self'` to existing policy in the CSP value
     */
    addCspSubPolicyValue(cspValue: string, policyValue: string): string {
        const updatedPolicy = policyValue + ` 'self'`;
        return cspValue.replace(policyValue, updatedPolicy);
    }

    //// HELPER
    getOnGetStateResolved(): AFn {
        return resolve => {
            const storageCallback = this.getOnStorage(resolve);
            chrome.storage.sync.get(this.storeKey, storageCallback);
        };
    }

    getOnGetCurrentResolved(): AFn {
        return resolve => {
            const callback = this.getOnTabQuery(resolve);
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, callback);
        };
    }

    getOnStorage(resolveFn: AFn): AFn {
        return (storage: AObj) => resolveFn(storage[this.storeKey]);
    }

    getOnTabQuery(resolveFn: AFn): AFn {
        // Arrays of tabs
        return ([tab]) => {
            const url = new URL(tab.url);
            resolveFn(url);
        };
    }
}

export const chromeHandle = new ChromeHandle();
