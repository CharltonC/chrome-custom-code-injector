import { Component } from 'react';
import { BaseStateHandler } from '../base-handler';
import { IStateConfigs, ITransfmStateConfigs } from '../type';

export class BaseStateComponent extends Component<any, AObj> {
    readonly STATE_NAME_ERR: string = 'already exists in app state or app state handler';

    transformStateConfigs(stateConfigs: IStateConfigs): ITransfmStateConfigs {
        // For single state and state handler
        const { root } = stateConfigs;
        if (root) {
            const [ appState, appStateHandler ] = root;
            return {
                appState,
                appStateHandler: this.getProxyStateHandler(appStateHandler)
            };
        }

        // For more than one states and state handlers
        return Object
            .entries(stateConfigs)
            .reduce((container, [ name, subStateConfig ]) => {
                const { appState, appStateHandler } = container;
                this.checkStateName(name, appState, appStateHandler);

                const [ subState, subStateHandler ] = subStateConfig;
                appState[name] = subState;
                appStateHandler[name] = this.getProxyStateHandler(subStateHandler, name);
                return container;
            }, {
                appState: {},
                appStateHandler: {}
            });
    }

    getProxyStateHandler(appStateHandler: BaseStateHandler, name?: string): BaseStateHandler {
        const allowedMethodNames: string[] = this.getAllowedMethodNames(appStateHandler);
        const getModPartialState = this.getModPartialState.bind(this);
        const updateState = this.updateState.bind(this);

        return new Proxy(appStateHandler, {
            get: (target: BaseStateHandler, key: string, proxy: BaseStateHandler) => {
                const method: any = target[key];

                // TODO - if User requests the root appState handler, `rootHandler`, return the rootHandler object
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
                        updateState(partialState, appStateHandler, name);

                    } else {
                        // TODO - Check type if its not object, throw error
                        updateState(modPartialState, appStateHandler, name);
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

    getModPartialState(fn: AFn, proxy: BaseStateHandler, args: any[]): AObj {
        return fn.apply(proxy, [this.state, ...args]);
    }

    updateState(modPartialState: AObj, appStateHandler: BaseStateHandler, name?: string): void {
        const { state } = this;
        const modState = name ?
            { ...state, [name]: { ...state[name] , ...modPartialState } } :
            { ...state, ...modPartialState };
        const diffState = { prev: state, curr: modState };
        this.setState(modState, () => appStateHandler.pub(diffState, name));
    }

    checkStateName(name: string, appState: AObj, appStateHandler: AObj): void {
        const isInState: boolean = name in appState;
        const isInHandler: boolean = name in appStateHandler;
        if (isInState || isInHandler) throw new Error(`${name} ${this.STATE_NAME_ERR}`);
    }
}