import React from 'react';
import { render } from 'react-dom';
import { AppStateHandle } from '../../handle/app-state';
import { StateHandle } from '../../handle/state';
import { chromeHandle } from '../../handle/chrome';
import { LocalState } from '../../model/local-state';
import { SettingState } from '../../model/setting-state';
import { OptionApp } from '../../component/app/option';

(async () => {
    let { rules, setting } = await chromeHandle.getState();

    const appState = {
        localState: new LocalState(rules.length),
        setting: setting || new SettingState(),
        rules
    };
    const appStateHandle = new AppStateHandle();
    const App = StateHandle.init(OptionApp, {
        root: [ appState, appStateHandle ],
    });

    const $appWrapper = document.querySelector('#app');
    render(<App />, $appWrapper);
})();
