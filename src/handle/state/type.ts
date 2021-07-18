import { BaseStateHandler } from './base-handler';

export interface IStateConfigs {
    root?: [ AObj, BaseStateHandler ];
    [k: string]: [ AObj, BaseStateHandler ];
}

export interface ITransfmStateConfigs {
    store: AObj;
    storeHandler: BaseStateHandler | Record<string, BaseStateHandler>;
}

export interface IStateHandlerClass<T = BaseStateHandler> {
    new(...args: any[]): T;
}

export interface IAppProps<T, U> {
    store: T;
    storeHandler: Record<keyof U, (...args: any[]) => any>;
}
