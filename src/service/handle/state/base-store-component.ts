import { Component } from 'react';
import { BaseStoreHandler } from './base-store-handler';
import { IStoreConfigs, ITransfmStoreConfigs, TObj, TFn } from './type';

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
            .reduce((container, [ storeName, subStoreConfig ]) => {
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

    getProxyStoreHandler(storeHandler: BaseStoreHandler, storeName?: string): BaseStoreHandler {
        const methodNames: string[] = this.getProtoMethodNames(storeHandler);
        const getModPartialState = this.getModPartialState.bind(this);
        const updateState = this.updateState.bind(this);

        return new Proxy(storeHandler, {
            get: (target: BaseStoreHandler, key: string, proxy: BaseStoreHandler) => {
                const method: any = target[key];

                // Filter out non-own prototype methods
                const isAllowed: boolean = methodNames.indexOf(key) !== -1;
                if (!isAllowed || typeof method !== 'function') return method;

                // If proxied method is called, then return a wrapped method which includes setting the state
                return (...args: any[]) => {
                    const modPartialState: TObj = getModPartialState(method, proxy, args);
                    updateState(modPartialState, storeHandler, storeName);
                };
            }
        });
    }

    getProtoMethodNames(obj: TObj): string[] {
        const proto = Object.getPrototypeOf(obj);
        return Object
            .getOwnPropertyNames(proto)
            .filter((key: string) => {
                const { get, set } = Object.getOwnPropertyDescriptor(proto, key);
                return key !== 'constructor' && !get && !set;
            });
    }

    getModPartialState(fn: TFn, proxy: BaseStoreHandler, args: any[]): TObj {
        return fn.apply(proxy, [this.state, ...args]);
    }

    updateState(modPartialState: TObj, storeHandler: BaseStoreHandler, storeName?: string): void {
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