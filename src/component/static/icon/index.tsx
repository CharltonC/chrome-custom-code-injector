import React, { ReactElement } from 'react';

import * as NIcon from './type';

export function staticIconElem(name: NIcon.TName, darkMode: boolean = false, ...args: any[]): ReactElement {
    const { light, dark } = NIcon.EMode;
    const mode: NIcon.EMode = darkMode ? dark : light;
    const clsName: string = `icon icon--${name} icon--${mode}`;
    return <span className={clsName} {...args}/>;
}
