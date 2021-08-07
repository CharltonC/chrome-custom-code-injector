import { BaseStateManager } from './base-state-manager';

export interface IStateConfigs {
    root?: [ AObj, BaseStateManager ];
    [k: string]: [ AObj, BaseStateManager ];
}

export interface ITransfmStateConfigs {
    appState: AObj;
    appStateManager: BaseStateManager | Record<string, BaseStateManager>;
}

export interface IStateHandlerClass<T = BaseStateManager> {
    new(...args: any[]): T;
}

export interface IAppProps<T, U> {
    appState: T;
    appStateManager: Record<keyof U, (...args: any[]) => any>;
}
