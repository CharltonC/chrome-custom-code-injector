import React from 'react';
import { AppStateHandler } from '../../../handle/app-state';
import { StoreHandle } from '../../../handle/store';
import { createMockAppState } from '../../../mock/app-state';
import { OptionApp } from '.';

const App = StoreHandle.init(OptionApp, {
    root: [ createMockAppState(), new AppStateHandler() ],
});

export default {
    title: 'App/Option',
    component: OptionApp,
};

export const Default = () => <App />;