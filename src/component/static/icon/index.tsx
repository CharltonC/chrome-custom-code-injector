import React, { ReactElement } from 'react';
import { ATheme, AIcon, IProps } from './type';

export function inclStaticIcon(iconName: AIcon, theme: ATheme = 'black', props: IProps = {}): ReactElement {
    const clsName: string = `icon icon--${iconName}` + (theme !== 'black' ? ` icon--${theme}`: '');
    return <span className={clsName} {...props}/>;
}
