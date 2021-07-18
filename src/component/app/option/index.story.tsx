import React from 'react';
import { AppStateHandler } from '../../../app-state/handler';
import { StateHandle } from '../../../handle/state';
import { createMockAppState } from '../../../app-state/mock';
import { OptionApp } from '.';

const App = StateHandle.init(OptionApp, {
    root: [ createMockAppState(), new AppStateHandler() ],
});

export default {
    title: 'App/Option',
    component: OptionApp,
};

export const Default = () => <App />;