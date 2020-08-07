import { FC, Component, ComponentClass, MemoExoticComponent } from 'react';

export interface IEvtCls<TCls = Event> {
    new (...args: any[]): TCls
}

export interface ICmpInst extends Component {}

export type TCmpCls = FC | ComponentClass | MemoExoticComponent<any>;

export type TCmpProps = Record<string, any>;

export type TStateProps = Record<string, any>;

export type TMethodSpy<T> = Record<keyof T, jest.SpyInstance>;

export type TFn = (...args: any[]) => void;
