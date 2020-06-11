import React, { ReactElement } from "react";

import { TIcon } from './type';
import { inclStaticIcon } from "./";

describe('Static Component - Icon', () => {
    const iconName: TIcon = 'setting';
    const iconBaseCls: string = `icon icon--${iconName} icon`;

    it("should render the icon with light mode", () => {
        const clsName: string = `${iconBaseCls}--light`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(inclStaticIcon(iconName, false)).toEqual(expIconElem);
    });

    it("should render the icon with dark mode", () => {
        const clsName: string = `${iconBaseCls}--dark`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(inclStaticIcon(iconName, true)).toEqual(expIconElem);
    });

    it('should render the icon in plain mode', () => {
        const clsName: string = `${iconBaseCls}--plain`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(inclStaticIcon(iconName)).toEqual(expIconElem);
    });
});
