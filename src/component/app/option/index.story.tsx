import React from 'react';
import { StateHandler } from '../../../service/state-handler/root';
import { StoreHandle } from '../../../service/store-handle';
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