import { HostRule, PathRule, LibRule } from './';

export const getDefRules = () => {
    const path = new PathRule('news', '/news');
    const pathLib = new LibRule('ycomb-path-lib', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
    pathLib.type = 'css';
    pathLib.isOn = true;
    Object.assign(path, {
        jsCode: 'console.log("ycomb-path");',
        cssCode: '* { border: 1px solid blue !important; }',
        isCssOn: true,
        isJsOn: true,
        isLibOn: true,
        libs: [ pathLib ]
    });

    const host = new HostRule('y-comb', 'news.ycombinator.com');
    const hostLib =  new LibRule('ycomb-host-lib', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
    hostLib.isOn = true;
    Object.assign(host, {
        jsCode: 'console.log("ycomb-host");',
        cssCode: 'body { background-color: red !important; }',
        isCssOn: true,
        isJsOn: true,
        isLibOn: true,
        paths: [ path ],
        libs: [hostLib]
    });

    return [host];
};
