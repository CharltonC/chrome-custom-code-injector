import React, { Component, ReactElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ShallowRenderer, createRenderer } from 'react-test-renderer/shallow';
import { IEvtCls, ICmpInst, TCmpCls, TCmpProps, TStateProps, TFn } from './type';

export const TestUtil = {
    setupElem(tagName: string = 'div'): HTMLElement {
        const elem: HTMLElement = document.createElement(tagName);
        document.body.appendChild(elem);
        return elem;
    },

    teardown(elem: HTMLElement): void {
        unmountComponentAtNode(elem);
        elem.remove();
    },

    // Fix to Issue w/ Change event not fired when Setting Input value
    // - Ref: https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js/46012210#46012210
    setInputVal(inputElem: HTMLInputElement | HTMLTextAreaElement, val: string, isInputElem: boolean = true): void {
        const ntvProto = isInputElem ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
        const ntvSetter = Object.getOwnPropertyDescriptor(ntvProto, 'value').set;
        ntvSetter.call(inputElem, val);
    },

    renderShallow(reactElem: ReactElement): ReactElement {
        const shallow: ShallowRenderer = createRenderer();
        shallow.render(reactElem);
        return shallow.getRenderOutput();
    },

    renderPlain(elem: HTMLElement, Cmp: TCmpCls, stateProps: TCmpProps = {}): void {
        act(() => {
            render(<Cmp {...stateProps} />, elem);
        });
    },

    renderInStatefulWrapper(elem: HTMLElement, Cmp: TCmpCls, stateProps: TCmpProps = {}): void {
        class Wrapper extends Component<any, any> {
            constructor(props) {
                super(props);
                this.state = stateProps;
            }
            render() {
                return <Cmp {...this.state} />;
            }
        }
        act(() => {
            render(<Wrapper />, elem);
        });
    },

    triggerEvt(elem: HTMLElement, evtType: string, EvtCls: IEvtCls = Event, bubbles = true): void {
        act(() => {
            elem.dispatchEvent(new EvtCls(evtType, { bubbles }));
        });
    },

    spyMethods(target: Record<string, any>): Record<string, jest.SpyInstance> {
        const $spy: Record<string, jest.SpyInstance> = {};
        const proto: Record<string, any> = Object.getPrototypeOf(target);
        Object
            .getOwnPropertyNames(proto)
            .forEach((name: string) => {
                $spy[name] = jest.spyOn(target, name);
            });
        return $spy;
    },

    spyProtoMethods(target: {new(...args: any[]): any}, extraKeys: string[] = []): Record<string, jest.SpyInstance> {
        const $spy: Record<string, jest.SpyInstance> = {};

        Object
            .getOwnPropertyNames(target.prototype)
            .filter((name: string) => name !== 'constructor')   // Dont mock the constructor as it will cause problem with `this` context
            .forEach((name: string) => {
                $spy[name] = jest.spyOn(target.prototype, name);
            });


        extraKeys.forEach((name: string) => {
            $spy[name] = jest.spyOn(target.prototype, name);
        });

        return $spy;
    },

    getStatePropsMocker<P = TStateProps, S = TStateProps>(cmpInstance: ICmpInst): TFn {
        return (props: P, state: S): void => {
            if (typeof props !== 'undefined') {
                (cmpInstance as any).props = props;
            }

            if (typeof state !== 'undefined') {
                cmpInstance.state = state;
            }
        }
    }

}
