import React, { Component, ComponentClass } from 'react';
import { TStore, TStoreHandle, TCmp, TProxyGetHandler } from './type';

export class StateHandle {
    static init(Cmp: TCmp, store: TStore, storeHandle: TStoreHandle): ComponentClass {
        const { getProxyGetHandler } = this;
        return class extends Component<any, TStore> {
            constructor(props: Record<string, any>) {
                super(props);
                this.state = { ...store };
            }

            render() {
                const proxiedStoreHandle = new Proxy(
                    { ...storeHandle },
                    { get: getProxyGetHandler(this, storeHandle) }
                );
                return <Cmp store={this.state} storeHandle={proxiedStoreHandle} />;
            }
        }
    }

    static getProxyGetHandler(cmpCtx: Component, originalTarget: TStoreHandle): TProxyGetHandler {
        return (target: TStoreHandle, key: string, targetProxy: TStoreHandle) => {
            // Call original store handle methods (like Reflect) to get partial states to be consolidated (instead of setState)
            if (key === 'reflect') return originalTarget;

            // Check if method exists (AFTER `reflect`)
            const method = target[key];
            if (typeof method !== 'function') throw new Error('method does not exist or method is not a function');

            // Else return a wrapped method which includes setting the state
            const { state } = cmpCtx;
            return (...args: any[]) => {
                const modState = method.call(targetProxy, state, ...args);
                cmpCtx.setState({ ...state, ...modState })
            }
        }
    }
}