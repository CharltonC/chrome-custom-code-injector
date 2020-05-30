import React, { ReactElement } from 'react';

import * as NIcon from './type';

export function inclStaticIcon(name: NIcon.TName, colorMode?: boolean, uknProps: NIcon.unknProps = {}): ReactElement {
    const { light, dark } = NIcon.EMode;
    const isPlainMode: boolean = typeof colorMode === 'undefined';
    const mode: NIcon.EMode = colorMode ? dark : light;
    const clsName: string = `icon icon--${name} icon--` + (isPlainMode ? 'plain' : mode);
    return <span className={clsName} {...uknProps}/>;
}
