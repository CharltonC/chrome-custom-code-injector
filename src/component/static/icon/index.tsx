import React, { ReactElement } from 'react';

import { EMode, TName, IProps } from './type';

export function inclStaticIcon(name: TName, colorMode?: boolean, uknProps: IProps = {}): ReactElement {
    const { light, dark } = EMode;
    const isPlainMode: boolean = typeof colorMode === 'undefined';
    const mode: EMode = colorMode ? dark : light;
    const clsName: string = `icon icon--${name} icon--` + (isPlainMode ? 'plain' : mode);
    return <span className={clsName} {...uknProps}/>;
}
