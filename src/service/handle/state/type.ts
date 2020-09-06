export interface IStoreConfigs {
    root?: TStoreConfig;
    [k: string]: TStoreConfig;
}

export interface ITransfmStoreConfigs {
    store: TObj;
    storeHandler: TObj;
}

export type TStoreConfig = [ TObj, TObj ];

export type TCmp = React.FC<any> | React.ComponentClass<any>;

export type TFn = (...args: any[]) => any;

export type TObj = Record<string, any>;