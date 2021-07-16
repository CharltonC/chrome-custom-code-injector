import React, { ComponentClass } from 'react';
import { BaseStoreHandler } from './base-store-handler';
import { BaseStoreComponent } from './base-store-component';
import { IStoreConfigs } from './type';

/**
 * Usage:
 * - refer to "index.story.tsx" file
 *
 * Adv:
 * - no more `handler.bind(this)`
 * - no more merging `...store` in every return state
 * - only 1 call needed: `StoreHandle.init(..)`
 * - `.reflect` to consolidate multipe and/or dependent state changes
 */
export const StoreHandle = {
    BaseStoreHandler,

    init(Cmp: ACmp, storeConfigs: IStoreConfigs): ComponentClass {
        return class extends BaseStoreComponent {
            storeHandler: AObj;

            constructor(props: AObj) {
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