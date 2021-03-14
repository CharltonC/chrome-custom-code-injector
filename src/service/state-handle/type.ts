import { BaseStoreHandler } from './base-store-handler';

export interface IStoreConfigs {
    root?: [ AObj, BaseStoreHandler ];
    [k: string]: [ AObj, BaseStoreHandler ];
}

export interface ITransfmStoreConfigs {
    store: AObj;
    storeHandler: BaseStoreHandler | Record<string, BaseStoreHandler>;
}

export interface IStoreHandlerClass<T = BaseStoreHandler> {
    new(...args: any[]): T;
}

export interface IAppProps<T, U> {
    store: T;
    storeHandler: Record<keyof U, (...args: any[]) => any>;
}

export type ACmp = React.FC<any> | React.ComponentClass<any>;
export type AFn = (...args: any[]) => any;
export type AObj = Record<string, any>;
