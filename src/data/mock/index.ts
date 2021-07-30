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
