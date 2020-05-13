import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

describe('option page', () => {
    let elem: HTMLElement;

    beforeEach(() => {
        elem = document.createElement("div");
        document.body.appendChild(elem);
    });

    afterEach(() => {
        unmountComponentAtNode(elem);
        elem.remove();
        elem = null;
    });

    it("renders", () => {
        act(() => {
            render(<h1>lorem</h1>, elem);
        });
        expect(elem.textContent).toBe('lorem');
    });
});

