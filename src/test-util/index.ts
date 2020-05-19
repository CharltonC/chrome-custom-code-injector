import { unmountComponentAtNode } from "react-dom";

export const TestUtil = {
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
