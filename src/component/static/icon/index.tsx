import React, { ReactElement } from 'react';
import { TTheme, TIcon, IProps } from './type';

export function inclStaticIcon(iconName: TIcon, theme: TTheme = 'black', props: IProps = {}): ReactElement {
    const clsName: string = `icon icon--${iconName}` + (theme !== 'black' ? ` icon--${theme}`: '');
    return <span className={clsName} {...props}/>;
}
