import { Component } from 'react';
import { IStoreConfigs, ITransfmStoreConfigs, TStoreConfig, TFn, TObj } from './type';

export class BaseStoreComponent extends Component<any, TObj> {
    transformStoreConfigs(storeConfigs: IStoreConfigs): ITransfmStoreConfigs {
        // For single store and store handler
        const { root } = storeConfigs;

        if (root) {
            const [ store, storeHandler ] = root;
            return {
                store,
                storeHandler: new Proxy(storeHandler, {
                    get: this.getProxyHandler(storeHandler)
                })
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
                storeHandler[storeName] = new Proxy(subStoreHandler, {
                    get: this.getProxyHandler(subStoreHandler, storeName)
                });
                return container;
            }, {
                store: {},
                storeHandler: {}
            });
    }

    getProxyHandler(storeHandler: TObj, storeName?: string): TFn {
        const methodNames: string[] = this.getProtoMethodNames(storeHandler);
        const cmp = this;

        return (target: TObj, key: string, proxy: TObj) => {
            const value: any = target[key];
            const isAllowed: boolean = methodNames.indexOf(key) !== -1;

            // Only allow own prototype methods
            // - i.e. Filter out non-methods, `constructor`, all props/methods from `StoreHandle`, non-exist methods etc
            if (!isAllowed || typeof value !== 'function') return value;

            // If proxied method is called, then return a wrapped method which includes setting the state
            return (...args: any[]) => {
                const { state } = cmp;
                const modPartialState = value.call(proxy, state, ...args);
                const modState = storeName ?
                    { ...state, [storeName]: { ...state[storeName] , ...modPartialState } } :
                    { ...state, ...modPartialState };

                cmp.setState(modState, () => {
                    storeHandler.pub({ prev: state, curr: modState }, storeName);
                });
            }
        }
    }

    getProtoMethodNames(obj: TObj): string[] {
        const proto = Object.getPrototypeOf(obj);
        return Object
            .getOwnPropertyNames(proto)
            .filter(key => key !== 'constructor');
    }

    checkStoreName(storeName: string, store: TObj, storeHandler: TObj): void {
        const isInStore: boolean = storeName in store;
        const isInHandler: boolean = storeName in storeHandler;
        if (isInStore || isInHandler) throw new Error(`${storeName} already exists in store or store handler`);
    }
}