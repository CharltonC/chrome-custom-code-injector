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
        const resolveFn = this.getGetStateResolveFn();
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

    //// URL
    async getTabUrl(): Promise<URL> {
        const resolveCallback = this.getGetCurrentResolveFn();
        return new Promise(resolveCallback);
    }

    //// HELPER
    getGetStateResolveFn(): AFn {
        return resolve => {
            const storageCallback = this.getStorageCallback(resolve);
            chrome.storage.sync.get(this.storeKey, storageCallback);
        };
    }

    getGetCurrentResolveFn(): AFn {
        return resolve => {
            const callback = this.getUrlCallback(resolve);
            chrome.tabs.getCurrent(callback);
        };
    }

    getStorageCallback(resolveFn: AFn): AStorageCallack {
        return (storage: AObj) => resolveFn(storage[this.storeKey]);
    }

    getUrlCallback(resolveFn: AFn) {
        return tab => {
            const url = new URL(tab.url);
            resolveFn(url);
        };
    }
}

export const chromeHandle = new ChromeHandle();
