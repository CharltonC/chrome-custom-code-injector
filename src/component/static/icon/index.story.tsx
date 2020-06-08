import React from 'react';

import { TName } from './type';
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
    'doc'
];

export const PlainModeWithoutHoverState = () => (
    <ul>
        { icons.map((name: TName) => <li key={`plain-${name}`}>{inclStaticIcon(name)}</li>)}
    </ul>
);

export const LightMode = () => (
    <ul style={{ backgroundColor: '#5AB3AD' }}>
        {/* `id` is the html attr. not specified however still passed here */}
        { icons.map((name: TName) => <li key={`plain-${name}`}>{inclStaticIcon(name, false)}</li>)}
    </ul>
);

export const DarkMode = () => (
    <ul>
        { icons.map((name: TName) => <li key={`plain-${name}`}>{inclStaticIcon(name, true)}</li>)}
    </ul>
);
