import React from 'react';
import { StateHandler } from '../../../service/state-handler';
import { StateHandle } from '../../../service/handle/state';
import { HostRuleConfig, PathRuleConfig, LibRuleConfig } from '../../../service/model/rule-config';
import { AppState } from '../../../service/model/app-state';
import { OptionApp } from '.';

const mockHostRuleConfigs: [string, string][] = [
    ['Amazon', 'www.amazon.com'],
    ['Ebay', 'www.ebay.com'],
    ['Gumtree', 'www.gumtree.com'],
]

const mockPathRuleConfigs: [string, string][] = [
    ['home', 'home'],
    ['deal', 'deals/today/'],
    ['panasonic', 'electronics/panasonic'],
]

const mockLibRuleConfigs: [string, string][] = [
    ['jQuery', 'jquery.com'],
    ['Angular', 'angular.io'],
    ['Bootstrap', 'bootstrap.com'],
]

const createMockAppState = (): AppState =>  {
    const { rules, setting, localState } = new AppState();

    mockHostRuleConfigs.forEach(([ hostId, hostValue]) => {
        const hostRuleConfig = new HostRuleConfig(hostId, hostValue);

        mockPathRuleConfigs.forEach(([ pathId, pathValue]) => {
            const pathRuleConfig = new PathRuleConfig(`${hostId}-${pathId}`, pathValue);
            hostRuleConfig.paths.push(pathRuleConfig);

            mockLibRuleConfigs.forEach(([ libId, libValue ]) => {
                pathRuleConfig.libs.push(new LibRuleConfig(`${hostId}-${pathId}-${libId}`, libValue));
            });
        })

        mockLibRuleConfigs.forEach(([ libId, libValue ]) => {
            hostRuleConfig.libs.push(new LibRuleConfig(`${hostId}-${libId}`, libValue));
        });

        rules.push(hostRuleConfig);
    });

    return { localState, setting, rules };
}

const App = StateHandle.init(OptionApp, {
    root: [ createMockAppState(), new StateHandler() ],
});

export default {
    title: 'App - Option',
    component: OptionApp,
};

export const Default = () => <App />;