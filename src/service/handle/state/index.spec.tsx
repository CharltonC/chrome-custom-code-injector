import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { StateHandle } from './';
import { BaseStoreHandler } from './base-store-handler';

describe('State Handle', () => {
    let $elem: HTMLElement;

    beforeEach(() => {
        $elem = TestUtil.setupElem();
    });

    afterEach(() => {
        TestUtil.teardown($elem);
    });

    describe('Single Store and Store Handler', () => {
        const MockCmp = ({ root, rootHandler }) => <h1 onClick={rootHandler.onClick}>{root.name}</h1>;
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

        it('should render', () => {
            expect($h1.textContent).toBe('john');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane');
        });
    });

    describe('Multiple Stores and Store Handlers', () => {
        const MOCK_STORE_ONE = 'store1';
        const MOCK_STORE_TWO = 'store2';
        const MockCmp = ({ store1, store2, store1Handler, store2Handler }) => (
            <>
                <h1 onClick={store1Handler.onClick}>{store1.name}</h1>
                <h2 onClick={store2Handler.onClick}>{store2.name}</h2>
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