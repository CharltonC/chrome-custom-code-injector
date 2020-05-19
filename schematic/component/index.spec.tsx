import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { TestUtil } from '../../../test-util/';
// import { CmpCls } from './';

describe('Component - TODO: Component Name', () => {
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

