import React from 'react';
import { render } from 'react-dom';
import { AppStateHandle } from '../../handle/app-state';
import { StateHandle } from '../../handle/state';
import { chromeHandle } from '../../handle/chrome';
import { UrlToAppStateHandle } from '../../handle/app-state/url-to-app-state';
import { LocalState } from '../../model/local-state';
import { SettingState } from '../../model/setting-state';
import { OptionApp } from '../../component/app/option';

(async () => {
    let { rules, setting } = await chromeHandle.getState();

    const urlToAppStateHandle = new UrlToAppStateHandle();
    const appStateHandle = new AppStateHandle();
    let appState = {
        localState: new LocalState(rules.length),
        setting: setting || new SettingState(),
        rules
    };

    // Merge the prefilled state (if any, based on the url query params) with default/initial state
    const { href, protocol, host, pathname } = document.location;
    const prefilledState = urlToAppStateHandle.getState(appState, href);
    Object.assign(appState, prefilledState);

    // clear the query param after state is merged w/o reloading the page
    // - ref: https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page
    const baseUrl = protocol + "//" + host + pathname;
    window.history.pushState(
        { path: baseUrl },
        '',                     // no need to change the doc title
        baseUrl
    );

    // Init the app
    const App = StateHandle.init(OptionApp, {
        root: [ appState, appStateHandle ],
    });
    const $appWrapper = document.querySelector('#app');
    render(<App />, $appWrapper);
})();
