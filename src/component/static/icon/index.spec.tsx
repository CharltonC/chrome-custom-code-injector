import React, { ReactElement } from 'react';

import { staticIconElem } from './';
import * as NIcon from './type';

describe('icon (static react element)', () => {
    it('should render the icon with default light mode', () => {
        const iconName: NIcon.TName = 'setting';
        const clsName: string = `icon icon--${iconName} icon--${NIcon.EMode.light}`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(staticIconElem(iconName)).toEqual(expIconElem);
    });

    it('should render the icon with dark mode', () => {
        const iconName: NIcon.TName = 'setting';
        const clsName: string = `icon icon--${iconName} icon--${NIcon.EMode.dark}`;
        const expIconElem: ReactElement = <span className={clsName} />

        expect(staticIconElem(iconName, true)).toEqual(expIconElem);
    });
});
