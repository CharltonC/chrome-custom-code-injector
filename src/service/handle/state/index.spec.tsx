import PubSub from 'pubsub-js';
import React, { ComponentClass } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { BaseStoreHandler, StateHandle } from '.';

describe('Base Store Handler', () => {
    let mockPubSub: Partial<PubSub>;
    let baseStoreHandler: BaseStoreHandler;

    beforeEach(() => {
        mockPubSub = {
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publish: jest.fn(),
        };
        baseStoreHandler = new BaseStoreHandler();
        (baseStoreHandler as any).PubSub = mockPubSub;
    });

    it('getter - `reflect`: should return itself when property `reflect` is accessed', () => {
        expect(baseStoreHandler.reflect).toBe(baseStoreHandler);
    });

    it('method - `subscribe`: should call subscribe', () => {
        const mockCallback = () => {};
        baseStoreHandler.subscribe(mockCallback);
        expect(mockPubSub.subscribe).toHaveBeenCalledWith('CHANGE', mockCallback);
    });

    it('method - `publish`: should call publish', () => {
        const mockCurState = { name: 'john' };
        const mockModState = { name: 'jane' };
        baseStoreHandler.publish(mockCurState, mockModState);

        expect(mockPubSub.publish).toHaveBeenCalledWith('CHANGE', {
            curState: mockCurState,
            modState: mockModState
        });
    });

    it('method - `unsubscribe`: should call unsubscribe', () => {
        const MOCK_TOKEN = 'token';
        baseStoreHandler.unsubscribe(MOCK_TOKEN);
        expect(mockPubSub.unsubscribe).toHaveBeenCalledWith(MOCK_TOKEN);
    });
});

describe('State Handle', () => {
    describe('Method - `getProxyGetHandler`: Proxy Get Handler', () => {
        const mockInitialState = { name: 'zoe' };
        const mockAllowedKeys = ['mockAllowMethod'];
        let handler: (...args: any[]) => any;
        let mockStateSetter: jest.Mock;
        let mockTarget;

        beforeEach(() => {
            mockStateSetter = jest.fn();
            handler = StateHandle.getProxyGetHandler(
                () => mockInitialState,
                mockStateSetter,
                mockAllowedKeys
            );
        });

        it('should return its default value when the property is not direct prototype methods of the handler', () => {
            mockTarget = { lorem: 'sum' };

            expect(handler(mockTarget, 'lorem')).toBe('sum');
            expect(handler(mockTarget, 'xyz')).toBeFalsy();
        });

        it('should return a wrapped function when property is a method', () => {
            const mockModState = { name: 'frank' };
            const mockAllowMethod: jest.Mock = jest.fn();
            mockAllowMethod.mockReturnValue(mockModState);
            mockTarget = { mockAllowMethod };

            const mockTargetProxy = {};
            const mockParam = 'lorem';
            const fn = handler(mockTarget, 'mockAllowMethod', mockTargetProxy);
            fn(mockParam);

            expect(typeof fn).toBe('function');
            expect(mockAllowMethod).toHaveBeenCalledWith(mockInitialState, mockParam);
            expect(mockStateSetter).toHaveBeenCalledWith(mockInitialState, mockModState);
        });
    });

    describe('Method - `init`: Initialize Component with Store and Store Handle', () => {
        let WrappedCmp: ComponentClass;
        let getProxyGetHandlerSpy: jest.SpyInstance;
        let onClickSpy: jest.SpyInstance;
        let $elem: HTMLElement;
        const mockStore = { name: 'A' };
        const MockCmp = ({ store, baseStoreHandler }) => <h1 onClick={baseStoreHandler.onClick}>{store.name}</h1>;
        class MockStoreHandler extends BaseStoreHandler {
            onClick() {}
        }

        beforeEach(() => {
            getProxyGetHandlerSpy = jest.spyOn(StateHandle, 'getProxyGetHandler');
            onClickSpy = jest.spyOn(MockStoreHandler.prototype, 'onClick');
            WrappedCmp = StateHandle.init(MockCmp, mockStore, new MockStoreHandler());
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
            TestUtil.teardown($elem);
        });

        it('should pass props to `getProxyGetHandler`', () => {
            const cmp = new WrappedCmp({});
            const [ stateGetter, stateSetter ] = getProxyGetHandlerSpy.mock.calls[0];
            const setStateSpy = jest.spyOn(cmp, 'setState').mockImplementation(() => {});
            const mockCurrStore = { name: 'B' };
            stateSetter(mockStore, mockCurrStore);

            expect(stateGetter()).toBe(mockStore);
            expect(setStateSpy).toHaveBeenCalled();
            expect(setStateSpy.mock.calls[0][0]).toBe(mockCurrStore);
        });

        it('should render and update state', () => {
            TestUtil.renderPlain($elem, WrappedCmp);
            const $root: HTMLHeadingElement = $elem.querySelector('h1');

            expect($root.textContent).toBe('A');
            TestUtil.triggerEvt($root, 'click');
            expect(onClickSpy).toHaveBeenCalled();
        });
    });
});