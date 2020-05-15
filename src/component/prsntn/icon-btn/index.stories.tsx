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
const uknBtnProps = { onClick: () => { console.log('clicked'); } };
const darkMode: boolean = true;

export const LightIcon = () => (
  <div style={{backgroundColor:'#5AB3AD'}}>
    { icons.map((name) => <IconBtn icon={{name}} {...uknBtnProps} />) }
  </div>
);

export const DarkIcon = () => (
  <div>
    { icons.map((name) => <IconBtn icon={{name, darkMode}} />) }
  </div>
);