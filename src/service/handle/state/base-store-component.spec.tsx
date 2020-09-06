import React, { ComponentClass } from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { BaseStoreComponent } from './base-store-component';

import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { compilation } from 'webpack';
import { CoverageSummary } from 'istanbul-lib-coverage';

describe('Base Store Component', () => {
    let cmp: BaseStoreComponent;
    let spy: TMethodSpy<BaseStoreComponent>;

    beforeEach(() => {
        cmp = new BaseStoreComponent({});
        spy = TestUtil.spyMethods(cmp);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - transformStoreConfigs: Transform Stores and Store Handlers with Proxy', () => {
        const getProxyStoreHandler = {};

        beforeEach(() => {
            spy.getProxyStoreHandler.mockReturnValue(getProxyStoreHandler);
        });

        it('should return transformed config if root store and store handler are provided', () => {
            const mockStore = { name: 'john' };
            const mockStoreHandler = { sayHello() { return 'hello'; } };
            const { store, storeHandler } = cmp.transformStoreConfigs({
                root: [ mockStore, mockStoreHandler ]
            });

            expect(store).toBe(mockStore);
            expect(storeHandler).toBe(getProxyStoreHandler);
        });

        it('should return transformed config if multiple non-root stores and store handlers are provied', () => {
            const mockStore1 = { name: 'john' };
            const mockStoreHandler1 = { sayHello1() { return 'hello1'; } };
            const mockStore2 = { name: 'jane' };
            const mockStoreHandler2 = { sayHello2() { return 'hello2'; } };

            const { store, storeHandler } = cmp.transformStoreConfigs({
                store1: [ mockStore1, mockStoreHandler1 ],
                store2: [ mockStore2, mockStoreHandler2 ]
            });

            expect(store.store1).toBe(mockStore1);
            expect(store.store2).toBe(mockStore2);
            expect(storeHandler.store1).toBe(getProxyStoreHandler);
            expect(storeHandler.store2).toBe(getProxyStoreHandler);
        });
    });

    describe('Method - getProxyHandler: Get proxy `get` handler function for a store handler', () => {
        const MOCK_METHOD_NAME = 'sayHello';
        const mockAllowedMethodNames = [ MOCK_METHOD_NAME ];
        const mockHandler = { age: 10, [MOCK_METHOD_NAME]() {} };

        const MOCK_STORE_NAME = 'store_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };

        let fnCallSpy: jest.SpyInstance;
        let proxyHandler;

        beforeEach(() => {
            spy.getProtoMethodNames.mockReturnValue(mockAllowedMethodNames);
            spy.updateState.mockImplementation(() => {});
            fnCallSpy = jest.spyOn(mockHandler[MOCK_METHOD_NAME] as Function, 'call');
            fnCallSpy.mockReturnValue(mockModPartialState);

            cmp.state = mockState;
            proxyHandler = cmp.getProxyStoreHandler(mockHandler, MOCK_STORE_NAME);
        });

        it('should return the value if the key is not allowed or is not a function', () => {
            expect(proxyHandler.lorem).toBeFalsy();
            expect(proxyHandler.age).toBe(10)
        });

        it('should return a wrapped function if the key is allowed and is a method', () => {
            const method = proxyHandler[MOCK_METHOD_NAME];
            const mockArgs = [1,2];
            method(mockArgs);

            expect(typeof method).toBe('function');
            expect(fnCallSpy).toHaveBeenCalledWith(proxyHandler, mockState, mockArgs);
            expect(spy.updateState).toHaveBeenCalledWith(mockModPartialState, mockHandler, MOCK_STORE_NAME);
        });
    });

    describe('Method - getProtoMethodNames: Get all method names for an object prorotype', () => {
        const MOCK_METHOD_NAME = 'sayHello';
        class MockClass {
            [MOCK_METHOD_NAME]() {}
        }

        it('should return all prototype method names', () => {
            expect(cmp.getProtoMethodNames(new MockClass())).toEqual([ MOCK_METHOD_NAME ]);
        });
    });

    describe('Method - updateState', () => {
        const MOCK_STORE_NAME = 'store_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };
        const mockHandler = { };
        let setStateSpy: jest.SpyInstance;

        beforeEach(() => {
            cmp.state = mockState;
            setStateSpy = jest.spyOn(cmp, 'setState');
            setStateSpy.mockImplementation(() => {});
        });

        it('should update state', () => {
            cmp.updateState(mockModPartialState, mockHandler, MOCK_STORE_NAME);
            expect(setStateSpy).toHaveBeenCalled();
            expect(typeof setStateSpy.mock.calls[0][1]).toBe('function');
        });
    });

    describe('Method - checkStoreName: Check if store name already exists for duplication', () => {
        const mockStore = { prop: 123 };
        const mockStoreHandler = { onClick(){} };

        it('should throw an error if store name already exists in either store or store handler', () => {
            const mockStoreProp = 'prop';
            const mockStoreHandlerProp = 'onClick';

            expect(() => {
                cmp.checkStoreName(mockStoreProp, mockStore, mockStoreHandler);
            }).toThrowError(`${mockStoreProp} ${cmp.STORE_NAME_ERR}`);

            expect(() => {
                cmp.checkStoreName(mockStoreHandlerProp, mockStore, mockStoreHandler);
            }).toThrowError(`${mockStoreHandlerProp} ${cmp.STORE_NAME_ERR}`);
        });

        it('should not throw an error if store name doesnt yet exist in either store or store handler ', () => {
            expect(() => {
                cmp.checkStoreName('lorem', mockStore, mockStoreHandler);
            }).not.toThrowError();
        });
    });
});