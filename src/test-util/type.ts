import { FC, ComponentClass } from 'react';

export interface IEvtCls<TCls = Event> {
    new (...args: any[]): TCls
}

export type TCmpCls = FC | ComponentClass;

export type TCmpProps = Record<string, any>;