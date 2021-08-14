import { IState, TStorageCallack } from './type';

export class ChromeHandle {
    storeKey = 'chrome-code-injector';

    constructor(storeKey?: string) {
        if (!storeKey) return;
        this.storeKey = storeKey;
    }

    //// STATE
    async getState(): Promise<IState> {
        const resolveFn = this.getResolveCallback();
        const data: IState = await new Promise(resolveFn);
        return data;
    }

    async saveState(stateToMerge: Partial<IState>): Promise<void>  {
        const existState = await this.getState();
        const state = Object.assign(existState, stateToMerge);
        chrome.storage.sync.set({
            [this.storeKey]: state
        });
    }

    //// HELPER
    getResolveCallback(): AFn {
        return resolve => {
            const storageCallback = this.getStorageCallback(resolve);
            chrome.storage.sync.get(this.storeKey, storageCallback);
        };
    }

    getStorageCallback(resolveFn: AFn): TStorageCallack {
        return (storage: AObj) => resolveFn(storage[this.storeKey]);
    }
}

export const chromeHandle = new ChromeHandle();
