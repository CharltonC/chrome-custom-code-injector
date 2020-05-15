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

export const LightIcon = () => (
    <div style={{ backgroundColor: '#5AB3AD' }}>
        {icons.map((name: NIcon.TName) => staticIconElem(name))}
    </div>
);

export const DarkIcon = () => (
    <div>
        {icons.map((name: NIcon.TName) => staticIconElem(name, true))}
    </div>
);