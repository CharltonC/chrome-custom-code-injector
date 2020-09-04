export type TStore = Record<string, any>;
export type TStateGetter = () => TStore;
export type TStateSetter = (curState: TStore, modState: TStore) => void;

export type TCmp = React.FC<any> | React.ComponentClass<any>;

export type TProxyGetHandler = (...args: any[]) => any;

export type TCallback = (...args: any[]) => any;