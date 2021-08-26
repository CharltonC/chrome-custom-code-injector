import { SettingState } from '../../model/setting-state';
import { getDefRules } from '../../model/rule/default';
import { IState, AStorageCallack } from './type';

export class ChromeHandle {
    storeKey = 'chrome-code-injector';
    isInChromeCtx = typeof chrome !== 'undefined' && !!chrome?.storage?.sync;

    constructor(storeKey?: string) {
        if (!storeKey) return;
        this.storeKey = storeKey;
    }

    //// STATE
    async getState(): Promise<IState> {
        const resolveFn = this.getResolveCallback();
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

    //// HELPER
    getResolveCallback(): AFn {
        return resolve => {
            const storageCallback = this.getStorageCallback(resolve);
            chrome.storage.sync.get(this.storeKey, storageCallback);
        };
    }

    getStorageCallback(resolveFn: AFn): AStorageCallack {
        return (storage: AObj) => resolveFn(storage[this.storeKey]);
    }
}

export const chromeHandle = new ChromeHandle();
