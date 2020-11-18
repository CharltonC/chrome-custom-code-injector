import PubSub from 'pubsub-js';
import { BaseStoreHandler } from './base-store-handler';

describe('Base Store Handler', () => {
    const MOCK_TOPIC = 'lorem';
    let mockPubSub: Partial<PubSub>;
    let handle: BaseStoreHandler;
    let getTopicSpy: jest.SpyInstance;

    beforeEach(() => {
        mockPubSub = {
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publish: jest.fn(),
        };
        handle = new BaseStoreHandler();

        (handle as any).PubSub = mockPubSub;
        getTopicSpy = jest.spyOn(handle, 'getTopic');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('static - `join`: should join the prototypal methods of multiple partial store handlers into the prototypal methods of 1 main store handler', () => {
        class MockHandlerA extends BaseStoreHandler { logA() {} }
        class MockHandlerB extends BaseStoreHandler { logB() {} }
        const { logA, logB } = BaseStoreHandler.join([MockHandlerA, MockHandlerB]).prototype;
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
});