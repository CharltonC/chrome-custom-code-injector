import { FC, ComponentClass, MemoExoticComponent } from 'react';

export interface IEvtCls<TCls = Event> {
    new (...args: any[]): TCls
}

export type TCmpCls = FC | ComponentClass | MemoExoticComponent<any>;

export type TCmpProps = Record<string, any>;

export type TMethodSpy<T> = Record<keyof T, jest.SpyInstance>;
