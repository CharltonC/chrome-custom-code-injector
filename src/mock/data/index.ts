import { HostRule, PathRule, LibRule } from '../../model/rule';

const mockHostRules: [string, string][] = [
    ['Ebay', 'www.ebay.com'],
    ['Amazon', 'www.amazon.com'],
    ['Gumtree', 'www.gumtree.com'],
    ['JingDong', 'www.jd.com']
]

const mockPathRules: [string, string][] = [
    ['home', '/home'],
    ['deal', '/deals/today/'],
    ['panasonic', '/electronics/panasonic'],
]

const mockLibRules: [string, string][] = [
    ['jQuery', 'jquery.com'],
    ['Angular', 'angular.io'],
    ['Bootstrap', 'bootstrap.com'],
]

export const createMockRules = () => {
    return mockHostRules.map(rule => {
        const [ hostId, hostValue] = rule;
        const host = new HostRule(hostId, hostValue);

        mockPathRules.forEach(([ pathId, pathValue]) => {
            const path = new PathRule(`${hostId}${pathId}`, pathValue);
            host.paths.push(path);

            mockLibRules.forEach(([ libId, libValue ]) => {
                path.libs.push(new LibRule(`${hostId}${pathId}${libId}`, libValue));
            });
        })

        mockLibRules.forEach(([ libId, libValue ]) => {
            host.libs.push(new LibRule(`${hostId}${libId}`, libValue));
        });

        return host;
    });
};


// Mock with actual working data
const path = new PathRule('6park-path', '/au.shtml');
const pathLib = new LibRule('6park-path-lib', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
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

const host = new HostRule('6park-host', '6park.com');
const hostLib =  new LibRule('6park-host-lib', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
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