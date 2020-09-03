import PubSub from 'pubsub-js';
import React, { Component, ComponentClass } from 'react';
import { TStore, TCmp, TProxyGetHandler } from './type';

export class BaseStoreHandler {
    readonly CHANGE_EVT: string = 'CHANGE';
    readonly PubSub: PubSub = PubSub;

    get reflect() {
        return this;
    }

    subscribe(callback: (args: any[]) => any): string {
        return this.PubSub.subscribe(this.CHANGE_EVT, callback);
    }

    publish(store: TStore): void {
        this.PubSub.publish(this.CHANGE_EVT, store);
    }

    unsubscribe(token: string): void {
        this.PubSub.unsubscribe(token);
    }
}

export const StateHandle = {
    init(Cmp: TCmp, store: TStore, handler: BaseStoreHandler): ComponentClass {
        const { getProxyGetHandler } = this;
        const ownMethodNames: string[] = Object
            .getOwnPropertyNames(Object.getPrototypeOf(handler))
            .filter(key => key !== 'constructor');

        return class extends Component<any, TStore> {
            baseStoreHandler: BaseStoreHandler;

            constructor(props: Record<string, any>) {
                super(props);
                this.state = store;
                this.baseStoreHandler = new Proxy(handler, {
                    get: getProxyGetHandler(
                        () => this.state,
                        (state: TStore) => this.setState(state),
                        ownMethodNames
                    )
                });
            }

            render() {
                return <Cmp store={this.state} baseStoreHandler={this.baseStoreHandler} />;
            }
        }
    },

    getProxyGetHandler(stateGetter: () => TStore, stateSetter: (store: TStore) => void, ownMethodNames: string[]): TProxyGetHandler {
        return (target: BaseStoreHandler, key: string, proxy: BaseStoreHandler) => {
            const prop = target[key];
            const isAllowed: boolean = ownMethodNames.indexOf(key) !== -1;

            // Only allow own prototype methods
            // - i.e. Filter out non-methods, `constructor`, all props/methods from `StoreHandle`, non-exist methods etc
            if (!isAllowed || typeof prop !== 'function') return prop;

            // If proxied method is called, then return a wrapped method which includes setting the state
            return (...args: any[]) => {
                const currState: TStore = stateGetter();
                const modState: TStore = prop.call(proxy, currState, ...args);
                stateSetter({ ...currState, ...modState });
            }
        }
    }
}