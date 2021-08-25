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
