import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { BaseStoreHandler } from './base-store-handler';
import { StateHandle } from '.';

describe('State Handle', () => {
    let $elem: HTMLElement;

    beforeEach(() => {
        $elem = TestUtil.setupElem();
    });

    afterEach(() => {
        TestUtil.teardown($elem);
    });

    describe('Single Store and Store Handler', () => {
        const MockCmp = ({ store, storeHandler }) => <h1 onClick={storeHandler.onClick}>{store.name}</h1>;
        const mockStore = { name: 'john' };
        class MockStoreHandler extends BaseStoreHandler {
            onClick(store) {
                return { name: 'jane' }
            }
        }
        let $h1: HTMLHeadingElement;

        beforeEach(() => {
            const WrappedMockCmp = StateHandle.init(MockCmp, {
                root: [ mockStore, new MockStoreHandler() ]
            });
            TestUtil.renderPlain($elem, WrappedMockCmp);
            $h1 = $elem.querySelector('h1');
        });

        it('should render and update', () => {
            expect($h1.textContent).toBe('john');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane');
        });
    });

    describe('Single Store and Store Handler with multiple partial handlers', () => {
        const MockCmp = ({ store, storeHandler }) => (
            <>
                <h1 onClick={storeHandler.onH1Click}>{store.name}</h1>
                <h2 onClick={storeHandler.onH2Click}>{store.name}</h2>
            </>
        );

        const mockStore = { name: 'john' };

        class MockPartialeHandlerA extends BaseStoreHandler {
            onH1Click(store) {
                return { name: 'jane' }
            }
        }
        class MockPartialHandlerB extends BaseStoreHandler {
            onH2Click(store) {
                return { name: 'amy' }
            }
        }
        const MockStoreHandler = BaseStoreHandler.join([MockPartialeHandlerA, MockPartialHandlerB]);

        let $h1: HTMLHeadingElement;
        let $h2: HTMLHeadingElement;

        beforeEach(() => {
            const WrappedMockCmp = StateHandle.init(MockCmp, {
                root: [ mockStore, new MockStoreHandler() ]
            });
            TestUtil.renderPlain($elem, WrappedMockCmp);
            $h1 = $elem.querySelector('h1');
            $h2 = $elem.querySelector('h2');
        });

        it('should render and update', () => {
            expect($h1.textContent).toBe('john');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane');
            TestUtil.triggerEvt($h2, 'click');
            expect($h2.textContent).toBe('amy');
        });
    });

    describe('Multiple Stores and Store Handlers', () => {
        const MOCK_STORE_ONE = 'store1';
        const MOCK_STORE_TWO = 'store2';
        const MockCmp = ({ store, storeHandler }) => (
            <>
                <h1 onClick={storeHandler[MOCK_STORE_ONE].onClick}>{store[MOCK_STORE_ONE].name}</h1>
                <h2 onClick={storeHandler[MOCK_STORE_TWO].onClick}>{store[MOCK_STORE_TWO].name}</h2>
            </>
        );
        const mockStore1 = { name: 'john1' };
        const mockStore2 = { name: 'john2' };
        class MockStoreHandler1 extends BaseStoreHandler {
            onClick(store) {
                return { name: 'jane1' }
            }
        }
        class MockStoreHandler2 extends BaseStoreHandler {
            onClick(store) {
                return { name: 'jane2' }
            }
        }
        let $h1: HTMLHeadingElement;
        let $h2: HTMLHeadingElement;

        beforeEach(() => {
            const WrappedMockCmp = StateHandle.init(MockCmp, {
                [MOCK_STORE_ONE]: [ mockStore1, new MockStoreHandler1() ],
                [MOCK_STORE_TWO]: [ mockStore2, new MockStoreHandler2() ]
            });
            TestUtil.renderPlain($elem, WrappedMockCmp);
            $h1 = $elem.querySelector('h1');
            $h2 = $elem.querySelector('h2');
        });

        it('should render and update', () => {
            expect($h1.textContent).toBe('john1');
            expect($h2.textContent).toBe('john2');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane1');
            expect($h2.textContent).toBe('john2');

            TestUtil.triggerEvt($h2, 'click');
            expect($h1.textContent).toBe('jane1');
            expect($h2.textContent).toBe('jane2');
        });
    });
});