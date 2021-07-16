import React from "react";
import { inclStaticIcon } from "./";
import { AIcon } from './type';

describe('Static Component - Icon', () => {
    const mockIconName: AIcon = 'setting';
    const ICON_BASE_CLS = `icon icon--${mockIconName}`;

    it("should render the icon in default black theme", () => {
        expect(inclStaticIcon(mockIconName)).toEqual(<span className={ICON_BASE_CLS} />);
    });

    it("should render the icon with white mode", () => {
        const clsName = `${ICON_BASE_CLS} icon--white`;
        expect(inclStaticIcon(mockIconName, 'white')).toEqual(<span className={clsName} />);
    });

    it('should render the icon in gray mode', () => {
        const clsName = `${ICON_BASE_CLS} icon--gray`;
        expect(inclStaticIcon(mockIconName, 'gray')).toEqual(<span className={clsName} />);
    });
});
