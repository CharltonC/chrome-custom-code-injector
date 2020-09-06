import { Component } from 'react';
import { IStoreConfigs, ITransfmStoreConfigs, TStoreConfig, TFn, TObj } from './type';
import { BaseStoreHandler } from './base-store-handler';

export class BaseStoreComponent extends Component<any, TObj> {
    readonly STORE_NAME_ERR: string = 'already exists in store or store handler';

    transformStoreConfigs(storeConfigs: IStoreConfigs): ITransfmStoreConfigs {
        // For single store and store handler
        const { root } = storeConfigs;

        if (root) {
            const [ store, storeHandler ] = root;
            return {
                store,
                storeHandler: this.getProxyStoreHandler(storeHandler)
            };
        }

        // For more than one stores and store handlers
        return Object
            .entries(storeConfigs)
            .reduce((container, [ storeName, subStoreConfig ]: [ string, TStoreConfig ]) => {
                const { store, storeHandler } = container;
                this.checkStoreName(storeName, store, storeHandler);

                const [ subStore, subStoreHandler ] = subStoreConfig;
                store[storeName] = subStore;
                storeHandler[storeName] = this.getProxyStoreHandler(subStoreHandler, storeName);
                return container;
            }, {
                store: {},
                storeHandler: {}
            });
    }

    // TODO: `storeHandler` type
    getProxyStoreHandler(storeHandler: TObj, storeName?: string) {
        const methodNames: string[] = this.getProtoMethodNames(storeHandler);
        const cmp = this;
        const updateState = this.updateState.bind(this);

        return new Proxy(storeHandler, {
            get: (target: TObj, key: string, proxy: TObj) => {
                const method: any = target[key];

                // Filter out non-own prototype methods
                const isAllowed: boolean = methodNames.indexOf(key) !== -1;
                if (!isAllowed || typeof method !== 'function') return method;

                // If proxied method is called, then return a wrapped method which includes setting the state
                return (...args: any[]) => {
                    const modPartialState = method.call(proxy, cmp.state, ...args);
                    updateState(modPartialState, storeHandler, storeName);
                };
            }
        });
    }

    getProtoMethodNames(obj: TObj): string[] {
        const proto = Object.getPrototypeOf(obj);
        return Object
            .getOwnPropertyNames(proto)
            .filter(key => key !== 'constructor');
    }

    updateState(modPartialState, storeHandler, storeName: string) {
        const { state } = this;
        const modState = storeName ?
            { ...state, [storeName]: { ...state[storeName] , ...modPartialState } } :
            { ...state, ...modPartialState };
        const diffState = { prev: state, curr: modState };
        this.setState(modState, () => storeHandler.pub(diffState, storeName));
    }

    checkStoreName(storeName: string, store: TObj, storeHandler: TObj): void {
        const isInStore: boolean = storeName in store;
        const isInHandler: boolean = storeName in storeHandler;
        if (isInStore || isInHandler) throw new Error(`${storeName} ${this.STORE_NAME_ERR}`);
    }
}