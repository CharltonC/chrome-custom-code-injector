import { FC, Component, ComponentClass, MemoExoticComponent } from 'react';

export interface IEvtCls<TCls = Event> {
    new (...args: any[]): TCls
}

export interface ICmpInst extends Component {}

export type ACmpCls = FC | ComponentClass | MemoExoticComponent<any>;
export type AMethodSpy<T> = Record<keyof T, jest.SpyInstance>;
