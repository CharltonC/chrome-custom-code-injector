import React from 'react';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import { createMockAppState } from '../../../mock/state';
import { mockRules } from '../../../mock/data';
import { OptionApp } from '.';

export default {
    title: 'App/Option',
    component: OptionApp,
};

const App = StateHandle.init(OptionApp, {
    root: [ createMockAppState(), new AppStateHandle() ],
});
export const Default = () => <App />;

const baseState = createMockAppState();
const WorkingApp = StateHandle.init(OptionApp, {
    root: [ {
        ...baseState,
        rules: mockRules
    }, new AppStateHandle() ],
});
export const WithWorkingData = () => <WorkingApp />;