import React, { ComponentClass } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { StateHandle } from './';
import { TStore, TStoreHandle } from './type';

describe('State Handle', () => {
    describe('Proxy Get Handler', () => {
        const mockInitialState = { name: 'zoe' };
        const mockModState = { name: 'frank' };
        let mockTarget: TStoreHandle;
        let mockCmpCtx: any;
        let handler: (...args: any[]) => any;
        let mockRtnModeState: jest.Mock;

        beforeEach(() => {
            mockRtnModeState = jest.fn();
            mockRtnModeState.mockReturnValue(mockModState);
            mockTarget = {
                onEvt: mockRtnModeState
            };
            mockCmpCtx = {
                state: mockInitialState,
                setState: jest.fn()
            };
            handler = StateHandle.getProxyGetHandler(mockCmpCtx, mockTarget);
        });

        it('should return the original target when the property is `reflect`', () => {
            expect(handler(mockTarget, 'reflect')).toBe(mockTarget);
        });

        it('should throw error when the property is not `reflect`, or doesnt exist, or not a method', () => {
            expect(() => handler(mockTarget, 'lorem')).toThrowError();
        });

        it('should return a wrapped function when property is a method that exists', () => {
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
        const mockStore: TStore = { name: 'A' };
        const MockCmp = ({ store, storeHandle}) => <h1 onClick={storeHandle.onClick}>{store.name}</h1>;
        let mockOnClick: jest.Mock;
        let $child: HTMLHeadingElement;

        beforeEach(() => {
            mockOnClick = jest.fn();
            const mockStoreHandle: TStoreHandle = { onClick: mockOnClick };
            const WrappedCmp: ComponentClass = StateHandle.init(MockCmp, mockStore, mockStoreHandle);
            const $elem: HTMLElement = TestUtil.setupElem();
            TestUtil.renderPlain($elem, WrappedCmp);
            $child = $elem.querySelector('h1');
        });

        it('should render', () => {
            expect($child.textContent).toBe(mockStore.name);
            TestUtil.triggerEvt($child, 'click');
            expect(mockOnClick).toHaveBeenCalled();
        });
    });
});