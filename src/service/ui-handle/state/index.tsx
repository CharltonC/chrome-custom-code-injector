import React, { Component, ComponentClass } from 'react';
import { TStore, TCmp, TProxyGetHandler, IClass } from './type';

export class StoreHandler {
    get reflect() {
        return this;
    }
}

export class StateHandle {
    static init(Cmp: TCmp, Store: IClass<TStore>, Handler: IClass<StoreHandler>): ComponentClass {
        const store: TStore = new Store();
        const handler: StoreHandler = new Handler();
        const { getProxyGetHandler } = this;

        return class extends Component<any, TStore> {
            constructor(props: Record<string, any>) {
                super(props);
                this.state = { ...store };
            }

            render() {
                const proxiedStoreHandler = new Proxy(
                    handler,
                    { get: getProxyGetHandler(this) }
                );
                return <Cmp store={this.state} storeHandler={proxiedStoreHandler} />;
            }
        }
    }

    static getProxyGetHandler(cmpCtx: Component): TProxyGetHandler {
        return (target: StoreHandler, key: string, targetProxy: StoreHandler) => {
            const value = target[key];

            // For `reflect` property and properties that dont exist
            if (typeof value !== 'function') return value;

            // Else return a wrapped method which includes setting the state
            const { state } = cmpCtx;
            return (...args: any[]) => {
                // The reason we have to use `targetProxy` as `this` context is because in some methods of `storeHandler` object, it may uses `this.reflect` to get partial state prior to setting state
                const modState = value.call(targetProxy, state, ...args);
                cmpCtx.setState({ ...state, ...modState });
            }
        }
    }
}