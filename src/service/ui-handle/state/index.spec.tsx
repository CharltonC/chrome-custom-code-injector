import React, { ComponentClass } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { StoreHandler, StateHandle } from './';

describe('State Handle', () => {
    describe('Base Store Handler', () => {
        it('should return itself when property `reflect` is accessed', () => {
            const storeHandler = new StoreHandler();
            expect(storeHandler.reflect).toBe(storeHandler);
        });
    });

    describe('Proxy Get Handler', () => {
        const mockInitialState = { name: 'zoe' };
        const mockModState = { name: 'frank' };
        let mockTarget;
        let mockCmpCtx: any;
        let handler: (...args: any[]) => any;
        let mockRtnModeState: jest.Mock;

        beforeEach(() => {
            mockRtnModeState = jest.fn();
            mockRtnModeState.mockReturnValue(mockModState);
            mockTarget = {
                lorem: 'sum',
                onEvt: mockRtnModeState
            };
            mockCmpCtx = {
                state: mockInitialState,
                setState: jest.fn()
            };
            handler = StateHandle.getProxyGetHandler(mockCmpCtx);
        });

        it('should return its default value when the property is not a method', () => {
            expect(handler(mockTarget, 'lorem')).toBe('sum');
        });

        it('should return a wrapped function when property is a method', () => {
            const mockTargetProxy = {};
            const mockParam = 'lorem';
            const fn = handler(mockTarget, 'onEvt', mockTargetProxy);
            fn(mockParam);

            expect(typeof fn).toBe('function');
            expect(mockTarget.onEvt).toHaveBeenCalledWith(mockInitialState, mockParam);
            expect(mockCmpCtx.setState).toHaveBeenCalledWith({...mockCmpCtx.state, ...mockModState});
        });
    });

    describe('Initialize Component with Store and Store Handle', () => {
        let mockOnClick: jest.Mock;
        let $child: HTMLHeadingElement;

        beforeEach(() => {
            mockOnClick = jest.fn();

            class MockStore {
                name = 'A';
            }

            class MockStoreHandler extends StoreHandler {
                onClick = mockOnClick;
            }

            const MockCmp = ({ store, storeHandler}) => <h1 onClick={storeHandler.onClick}>{store.name}</h1>;

            const WrappedCmp: ComponentClass = StateHandle.init(MockCmp, MockStore, MockStoreHandler);
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