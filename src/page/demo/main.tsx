import React from 'react';
import { render } from 'react-dom';
import { AppStateHandle } from '../../handle/app-state';
import { StateHandle } from '../../handle/state';
import { createMockAppState } from '../../mock/state';
import { OptionApp } from '../../component/app/option';

const App = StateHandle.init(OptionApp, {
    root: [
        createMockAppState(),
        new AppStateHandle()
    ],
});

render(<App />, document.querySelector('#demo'));
