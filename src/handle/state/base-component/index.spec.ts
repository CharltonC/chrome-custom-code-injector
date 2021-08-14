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

    describe('Method - getProxyStateHandler: Get proxy `get` handler function for a appState handler', () => {
        const MOCK_METHOD_NAME = 'sayHello';
        const mockAllowedMethodNames = [ MOCK_METHOD_NAME ];
        const MOCK_STATE_NAME = 'state_name';
        const mockModPartialState = { age: 99 };
        const mockState = { age: 11 };
        class MockHandler extends BaseStateManager {
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
            proxyHandler = cmp.getProxyStateHandler(mockHandler, MOCK_STATE_NAME);
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
                expect(spy.updateState).toHaveBeenCalledWith(mockModPartialState, mockHandler, MOCK_STATE_NAME);
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
        const MOCK_STATE_NAME = 'state_name';
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

        it('should update state when given a appState name', () => {
            const expectedCurrState = {
                'age': 11,
                [MOCK_STATE_NAME]: { 'age': 99 }
            };
            cmp.updateState(mockModPartialState, mockHandler, MOCK_STATE_NAME);
            const [ modState, callback ] = setStateSpy.mock.calls[0];
            callback();

            expect(modState).toEqual(expectedCurrState);
            expect(mockHandler.pub).toHaveBeenCalledWith({
                prev: mockState,
                curr: expectedCurrState
            }, MOCK_STATE_NAME);
        });

        it('should update state when not given a appState name', () => {
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