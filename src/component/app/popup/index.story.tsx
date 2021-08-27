import React from 'react';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import { createMockAppState } from '../../../mock/state';
import { PopupApp } from '.';

export default {
    title: 'App/Popup',
    component: PopupApp
};

const App = StateHandle.init(PopupApp, {
    root: [ createMockAppState(), new AppStateHandle() ],
});
export const Default = () => <App />;
