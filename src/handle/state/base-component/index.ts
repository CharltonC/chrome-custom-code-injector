import { Component } from 'react';
import { cloneDeep } from 'lodash';
import { BaseStateManager } from '../base-state-manager';
import { UtilHandle } from '../../util';
import { IStateConfigs, ITransfmStateConfigs, IStateChangeSummary } from '../type';

const { isJestOrProd } = UtilHandle;

export class BaseStateComponent extends Component<any, AObj> {
    readonly STATE_NAME_ERR: string = 'already exists in app state or app state handler';

    transformStateConfigs(stateConfigs: IStateConfigs): ITransfmStateConfigs {
        // For single state and state handler
        const { root } = stateConfigs;
        if (root) {
            const [ appState, appStateHandle ] = root;
            return {
                appState,
                appStateHandle: this.getProxyStateHandler(appStateHandle)
            };
        }

        // For more than one states and state handlers
        return Object
            .entries(stateConfigs)
            .reduce((container, [ name, subStateConfig ]) => {
                const { appState, appStateHandle } = container;
                this.checkStateName(name, appState, appStateHandle);

                const [ subState, subStateHandler ] = subStateConfig;
                appState[name] = subState;
                appStateHandle[name] = this.getProxyStateHandler(subStateHandler, name);
                return container;
            }, {
                appState: {},
                appStateHandle: {}
            });
    }

    getProxyStateHandler(appStateHandle: BaseStateManager, name?: string): BaseStateManager {
        const allowedMethodNames = this.getAllowedMethodNames(appStateHandle);
        const callback = this.getStateChangeCallback(appStateHandle);
        return new Proxy(appStateHandle, {
            get: this.getWrappedHandle(allowedMethodNames, name, callback)
        });
    }

    getWrappedHandle(allowedMethodNames: string[], name: string = '', callback: AFn): AFn {
        return (target: BaseStateManager, key: string, proxy: BaseStateManager): AFn => {
            const method: any = target[key];

            // MAYBE - if User requests the root appState handler, `rootHandler`, return the rootHandler object
            // e.g. if (key === 'rootHandler')

            // Filter out non-own prototype methods
            if (allowedMethodNames.indexOf(key) === -1) return method;

            // If proxied method is called, then return a wrapped method which includes setting the state
            return async (...args: any[]) => {
                let modPartialState: AObj = this.getModPartialState(method, proxy, args);

                // skip state update if `falsy` value is returned
                if (!modPartialState) return;

                // If contains promise or async/await logic
                if (modPartialState instanceof Promise) {
                    modPartialState = await modPartialState;
                }

                const nextState = this.getNextState(modPartialState, name);
                this.setState(nextState, () => {
                    callback.call(this, {
                        key: name,
                        method: key,
                        mod: modPartialState,
                        curr: nextState,
                        prev: this.state
                    });
                });
            };
        }
    }

    getStateChangeCallback(appStateHandle: BaseStateManager) {
        return (summary: IStateChangeSummary) => {
            const { key, method, mod, prev, curr } = summary;
            appStateHandle
                .pub({ prev, curr }, key)
                .log(method, mod, isJestOrProd)
        };
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

    getModPartialState(fn: AFn, proxy: BaseStateManager, args: any[]): AObj {
        const stateClone = cloneDeep(this.state);
        return fn.apply(proxy, [stateClone, ...args]);
    }

    getNextState(modPartialState: AObj, key: string = '') {
        const { state } = this;
        return key
            ? {
                ...state,
                [key]: {
                    ...state[key],
                    ...modPartialState
                }
            }
            : {
                ...state,
                ...modPartialState
            } ;
    }

    checkStateName(name: string, appState: AObj, appStateHandle: AObj): void {
        const isInState: boolean = name in appState;
        const isInHandler: boolean = name in appStateHandle;
        if (isInState || isInHandler) throw new Error(`${name} ${this.STATE_NAME_ERR}`);
    }
}