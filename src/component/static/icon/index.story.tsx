import React from 'react';
import { inclStaticIcon } from '.';
import { AIcon } from './type';

export default {
    title: 'Static/Icon',
    // component: inclStaticIcon('setting')
};

const icons: string[] = [
    'setting',
    'valid',
    'close',
    'power',
    'lock-close',
    'lock-open',
    'radio-on',
    'radio-off',
    'download',
    'add-outline',
    'add',
    'checkbox-off',
    'checkbox-on',
    'arrow-up',
    'arrow-dn',
    'search',
    'arrow-rt',
    'arrow-lt',
    'edit',
    'delete',
    'save',
    'doc',
    'option'
];

export const DefaultBlackTheme = () => (
    <ul>
        { icons.map((icon: AIcon) => <li key={`plain-${icon}`}>{inclStaticIcon(icon)}</li>)}
    </ul>
);

export const WhiteTheme = () => (
    <ul style={{ backgroundColor: '#5AB3AD' }}>
        {/* `id` is the html attr. not specified however still passed here */}
        { icons.map((icon: AIcon) => <li key={`plain-${icon}`}>{inclStaticIcon(icon, 'white')}</li>)}
    </ul>
);

export const GrayTheme = () => (
    <ul>
        { icons.map((icon: AIcon) => <li key={`plain-${icon}`}>{inclStaticIcon(icon, 'gray')}</li>)}
    </ul>
);
