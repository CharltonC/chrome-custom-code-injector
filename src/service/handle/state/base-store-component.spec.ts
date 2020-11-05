import { TestUtil } from '../../../asset/ts/test-util';
import { BaseStoreComponent } from './base-store-component';
import { BaseStoreHandler } from './base-store-handler';
import { TMethodSpy } from '../../../asset/ts/test-util/type';

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
            class MockStoreHandler extends BaseStoreHandler {
                sayHello() { return 'hello'; }
            }
            const { store, storeHandler } = cmp.transformStoreConfigs({
                root: [ mockStore, new MockStoreHandler() ]
            });

            expect(store).toBe(mockStore);
            expect(storeHandler).toBe(getProxyStoreHandler);
        });

        it('should return transformed config if multiple non-root stores and store handlers are provied', () => {
            const mockStore1 = { name: 'john' };
            const mockStore2 = { name: 'jane' };
            class MockStoreHandler1 extends BaseStoreHandler {
                sayHello1() { return 'hello1'; }
            }
            class MockStoreHandler2 extends BaseStoreHandler {
                sayHello2() { return 'hello2'; }
            }
            const { store, storeHandler } = cmp.transformStoreConfigs({
                store1: [ mockStore1, new MockStoreHandler1() ],
                store2: [ mockStore2, new MockStoreHandler2() ]
            });

            expect(store.store1).toBe(mockStore1);
            expect(store.store2).toBe(mockStore2);
            expect(storeHandler['store1']).toBe(getProxyStoreHandler);
            expect(storeHandler['store2']).toBe(getProxyStoreHandler);
        });
    });

    describe('Method - getProxyStoreHandler: Get proxy `get` handler function for a store handler', () => {
        const MOCK_METHOD_NAME = 'sayHello';
        const mockAllowedMethodNames = [ MOCK_METHOD_NAME ];
        const MOCK_STORE_NAME = 'store_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };
        class MockHandler extends BaseStoreHandler {
            age = 10;
            [MOCK_METHOD_NAME]() {}
        }
        let getModPartialStateSpy: jest.SpyInstance;
        let mockHandler: MockHandler;
        let proxyHandler;

        beforeEach(() => {
            mockHandler = new MockHandler();
            spy.getAllowedMethodNames.mockReturnValue(mockAllowedMethodNames);
            spy.updateState.mockImplementation(() => {});
            getModPartialStateSpy = jest.spyOn(cmp, 'getModPartialState');
            getModPartialStateSpy.mockReturnValue(mockModPartialState);

            cmp.state = mockState;
            proxyHandler = cmp.getProxyStoreHandler(mockHandler, MOCK_STORE_NAME);
        });

        describe('return value', () => {
            it('should return the value if the key is not allowed or is not a function', () => {
                expect(proxyHandler.lorem).toBeFalsy();
                expect(proxyHandler.age).toBe(10)
            });
        });

        describe('return wrapped function', () => {
            const mockArgs = [1,2];
            let method;

            beforeEach(() => {
                method = proxyHandler[MOCK_METHOD_NAME];
            });

            it('should return a wrapped function if the key is allowed and is a method', () => {
                method(...mockArgs);

                expect(typeof method).toBe('function');
                expect(getModPartialStateSpy).toHaveBeenCalledWith(mockHandler[MOCK_METHOD_NAME], proxyHandler, mockArgs);
                expect(spy.updateState).toHaveBeenCalledWith(mockModPartialState, mockHandler, MOCK_STORE_NAME);
            });

            it('should return a wrapped function where state is not updated when returned state is falsy', () => {
                getModPartialStateSpy.mockReturnValue(false);
                method(...mockArgs);

                expect(spy.updateState).not.toHaveBeenCalled();
            });

            it('should return a wrapped function where state is only updated when promise is resolved', async () => {
                const mockResolvePartialState = {lorem: 123};
                getModPartialStateSpy.mockReturnValue(Promise.resolve(mockResolvePartialState));
                await method(...mockArgs);

                expect(spy.updateState.mock.calls[0][0]).toBe(mockResolvePartialState);
            });
        });
    });

    describe('Method - getAllowedMethodNames: Get allowed method names for an object', () => {
        const MOCK_METHOD_NAME = 'sayHello';
        class MockClass {
            prop = 'lorem';
            set setHello(param) {}
            get getHello() { return 123; }
            [MOCK_METHOD_NAME]() {}
        }

        it('should return allowed method names excluding constructor, getter, setter and non-method properties', () => {
            expect(cmp.getAllowedMethodNames(new MockClass())).toEqual([ MOCK_METHOD_NAME ]);
        });
    });

    describe('Method - getModPartialState: Get the partial modified state (used for merging later)', () => {
        const mockFn = () => {};
        const mockProxy: any = {};
        const mockArgs = [ 1, 2 ];
        const mockState = { name: 'john' };
        const mockRtnVal = 'lorem';

        it('should return modified partial state', () => {
            const fnCallSpy: jest.SpyInstance = jest.spyOn(mockFn as Function, 'apply');
            fnCallSpy.mockReturnValue(mockRtnVal);
            cmp.state = mockState;

            expect(cmp.getModPartialState(mockFn, mockProxy, mockArgs)).toBe(mockRtnVal);
            expect(fnCallSpy).toHaveBeenCalledWith(mockProxy, [mockState, ...mockArgs]);
        });
    });

    describe('Method - updateState', () => {
        const MOCK_STORE_NAME = 'store_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };
        const mockHandler: any = { pub: null };
        let setStateSpy: jest.SpyInstance;

        beforeEach(() => {
            cmp.state = mockState;
            mockHandler.pub = jest.fn();
            setStateSpy = jest.spyOn(cmp, 'setState');
            setStateSpy.mockImplementation(() => {});
        });

        it('should update state when given a store name', () => {
            const expectedCurrState = {
                'age': 11,
                [MOCK_STORE_NAME]: { 'age': 99 }
            };
            cmp.updateState(mockModPartialState, mockHandler, MOCK_STORE_NAME);
            const [ modState, callback ] = setStateSpy.mock.calls[0];
            callback();

            expect(modState).toEqual(expectedCurrState);
            expect(mockHandler.pub).toHaveBeenCalledWith({
                prev: mockState,
                curr: expectedCurrState
            }, MOCK_STORE_NAME);
        });

        it('should update state when not given a store name', () => {
            const expectedCurrState = { 'age': 99 };
            cmp.updateState(mockModPartialState, mockHandler);
            const [ modState, callback ] = setStateSpy.mock.calls[0];
            callback();

            expect(modState).toEqual(expectedCurrState);
            expect(mockHandler.pub).toHaveBeenCalledWith({
                prev: mockState,
                curr: expectedCurrState
            }, undefined);
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