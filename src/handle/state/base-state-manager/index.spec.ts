import PubSub from 'pubsub-js';
import { BaseStateManager } from '.';

describe('Base State Manager', () => {
    const MOCK_TOPIC = 'lorem';
    let mockPubSub: Partial<PubSub>;
    let handle: BaseStateManager;
    let getTopicSpy: jest.SpyInstance;
    let logInfoSpy: jest.SpyInstance;

    beforeEach(() => {
        mockPubSub = {
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publish: jest.fn(),
        };
        handle = new BaseStateManager();

        (handle as any).PubSub = mockPubSub;
        getTopicSpy = jest.spyOn(handle, 'getTopic');
        logInfoSpy = jest.spyOn(console, 'info');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('static - `join`: should join the prototypal methods of multiple partial state handlers into the prototypal methods of 1 main state handler', () => {
        class MockHandlerA extends BaseStateManager { logA() {} }
        class MockHandlerB extends BaseStateManager { logB() {} }
        interface IMockStateManager extends MockHandlerA, MockHandlerB {
            new(...args: any[]): IMockStateManager;
        };

        const { logA, logB } = BaseStateManager.join<IMockStateManager>([MockHandlerA, MockHandlerB]).prototype;
        expect(logA).toBeTruthy();
        expect(logB).toBeTruthy();
    });

    it('getter - `reflect`: should return itself when property `reflect` is accessed', () => {
        expect(handle.reflect).toBe(handle);
    });

    it('method - `subscribe`: should call subscribe', () => {
        const mockCallback = () => {};
        getTopicSpy.mockReturnValue(MOCK_TOPIC);
        handle.sub(mockCallback);

        expect(mockPubSub.subscribe).toHaveBeenCalledWith(MOCK_TOPIC, mockCallback);
    });

    it('method - `publish`: should call publish', () => {
        const mockData = { name: 'john' };
        getTopicSpy.mockReturnValue(MOCK_TOPIC);
        handle.pub(mockData);

        expect(mockPubSub.publish).toHaveBeenCalledWith(MOCK_TOPIC, mockData);
    });

    it('method - `unsubscribe`: should call unsubscribe', () => {
        const MOCK_TOKEN = 'token';
        handle.unsub(MOCK_TOKEN);

        expect(mockPubSub.unsubscribe).toHaveBeenCalledWith(MOCK_TOKEN);
    });

    it('method - `getTopic`: should return the topic', () => {
        const MOCK_SUB_TOPIC = 'lorem';

        expect(handle.getTopic()).toBe(handle.CHANGE_EVT);
        expect(handle.getTopic(MOCK_SUB_TOPIC)).toBe(`${handle.CHANGE_EVT}.${MOCK_SUB_TOPIC}`);
    });

    it('method - `log`: should log message', () => {
        const MOCK_METHOD = 'method';
        const mockData = { lorem: 'sum' };

        handle.log(MOCK_METHOD, mockData, true);
        expect(logInfoSpy).not.toHaveBeenCalled();

        handle.log(MOCK_METHOD, mockData);
        expect(logInfoSpy).toHaveBeenCalled();
    });
});