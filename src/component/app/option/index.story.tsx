import React from 'react';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import { createMockAppState } from '../../../mock/state';
import { OptionApp } from '.';

export default {
    title: 'App/Option',
    component: OptionApp,
};

const App = StateHandle.init(OptionApp, {
    root: [ createMockAppState(), new AppStateHandle() ],
});
export const Default = () => <App />;
