import React, { ComponentClass } from 'react';
import { BaseStateManager } from './base-state-manager';
import { BaseStateComponent } from './base-component';
import { IStateConfigs } from './type';

/**
 * Usage:
 * - refer to "index.story.tsx" file
 *
 * Adv:
 * - no more `handler.bind(this)`
 * - no more merging `...state` in every return state
 * - only 1 call needed: `StateHandle.init(..)`
 * - `.reflect` to consolidate multipe and/or dependent state changes
 */
export const StateHandle = {
    BaseStateManager,

    init(Cmp: ACmp, stateConfigs: IStateConfigs): ComponentClass {
        return class extends BaseStateComponent {
            appStateHandle: AObj;

            constructor(props: AObj) {
                super(props);
                const { appState, appStateHandle } = this.transformStateConfigs(stateConfigs);
                this.state = appState;
                this.appStateHandle = appStateHandle;
            }

            render() {
                return <Cmp
                    appState={this.state}
                    appStateHandle={this.appStateHandle}
                    />;
            }
        }
    }
}