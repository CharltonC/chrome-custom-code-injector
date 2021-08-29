import { chromeHandle } from '../../handle/chrome';
import { dataHandle } from '../../handle/data';

chrome.webRequest.onHeadersReceived.addListener(
    evt => {
        const { responseHeaders, url } = evt;

        // check if main document, not iframe or other type of requests
        const isMainDoc = chromeHandle.isMainframeRequest(evt);
        if (!isMainDoc) return;

        // check if match url in rules
        // - webrequest callback doesn't support async, hence `then` is used
        const pageUrl = new URL(url);
        chromeHandle.getState().then(({ rules }) => {
            const host = rules?.length && dataHandle.getHostFromUrl(rules, pageUrl);
            if (!host) return;

            // Alter specific CSP policies if needed
            const csp = chromeHandle.getCsp(responseHeaders);
            if (!csp) return;
            csp.value = chromeHandle.getAlteredCsp(csp.value, [
                'script-src',
                'style-src',
                'style-src-elem'
            ]);
        });
    },
    {
        urls: ['<all_urls>']
    },
    [
        'blocking',
        'responseHeaders'
    ]
);
