import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";

import { TestUtil } from '../../../test-util/';
import { IconBtn } from './';
import * as NIconBtn from './type';

describe('Component - Icon Button', () => {
    let elem: HTMLElement;
    let icon: NIconBtn.IIcon;
    let mockedCbFn: () => void;
    let btnElem: Element;

    beforeEach(() => {
        elem = TestUtil.setupElem();

        icon = {name: 'setting'};
        mockedCbFn = jest.fn();
        act(() => {
            render(<IconBtn icon={icon} onClick={mockedCbFn} />, elem);
        });

        btnElem = elem.children[0];
    });

    afterEach(() => {
        TestUtil.teardown(elem);
        elem = null;
    });

    it("should render with an icon", () => {
        const iconElems: NodeListOf<HTMLElement> = document.querySelectorAll('span.icon');
        expect(iconElems.length).toBe(1);

        const iconElem: HTMLElement = iconElems[0];
        expect(iconElem.className).toBe('icon icon--setting icon--light');
    });

    it('should trigger callback fn when clicked', () => {
        act(() => {
            btnElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
        expect(mockedCbFn).toHaveBeenCalledTimes(1);
    });
});

