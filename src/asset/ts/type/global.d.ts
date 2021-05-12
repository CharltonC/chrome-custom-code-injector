declare type AFn<T=any> = (...args: any[]) => T;
declare type AObj = Record<string, any>;
declare type AObjEntry = [string, any];
declare type ACmp = React.FC<any> | React.ComponentClass<any>;
