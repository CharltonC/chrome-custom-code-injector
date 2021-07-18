import React from 'react';
import { StateHandler } from '../../../handle/state/root';
import { StoreHandle } from '../../../handle/store';
import { createMockAppState } from '../../../mock/app-state';
import { OptionApp } from '.';

const App = StoreHandle.init(OptionApp, {
    root: [ createMockAppState(), new StateHandler() ],
});

export default {
    title: 'App/Option',
    component: OptionApp,
};

export const Default = () => <App />;