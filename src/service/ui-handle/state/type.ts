export type TStore = Record<string, any>;

export type TCmp = React.FC<any> | React.ComponentClass<any>;

export type TProxyGetHandler = (...args: any[]) => any;

export interface IClass<T> {
    new(...args: any[]): T
}