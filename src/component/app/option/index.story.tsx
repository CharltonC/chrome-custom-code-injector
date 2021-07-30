import React from 'react';
import { AppStateHandler } from '../../../state/handler';
import { StateHandle } from '../../../handle/state';
import { createMockAppState } from '../../../mock/app-state';
import { OptionApp } from '.';

const App = StateHandle.init(OptionApp, {
    root: [ createMockAppState(), new AppStateHandler() ],
});

export default {
    title: 'App/Option',
    component: OptionApp,
};

export const Default = () => <App />;