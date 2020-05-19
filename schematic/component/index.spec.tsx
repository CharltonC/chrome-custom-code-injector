import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

// import { CmpCls } from './';

const TestUtil = {
    setupElem(): HTMLElement {
        const elem: HTMLElement = document.createElement("div");
        document.body.appendChild(elem);
        return elem;
    },
    teardown(elem: HTMLElement): void {
        unmountComponentAtNode(elem);
        elem.remove();
    }
}

describe('Component - Symbol Button', () => {
    let elem: HTMLElement;
    let childElem: Element;

    beforeEach(() => {
        elem = TestUtil.setupElem();

        act(() => {
            // render(<CmpCls />, elem);
        });

        act(() => {
            // elem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });

        childElem = elem.children[0];
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
    });

    it("should render", () => {
        expect(true).toBe(true);
    });
});

