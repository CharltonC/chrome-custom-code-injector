import React from 'react';
import { render } from 'react-dom';
import { AppStateHandle } from '../../handle/app-state';
import { StateHandle } from '../../handle/state';
import { chromeHandle } from '../../handle/chrome';
import { LocalState } from '../../model/local-state';
import { SettingState } from '../../model/setting-state';
import { OptionApp } from '../../component/app/option';
import { dataHandle } from '../../handle/data';

(async () => {
    let { rules, setting } = await chromeHandle.getState();

    const appStateHandle = new AppStateHandle();
    const { onEditView } = appStateHandle;
    let appState = {
        localState: new LocalState(rules.length),
        setting: setting || new SettingState(),
        rules
    };

    // check any query param passed from Popup page to be directly in Edit View/mode
    const url = document.location.href;
    const params = new URL(url).searchParams.entries();
    if (params) {
        let hostId: string;
        let pathId: string;
        Array.from(params).forEach(([ key, value ]) => {
            hostId = key === 'hostId' ? value : hostId;
            pathId = key === 'pathId' ? value : pathId;
        });

        // Only pre-merge the staet if rule exists
        const ruleIdCtx = { hostId, pathId };
        const rule = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx);
        rule && Object.assign(
            appState,
            onEditView(appState, ruleIdCtx)
        );
    }

    // Init the app
    const App = StateHandle.init(OptionApp, {
        root: [ appState, appStateHandle ],
    });
    const $appWrapper = document.querySelector('#app');
    render(<App />, $appWrapper);
})();
