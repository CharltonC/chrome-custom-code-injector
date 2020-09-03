import PubSub from 'pubsub-js';
import React, { Component, ComponentClass } from 'react';
import { TStore, TCmp, TProxyGetHandler } from './type';

export class StoreHandler {
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

export class StateHandle {
    static init(Cmp: TCmp, store: TStore, handler: StoreHandler): ComponentClass {
        const { getProxyGetHandler } = this;

        return class extends Component<any, TStore> {
            storeHandler: StoreHandler;

            constructor(props: Record<string, any>) {
                super(props);
                this.state = store;
                this.storeHandler = new Proxy(handler, {
                    get: getProxyGetHandler(
                        () => this.state,
                        (state: TStore) => this.setState(state)
                    )
                });
            }

            render() {
                return <Cmp store={this.state} storeHandler={this.storeHandler} />;
            }
        }
    }

    static getProxyGetHandler(stateGetter: () => TStore, stateSetter: (store: TStore) => void): TProxyGetHandler {
        return (target: StoreHandler, key: string, proxy: StoreHandler) => {
            const method = target[key];

            // For `reflect` property and properties that dont exist
            if (typeof method !== 'function') return method;

            // If proxied method is called, then return a wrapped method which includes setting the state
            return (...args: any[]) => {
                const currState: TStore = stateGetter();
                const modState: TStore = method.call(proxy, currState, ...args);
                stateSetter({ ...currState, ...modState });
            }
        }
    }
}