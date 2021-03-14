import { Component } from 'react';
import { BaseStoreHandler } from './base-store-handler';
import { IStoreConfigs, ITransfmStoreConfigs, AObj, AFn } from './type';

export class BaseStoreComponent extends Component<any, AObj> {
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
        const allowedMethodNames: string[] = this.getAllowedMethodNames(storeHandler);
        const getModPartialState = this.getModPartialState.bind(this);
        const updateState = this.updateState.bind(this);

        return new Proxy(storeHandler, {
            get: (target: BaseStoreHandler, key: string, proxy: BaseStoreHandler) => {
                const method: any = target[key];

                // TODO - if User requests the root store handler, `rootHandler`, return the rootHandler object
                // e.g. if (key === 'rootHandler')

                // Filter out non-own prototype methods
                if (allowedMethodNames.indexOf(key) === -1) return method;

                // If proxied method is called, then return a wrapped method which includes setting the state
                return async (...args: any[]) => {
                    const modPartialState: AObj = getModPartialState(method, proxy, args);

                    if (!modPartialState) return;   // skip state update if `falsy` value is returned

                    // If contains promise or async/await logic
                    if (modPartialState instanceof Promise) {
                        const partialState = await modPartialState;
                        updateState(partialState, storeHandler, storeName);

                    } else {
                        // TODO - Check type if its not object, throw error
                        updateState(modPartialState, storeHandler, storeName);
                    }

                };
            }
        });
    }

    getAllowedMethodNames(obj: AObj): string[] {
        const proto = Object.getPrototypeOf(obj);
        return Object
            .getOwnPropertyNames(proto)
            .filter((key: string) => {
                const { get, set, value } = Object.getOwnPropertyDescriptor(proto, key);
                return key !== 'constructor' && typeof value === 'function' && !get && !set;
            });
    }

    getModPartialState(fn: AFn, proxy: BaseStoreHandler, args: any[]): AObj {
        return fn.apply(proxy, [this.state, ...args]);
    }

    updateState(modPartialState: AObj, storeHandler: BaseStoreHandler, storeName?: string): void {
        const { state } = this;
        const modState = storeName ?
            { ...state, [storeName]: { ...state[storeName] , ...modPartialState } } :
            { ...state, ...modPartialState };
        const diffState = { prev: state, curr: modState };
        this.setState(modState, () => storeHandler.pub(diffState, storeName));
    }

    checkStoreName(storeName: string, store: AObj, storeHandler: AObj): void {
        const isInStore: boolean = storeName in store;
        const isInHandler: boolean = storeName in storeHandler;
        if (isInStore || isInHandler) throw new Error(`${storeName} ${this.STORE_NAME_ERR}`);
    }
}