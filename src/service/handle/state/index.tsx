import React, { ComponentClass } from 'react';
import { IStoreConfigs, TObj, TCmp } from './type';
import { BaseStoreHandler } from './base-store-handler';
import { BaseStoreComponent } from './base-store-component';

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
    BaseStoreHandler,

    init(Cmp: TCmp, storeConfigs: IStoreConfigs): ComponentClass {
        return class extends BaseStoreComponent {
            storeHandler: TObj;

            constructor(props: TObj) {
                super(props);
                const { store, storeHandler } = this.transformStoreConfigs(storeConfigs);
                this.state = store;
                this.storeHandler = storeHandler;
            }

            render() {
                return <Cmp store={this.state} storeHandler={this.storeHandler} />;
            }
        }
    }
}