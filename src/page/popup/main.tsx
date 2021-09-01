import React from 'react';
import { render } from 'react-dom';
import { AppStateHandle } from '../../handle/app-state';
import { StateHandle } from '../../handle/state';
import { chromeHandle } from '../../handle/chrome';
import { PopupApp } from '../../component/app/popup';

(async () => {
    const url = await chromeHandle.getTabUrl();

    let { rules } = await chromeHandle.getState();
    const appState = { rules, url };
    const appStateHandle = new AppStateHandle();
    const App = StateHandle.init(PopupApp, {
        root: [ appState, appStateHandle ],
    });

    const $appWrapper = document.querySelector('#app');
    render(<App />, $appWrapper);
})();
