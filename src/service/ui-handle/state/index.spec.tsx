import PubSub from 'pubsub-js';
import React, { ComponentClass } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { StoreHandler, StateHandle } from './';

describe('State Handle', () => {
    describe('Base Store Handler', () => {
        let mockPubSub: Partial<PubSub>;
        let storeHandler: StoreHandler;

        beforeEach(() => {
            mockPubSub = {
                subscribe: jest.fn(),
                unsubscribe: jest.fn(),
                publish: jest.fn(),
            };
            storeHandler = new StoreHandler();
            (storeHandler as any).PubSub = mockPubSub;
        });

        it('should return itself when property `reflect` is accessed', () => {
            expect(storeHandler.reflect).toBe(storeHandler);
        });

        it('should call subscribe', () => {
            const mockCallback = () => {};
            storeHandler.subscribe(mockCallback);
            expect(mockPubSub.subscribe).toHaveBeenCalledWith('CHANGE', mockCallback);
        });

        it('should call publish', () => {
            const mockStore = () => {};
            storeHandler.publish(mockStore);
            expect(mockPubSub.publish).toHaveBeenCalledWith('CHANGE', mockStore);
        });

        it('should call unsubscribe', () => {
            const MOCK_TOKEN = 'token';
            storeHandler.unsubscribe(MOCK_TOKEN);
            expect(mockPubSub.unsubscribe).toHaveBeenCalledWith(MOCK_TOKEN);
        });
    });

    describe('Proxy Get Handler', () => {
        const mockInitialState = { name: 'zoe' };
        const mockModState = { name: 'frank' };
        let handler: (...args: any[]) => any;
        let mockStateSetter: jest.Mock;
        let mockTarget;

        beforeEach(() => {
            mockStateSetter = jest.fn();
            handler = StateHandle.getProxyGetHandler(
                () => mockInitialState,
                mockStateSetter
            );
        });

        it('should return its default value when the property is not a method', () => {
            mockTarget = { lorem: 'sum' };
            expect(handler(mockTarget, 'lorem')).toBe('sum');
            expect(handler(mockTarget, 'xyz')).toBeFalsy();
        });

        it('should return a wrapped function when property is a method', () => {
            const mockMethod: jest.Mock = jest.fn();
            mockMethod.mockReturnValue(mockModState);
            mockTarget = { mockMethod };

            const mockTargetProxy = {};
            const mockParam = 'lorem';
            const fn = handler(mockTarget, 'mockMethod', mockTargetProxy);
            fn(mockParam);

            expect(typeof fn).toBe('function');
            expect(mockTarget.mockMethod).toHaveBeenCalledWith(mockInitialState, mockParam);
            expect(mockStateSetter).toHaveBeenCalledWith(mockModState);
        });
    });

    describe('Initialize Component with Store and Store Handle', () => {
        let mockOnClick: jest.Mock;
        let $child: HTMLHeadingElement;

        beforeEach(() => {
            const mockStore = { name: 'A' };

            mockOnClick = jest.fn();
            class MockStoreHandler extends StoreHandler {
                onClick = mockOnClick;
            }

            const MockCmp = ({ store, storeHandler }) => <h1 onClick={storeHandler.onClick}>{store.name}</h1>;

            const WrappedCmp: ComponentClass = StateHandle.init(MockCmp, mockStore, new MockStoreHandler());
            const $elem: HTMLElement = TestUtil.setupElem();
            TestUtil.renderPlain($elem, WrappedCmp);
            $child = $elem.querySelector('h1');
        });

        it('should render', () => {
            expect($child.textContent).toBe('A');
            TestUtil.triggerEvt($child, 'click');
            expect(mockOnClick).toHaveBeenCalled();
        });
    });
});