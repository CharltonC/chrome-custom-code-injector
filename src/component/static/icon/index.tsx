import React, { ReactElement } from 'react';

import { TTheme, TIcon, IProps } from './type';

export function inclStaticIcon(name: TIcon, darkTheme?: boolean, uknProps: IProps = {}): ReactElement {
    const isPlainMode: boolean = typeof darkTheme === 'undefined';
    const themeSuffix: TTheme = isPlainMode ? 'plain' : (darkTheme ? 'dark' : 'light');
    const clsName: string = `icon icon--${name} icon--${themeSuffix}`;
    return <span className={clsName} {...uknProps}/>;
}
