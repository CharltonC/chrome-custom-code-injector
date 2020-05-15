import React from 'react';
import { IconBtn } from '.';

export default {
    title: 'Icon Button',
    component: IconBtn,
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

const darkMode: boolean = true;

export const Light = () => (
    <div style={{ backgroundColor: '#5AB3AD' }}>
        { icons.map((name: any) =>
            <IconBtn
                key={`light-${name}`}
                icon={{ name }}
                onClick={() => { console.log('click'); }}       // `onClick` being an "unknown" prop here
                />
        )}
    </div>
);

export const LightDisabled = () => (
    <div style={{ backgroundColor: '#5AB3AD' }}>
        { icons.map((name: any) =>
            <IconBtn
                key={`light-disabled-${name}`}
                icon={{ name }}
                disabled        // `disabled` being an "unknown" prop here
                />
        )}
    </div>
);

export const Dark = () => (
    <div>
        { icons.map((name: any) =>
            <IconBtn
                key={`dark-${name}`}
                icon={{ name, darkMode }} />
        )}
    </div>
);

export const DarkDisabled = () => (
    <div>
        { icons.map((name: any) =>
            <IconBtn
                key={`dark-disabled-${name}`}
                icon={{ name, darkMode }}
                disabled
                />
        )}
    </div>
);