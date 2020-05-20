import React, { Component } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

export const TestUtil = {
    setupElem(): HTMLElement {
        const elem: HTMLElement = document.createElement("div");
        document.body.appendChild(elem);
        return elem;
    },

    teardown(elem: HTMLElement): void {
        unmountComponentAtNode(elem);
        elem.remove();
    },

    // Fix to Issue w/ Change event not fired when Setting Input value
    // - Ref: https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js/46012210#46012210
    setInputVal(inputElem: HTMLInputElement | HTMLTextAreaElement, val: string, isInputElem: boolean = true) {
        const ntvProto = isInputElem ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
        const ntvSetter = Object.getOwnPropertyDescriptor(ntvProto, 'value').set;
        ntvSetter.call(inputElem, val);
    },

    renderPlain(elem: HTMLElement, Cmp, stateProps = {}) {
        act(() => {
            render(<Cmp {...stateProps} />, elem);
        });
    },

    renderInStatefulWrapper(elem: HTMLElement, Cmp, stateProps = {}) {
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
    }
}
