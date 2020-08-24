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