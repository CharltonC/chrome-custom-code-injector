import React, { ReactElement } from "react";

import * as NIcon from './type';
import { inclStaticIcon } from "./";

describe('Static Component - Icon', () => {
    const iconName: NIcon.TName = 'setting';
    const iconBaseCls: string = `icon icon--${iconName} icon`;

    it("should render the icon with light mode", () => {
        const clsName: string = `${iconBaseCls}--${NIcon.EMode.light}`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(inclStaticIcon(iconName, false)).toEqual(expIconElem);
    });

    it("should render the icon with dark mode", () => {
        const clsName: string = `${iconBaseCls}--${NIcon.EMode.dark}`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(inclStaticIcon(iconName, true)).toEqual(expIconElem);
    });

    it('should render the icon in plain mode', () => {
        const clsName: string = `${iconBaseCls}--plain`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(inclStaticIcon(iconName)).toEqual(expIconElem);
    });
});
