import React from 'react';

import { TIcon } from './type';
import { inclStaticIcon } from '.';


export default {
    title: 'Static Icon',
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

export const PlainModeWithoutHoverState = () => (
    <ul>
        { icons.map((icon: TIcon) => <li key={`plain-${icon}`}>{inclStaticIcon(icon)}</li>)}
    </ul>
);

export const LightMode = () => (
    <ul style={{ backgroundColor: '#5AB3AD' }}>
        {/* `id` is the html attr. not specified however still passed here */}
        { icons.map((icon: TIcon) => <li key={`plain-${icon}`}>{inclStaticIcon(icon, false)}</li>)}
    </ul>
);

export const DarkMode = () => (
    <ul>
        { icons.map((icon: TIcon) => <li key={`plain-${icon}`}>{inclStaticIcon(icon, true)}</li>)}
    </ul>
);
