export type TStoreHandle<S = TStore> = Record<string, ((store: S, ...args: any[]) => S)>;

export type TStore = Record<string, any>;

export type TCmp = React.FC<any> | React.ComponentClass<any>;

export type TProxyGetHandler = (...args: any[]) => any;