import { HostRuleConfig, PathRuleConfig, LibRuleConfig } from '../model/rule-config';

const mockHostRuleConfigs: [string, string][] = [
    ['Ebay', 'www.ebay.com'],
    ['Amazon', 'www.amazon.com'],
    ['Gumtree', 'www.gumtree.com'],
    ['JingDong', 'www.jd.com']
]

const mockPathRuleConfigs: [string, string][] = [
    ['home', '/home'],
    ['deal', '/deals/today/'],
    ['panasonic', '/electronics/panasonic'],
]

const mockLibRuleConfigs: [string, string][] = [
    ['jQuery', 'jquery.com'],
    ['Angular', 'angular.io'],
    ['Bootstrap', 'bootstrap.com'],
]

export const createMockRules = () => {
    return mockHostRuleConfigs.map(rule => {
        const [ hostId, hostValue] = rule;
        const host = new HostRuleConfig(hostId, hostValue);

        mockPathRuleConfigs.forEach(([ pathId, pathValue]) => {
            const pathRuleConfig = new PathRuleConfig(`${hostId}${pathId}`, pathValue);
            host.paths.push(pathRuleConfig);

            mockLibRuleConfigs.forEach(([ libId, libValue ]) => {
                pathRuleConfig.libs.push(new LibRuleConfig(`${hostId}${pathId}${libId}`, libValue));
            });
        })

        mockLibRuleConfigs.forEach(([ libId, libValue ]) => {
            host.libs.push(new LibRuleConfig(`${hostId}${libId}`, libValue));
        });

        return host;
    });
};


// Mock with actual working data
const path = new PathRuleConfig('6park-path', '/au.shtml');
const pathLib = new LibRuleConfig('6park-path-lib', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
pathLib.type = 'css';
pathLib.isOn = true;
Object.assign(path, {
    jsCode: 'console.log("6park-path");',
    cssCode: '* { border: 1px solid blue !important; }',
    isCssOn: true,
    isJsOn: true,
    isLibOn: true,
    libs: [ pathLib ]
});

const host = new HostRuleConfig('6park-host', '6park.com');
const hostLib =  new LibRuleConfig('6park-host-lib', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
hostLib.isOn = true;
Object.assign(host, {
    jsCode: 'console.log("6park-host");',
    cssCode: 'body { background-color: red !important; }',
    isCssOn: true,
    isJsOn: true,
    isLibOn: true,
    paths: [ path ],
    libs: [hostLib]
});

export const mockRules = [host];