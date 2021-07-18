import React, { ComponentClass } from 'react';
import { BaseStateHandler } from './base-handler';
import { BaseStateComponent } from './base-component';
import { IStateConfigs } from './type';

/**
 * Usage:
 * - refer to "index.story.tsx" file
 *
 * Adv:
 * - no more `handler.bind(this)`
 * - no more merging `...store` in every return state
 * - only 1 call needed: `StateHandle.init(..)`
 * - `.reflect` to consolidate multipe and/or dependent state changes
 */
export const StateHandle = {
    BaseStateHandler,

    init(Cmp: ACmp, stateConfigs: IStateConfigs): ComponentClass {
        return class extends BaseStateComponent {
            storeHandler: AObj;

            constructor(props: AObj) {
                super(props);
                const { store, storeHandler } = this.transformStateConfigs(stateConfigs);
                this.state = store;
                this.storeHandler = storeHandler;
            }

            render() {
                return <Cmp store={this.state} storeHandler={this.storeHandler} />;
            }
        }
    }
}