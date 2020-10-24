import { BaseStoreHandler } from './base-store-handler';

export interface IStoreConfigs {
    [k: string]: [ TObj, BaseStoreHandler ];
}

export interface ITransfmStoreConfigs {
    [k: string]: TObj | Record<string, BaseStoreHandler>;
}

export type TCmp = React.FC<any> | React.ComponentClass<any>;

export type TFn = (...args: any[]) => any;

export type TObj = Record<string, any>;