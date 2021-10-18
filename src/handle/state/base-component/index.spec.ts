import { TestUtil } from '../../../asset/ts/test-util';
import { BaseStateComponent } from '.';
import { BaseStateManager } from '../base-state-manager';
import { AMethodSpy } from '../../../asset/ts/test-util/type';

describe('Base State Component', () => {
    let cmp: BaseStateComponent;
    let spy: AMethodSpy<BaseStateComponent>;

    beforeEach(() => {
        cmp = new BaseStateComponent({});
        spy = TestUtil.spyMethods(cmp);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - transformStateConfigs: Transform state and state Handlers with Proxy', () => {
        const getProxyStateHandler = {};

        beforeEach(() => {
            spy.getProxyStateHandler.mockReturnValue(getProxyStateHandler);
        });

        it('should return transformed config if root state and state handler are provided', () => {
            const mockState = { name: 'john' };
            class MockStateHandler extends BaseStateManager {
                sayHello() { return 'hello'; }
            }
            const { appState, appStateHandle } = cmp.transformStateConfigs({
                root: [ mockState, new MockStateHandler() ]
            });

            expect(appState).toBe(mockState);
            expect(appStateHandle).toBe(getProxyStateHandler);
        });

        it('should return transformed config if multiple non-root state and state handlers are provied', () => {
            const mockState1 = { name: 'john' };
            const mockState2 = { name: 'jane' };
            class MockStateHandler1 extends BaseStateManager {
                sayHello1() { return 'hello1'; }
            }
            class MockStateHandler2 extends BaseStateManager {
                sayHello2() { return 'hello2'; }
            }
            const { appState, appStateHandle } = cmp.transformStateConfigs({
                one: [ mockState1, new MockStateHandler1() ],
                two: [ mockState2, new MockStateHandler2() ]
            });

            expect(appState.one).toBe(mockState1);
            expect(appState.two).toBe(mockState2);
            expect(appStateHandle['one']).toBe(getProxyStateHandler);
            expect(appStateHandle['two']).toBe(getProxyStateHandler);
        });
    });

    describe('Method - getProxyStateHandler: Get a proxied appState handler', () => {
        const mockProxiedValue = 'lorem';
        const mockStateKey = '';
        class MockHandler extends BaseStateManager {
            mockMethod () {}
        }

        beforeEach(() => {
            spy.getAllowedMethodNames.mockReturnValue([]);
            spy.getStateChangeCallback.mockReturnValue(() => {});
            spy.getWrappedHandle.mockReturnValue(() => mockProxiedValue);
        });

        it('should return proxied value', () => {
            const mockHandler = new MockHandler();
            const proxyHandler = cmp.getProxyStateHandler(mockHandler, mockStateKey);
            expect(proxyHandler['someRandomProp']).toBe(mockProxiedValue);
        });
    });

    describe('Method - getWrappedHandle: Get proxy `get` handler function for a appState handler', () => {
        const MOCK_METHOD_NAME = 'sayHello';
        const mockAllowedMethodNames = [ MOCK_METHOD_NAME ];
        const MOCK_STATE_NAME = 'state_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };
        const mockProxy = {};
        let setStateSpy: jest.SpyInstance;
        let mockCallback: jest.Mock;
        let proxyHandler;


        beforeEach(() => {
            setStateSpy = jest.spyOn(cmp, 'setState');
            cmp.state = mockState;
            mockCallback = jest.fn();
            proxyHandler = cmp.getWrappedHandle(mockAllowedMethodNames, MOCK_STATE_NAME, mockCallback);
        });

        describe('non-allowed methods', () => {
            const mockKey = 'sayHi';
            const mockMethod = () => {};
            const mockTarget = {
                [mockKey]: mockMethod
            };

            it('should return method itself if it is not allwed', () => {
                const method = proxyHandler(mockTarget, mockKey, mockProxy);
                expect(method).toBe(mockMethod);
            });
        });

        describe('allowed methods', () => {
            const mockMethod = () => {};
            const mockTarget = {
                [MOCK_METHOD_NAME]: mockMethod
            };
            const mockNextState = { lorem: 'sum' };
            let wrappedMethod: AFn;
            let consoleErrSpy: jest.SpyInstance;

            beforeEach(() => {
                wrappedMethod = proxyHandler(mockTarget, MOCK_METHOD_NAME, mockProxy);
                setStateSpy.mockImplementation(() => {});
                spy.getNextState.mockReturnValue(mockNextState);

                consoleErrSpy = jest.spyOn(console, 'error');
            });

            it('should return a wrapped method if it is allowed', () => {
                expect(typeof wrappedMethod).toBe('function');
                expect(wrappedMethod).not.toBe(mockMethod);
            });

            it('should skip set state if an error is encounted during getting the modified state', () => {
                spy.getModPartialState.mockImplementation(() => {
                    throw new Error();
                });
                wrappedMethod();

                expect(consoleErrSpy).toHaveBeenCalled();
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should skip set state if returned modified partial state is falsy', () => {
                spy.getModPartialState.mockReturnValue(null);
                wrappedMethod();

                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set state if returned modified partial state is promise ', async () => {
                spy.getModPartialState.mockReturnValueOnce(Promise.resolve(mockModPartialState));
                await wrappedMethod();

                const [ nextState, callback ] = setStateSpy.mock.calls[0];
                expect(nextState).toEqual(mockNextState);

                callback();
                expect(mockCallback).toHaveBeenCalledWith({
                    key: MOCK_STATE_NAME,
                    method: MOCK_METHOD_NAME,
                    mod: mockModPartialState,
                    prev: mockState,
                    curr: mockNextState,
                });
            });

            it('should set state if returned modified partial state is not promise ', async () => {
                spy.getModPartialState.mockReturnValue(mockModPartialState);
                await wrappedMethod();

                const [ nextState, callback ] = setStateSpy.mock.calls[0];
                expect(nextState).toEqual(mockNextState);

                callback();
                expect(mockCallback).toHaveBeenCalledWith({
                    key: MOCK_STATE_NAME,
                    method: MOCK_METHOD_NAME,
                    mod: mockModPartialState,
                    prev: mockState,
                    curr: mockNextState,
                });
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

    describe('Method - getNextState', () => {
        const MOCK_STATE_NAME = 'state_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };

        beforeEach(() => {
            cmp.state = mockState;
        });

        it('should return next state when given a appState name', () => {
            const expectedCurrState = {
                'age': 11,
                [MOCK_STATE_NAME]: { 'age': 99 }
            };
            const state = cmp.getNextState(mockModPartialState, MOCK_STATE_NAME);

            expect(state).toEqual(expectedCurrState);
        });

        it('should return next state when not given a appState name', () => {
            const expectedCurrState = { 'age': 99 };
            const state = cmp.getNextState(mockModPartialState);

            expect(state).toEqual(expectedCurrState);
        });
    });

    describe('Method - checkStateName: Check if appState name already exists for duplication', () => {
        const mockState = { prop: 123 };
        const mockStateHandler = { onClick(){} };

        it('should throw an error if appState name already exists in either appState or appState handler', () => {
            const mockStateProp = 'prop';
            const mockStateHandlerProp = 'onClick';

            expect(() => {
                cmp.checkStateName(mockStateProp, mockState, mockStateHandler);
            }).toThrowError(`${mockStateProp} ${cmp.STATE_NAME_ERR}`);

            expect(() => {
                cmp.checkStateName(mockStateHandlerProp, mockState, mockStateHandler);
            }).toThrowError(`${mockStateHandlerProp} ${cmp.STATE_NAME_ERR}`);
        });

        it('should not throw an error if appState name doesnt yet exist in either appState or appState handler ', () => {
            expect(() => {
                cmp.checkStateName('lorem', mockState, mockStateHandler);
            }).not.toThrowError();
        });
    });
});