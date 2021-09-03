import React from 'react';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import { createMockRules } from '../../../mock/data';
import { PopupApp } from '.';

export default {
    title: 'App/Popup',
    component: PopupApp
};

const rules = createMockRules();
const { value: hostUrl } = rules[0];
const url = new URL(`http://${hostUrl}`);

const App = StateHandle.init(PopupApp, {
    root: [ { rules, url }, new AppStateHandle() ],
});
export const Default = () => <App />;
