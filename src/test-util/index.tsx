import React, { Component } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { IEvtCls, TCmpCls, TCmpProps } from './type';

class ElemContainerCls {
    _keys: string[];
    _wrapper: HTMLElement;
    _elemConfig: Record<string, string>;

    constructor($wrapper: HTMLElement, elemConfig: Record<string, string>) {
        this._wrapper = $wrapper;
        this._keys = Object.getOwnPropertyNames(elemConfig);
        this._elemConfig = elemConfig;
    }

    syncChildElem(doSync: boolean = true): this {
        if (doSync) {
            this._keys.forEach((key: string) => {
                const selector: string = this._elemConfig[key];
                const $childElem: HTMLElement = this._wrapper.querySelector(selector);
                this[key] = $childElem;
            });
        } else {
            this._wrapper = null;
            this._keys.forEach((key: string) => this[key] = null);
        }
        return this;
    }

    tearDown(): void {
        unmountComponentAtNode(this._wrapper);
        this._wrapper.remove();
        this.syncChildElem(false);
    }
}

export const TestUtil = {
    setupElem(): HTMLElement {
        const elem: HTMLElement = document.createElement("div");
        document.body.appendChild(elem);
        return elem;
    },

    setElems(elemConfig: Record<string, string>): ElemContainerCls {
        const $elem: HTMLElement = document.createElement("div");
        document.body.appendChild($elem);
        const $: ElemContainerCls = new ElemContainerCls($elem, elemConfig);
        $.syncChildElem();
        return $;
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
    }
}
