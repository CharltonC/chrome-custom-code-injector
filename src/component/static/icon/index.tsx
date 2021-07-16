import React, { ReactElement } from 'react';
import { ATheme, AIcon, IProps } from './type';

export function inclStaticIcon(iconName: AIcon, theme: ATheme = 'black', props: IProps = {}): ReactElement {
    const ROOT_CLS = `icon icon--${iconName}` + (theme !== 'black' ? ` icon--${theme}`: '');
    return <span className={ROOT_CLS} {...props}/>;
}
