import React from 'react';
import { AppStateManager } from '../../../state/manager';
import { StateHandle } from '../../../handle/state';
import { createMockAppState } from '../../../state/mock';
import { OptionApp } from '.';

const App = StateHandle.init(OptionApp, {
    root: [ createMockAppState(), new AppStateManager() ],
});

export default {
    title: 'App/Option',
    component: OptionApp,
};

export const Default = () => <App />;