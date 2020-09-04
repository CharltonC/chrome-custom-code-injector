import PubSub from 'pubsub-js';
import React, { Component, ComponentClass } from 'react';
import { TStore, TStateGetter, TStateSetter, TCmp, TProxyGetHandler, TCallback } from './type';

export class BaseStoreHandler {
    readonly CHANGE_EVT: string = 'CHANGE';
    readonly PubSub: PubSub = PubSub;

    get reflect() {
        return this;
    }

    subscribe(callback: TCallback): string {
        return this.PubSub.subscribe(this.CHANGE_EVT, callback);
    }

    publish(curState: TStore, modState: TStore): void {
        this.PubSub.publish(this.CHANGE_EVT, { curState, modState });
    }

    unsubscribe(token: string): void {
        this.PubSub.unsubscribe(token);
    }
}

export const StateHandle = {
    init(Cmp: TCmp, store: TStore, handler: BaseStoreHandler): ComponentClass {
        const { getProxyGetHandler } = this;

        // TOOD: get the methods for each store handler
        const handlerMethods: string[] = Object
            .getOwnPropertyNames(Object.getPrototypeOf(handler))
            .filter(key => key !== 'constructor');

        return class extends Component<any, TStore> {
            storeHandler: BaseStoreHandler;

            constructor(props: Record<string, any>) {
                super(props);

                // TODO: merge all store
                this.state = store;

                // TODO: loop all stores
                // 1. create proxy for each store with corresp. handler
                // 2. merge all store handler
                this.storeHandler = new Proxy(handler, {
                    get: getProxyGetHandler(
                        () => this.state,
                        (curState: TStore, modState: TStore) => this.setState(modState, () => handler.publish(curState, modState)),
                        handlerMethods
                    )
                });
            }

            render() {
                return <Cmp store={this.state} storeHandler={this.storeHandler} />;
            }
        }
    },

    getProxyGetHandler(stateGetter: TStateGetter, stateSetter: TStateSetter, handlerMethods: string[]): TProxyGetHandler {
        return (target: BaseStoreHandler, key: string, proxy: BaseStoreHandler) => {
            const prop = target[key];
            const isAllowed: boolean = handlerMethods.indexOf(key) !== -1;

            // Only allow own prototype methods
            // - i.e. Filter out non-methods, `constructor`, all props/methods from `StoreHandle`, non-exist methods etc
            if (!isAllowed || typeof prop !== 'function') return prop;

            // If proxied method is called, then return a wrapped method which includes setting the state
            return (...args: any[]) => {
                const curState: TStore = stateGetter();
                const partialModState: TStore = prop.call(proxy, curState, ...args);
                stateSetter(curState, { ...curState, ...partialModState });
            }
        }
    },

    init2(Cmp: TCmp, storeConfig): ComponentClass {
        const createStateManager = this.createStateManager.bind(this);

        return class extends Component<any, TStore> {
            storeHandler: BaseStoreHandler;

            constructor(props: Record<string, any>) {
                super(props);
                const { state, stateHandler } = createStateManager(this, storeConfig);
                this.state = state;
                this.storeHandler = stateHandler;
            }

            render() {
                return <Cmp store={this.state} storeHandler={this.storeHandler} />;
            }
        }
    },

    createStateManager(reactCmp, storeConfig) {
        const state = {};
        const stateHandler = {};

        Object
            .entries(storeConfig)
            .forEach(([ storeName, config ]: [ string, any[]]) => {
                const [ store, storeHandler ] = config;

                if (storeName in state) throw new Error(`${storeName} already exists in store`);
                if (storeName in stateHandler) throw new Error(`${storeName} already exists in store handler`);

                const stateGetter = this.getStateGetter(reactCmp, storeName);   // TODL: global state?? or local state or both e.g. `{ root, local }`
                const stateSetter = this.getStateSetter(reactCmp, storeHandler);
                const handlerMethodNames = this.getHandlerOwnMethodNames(storeHandler);

                state[storeName] = store;       // set state prop
                stateHandler[storeName] = new Proxy(storeHandler, {
                    get: this.getProxyGetHandler2(stateGetter, stateSetter, handlerMethodNames)
                });
            });

        return { state, stateHandler };
    },

    getProxyGetHandler2(stateGetter: TStateGetter, stateSetter: TStateSetter, handlerMethods: string[]): TProxyGetHandler {
        return (target: BaseStoreHandler, key: string, proxy: BaseStoreHandler) => {
            const prop = target[key];
            const isAllowed: boolean = handlerMethods.indexOf(key) !== -1;

            // Only allow own prototype methods
            // - i.e. Filter out non-methods, `constructor`, all props/methods from `StoreHandle`, non-exist methods etc
            if (!isAllowed || typeof prop !== 'function') return prop;

            // If proxied method is called, then return a wrapped method which includes setting the state
            return (...args: any[]) => {
                const state = stateGetter();
                const { local, root, name } = state;
                const partialModLocalState = prop.call(proxy, state, ...args);
                const modLocalState = { ...local, ...partialModLocalState };
                const modState = {[name]: modLocalState };
                stateSetter(root, { ...root, ...modState });
            }
        }
    },

    getStateGetter(reactCmp, storeName) {
        return () => {
            const { state } = reactCmp;
            return {
                root: state,
                name: storeName,
                local: state[storeName],
            };
        }
    },

    getStateSetter(reactCmp, storeHandler) {
        return (curState: TStore, modState: TStore) => {
            // TODO: subscribe data add `storeName`
            reactCmp.setState(modState, () => storeHandler.publish(curState, modState));
        }
    },

    getHandlerOwnMethodNames(storeHandler): string[] {
        const proto = Object.getPrototypeOf(storeHandler);
        return Object
            .getOwnPropertyNames(proto)
            .filter(key => key !== 'constructor');
    }
}