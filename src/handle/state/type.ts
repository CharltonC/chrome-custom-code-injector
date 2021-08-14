import { BaseStateManager } from './base-state-manager';

export interface IStateConfigs {
    root?: [ AObj, BaseStateManager ];
    [k: string]: [ AObj, BaseStateManager ];
}

export interface ITransfmStateConfigs {
    appState: AObj;
    appStateHandle: BaseStateManager | Record<string, BaseStateManager>;
}

export interface IStateHandleClass<T = BaseStateManager> {
    new(...args: any[]): T;
}

export interface IAppProps<T, U> {
    appState: T;
    appStateHandle: Record<keyof U, (...args: any[]) => any>;
}
