import React from 'react';

import * as NIcon from './type';
import { staticIconElem } from '.';


export default {
    title: 'Icon',
    component: staticIconElem('setting')
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
    <div>
        {icons.map((name: NIcon.TName) => staticIconElem(name))}
    </div>
);

export const LightMode = () => (
    <div style={{ backgroundColor: '#5AB3AD' }}>
        {/* `id` is the html attr. not specified however still passed here */}
        {icons.map((name: NIcon.TName) => staticIconElem(name, false, {key: `light-${name}`}))}
    </div>
);

export const DarkMode = () => (
    <div>
        {icons.map((name: NIcon.TName) => staticIconElem(name, true, {key: `dark-${name}`}))}
    </div>
);
