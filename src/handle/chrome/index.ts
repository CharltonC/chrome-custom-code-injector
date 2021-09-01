import { SettingState } from '../../model/setting-state';
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
    /**
     * Initialize the app state storage (only executed once) for entire app
     */
    async initState() {
        const state = await chromeHandle.getState();
        if (!state) {
            const defState = chromeHandle.getDefState();
            await chromeHandle.saveState(defState, false);
        }
    }

    async getState(): Promise<IState> {
        const resolveFn = this.getOnGetStateResolved();
        const existState: string = await new Promise(resolveFn);
        return existState
            ? JSON.parse(existState)
            : existState;
    }

    getDefState(): IState {
        return {
            rules: getDefRules(),
            setting: new SettingState(),
        };
    }

    async saveState(state: Partial<IState>, shouldMerge = true): Promise<void>  {
        if (!this.isInChromeCtx) return;

        let value: string;
        if (shouldMerge) {
            const existState = await this.getState();
            const newstate = Object.assign(existState, state);
            value = JSON.stringify(newstate);
        } else {
            value = JSON.stringify(state);
        }

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

    openExtOption(urlParams: string = ''): void {
        const baseUrl = this.optionPageUrl;
        chrome.tabs.create({
            url: `${baseUrl}${urlParams}`
        });
    }

    openUserguide(): void {
        chrome.tabs.create({
            url: `https://github.com/CharltonC/chrome-custom-code-injector-userguide`
        });
    }

    //// CSP
    /**
     * Update the CSP (if needed) to allow injection of inline Js/Css and 3rd Party JS/Stylesheets if the script/style injection calls originate from page itself (incl. from extension run within the page)
     */
    getAlteredCsp(cspValue: string, policies: string[]): string {
        const ALL = `*`;
        const DEF_SRC_POLICY = 'default-src';
        let csp: string = cspValue;

        policies.forEach(CSP_PARTIAL => {
            const cspPartial = this.getCspSubPolicy(cspValue, CSP_PARTIAL);

            // Add `*` value to partial policy if exists but has no such value
            if (cspPartial) {
                if (cspPartial.includes(ALL)) return;
                csp = this.addCspSubPolicyValue(cspValue, cspPartial);

            // Add a new policy value `<policy> *` to existing policy if
            // - partial policy is not found and
            // - fallback policy `default-self` is found but has no `*` value
            //   OR fallback policy `default-self` is not found
            } else {
                const defSrcCspPartial = this.getCspSubPolicy(cspValue, DEF_SRC_POLICY);
                if (defSrcCspPartial?.includes(ALL)) return;
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
     * Add a new policy `<policy-name> *` to the CSP value
     */
    addCspSubPolicy(cspValue: string, policy: string): string {
        const newPolicy = `; ${policy} *`;
        return cspValue + newPolicy;
    }

    /**
     * Add a new value `*` to existing policy in the CSP value
     */
    addCspSubPolicyValue(cspValue: string, policyValue: string): string {
        const updatedPolicy = policyValue + ` *`;
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

    get optionPageUrl(): string {
        const extId = chrome.runtime.id;
        return `chrome-extension://${extId}/option/index.html`;
    }
}

export const chromeHandle = new ChromeHandle();
