import { TestUtil } from '../../asset/ts/test-util';
import { AMethodSpy } from '../../asset/ts/test-util/type';
import { chromeHandle, ChromeHandle } from './';

describe('Chrome Handle', () => {
    let handleSpy: AMethodSpy<ChromeHandle>;
    let chromeStoreGetSpy: jest.SpyInstance;
    let chromeStoreSetSpy: jest.SpyInstance;

    beforeEach(() => {
        // Mock Global Chrome API
        Object.assign(globalThis, {
            chrome: {
                storage: {
                    sync: {
                        get() {},
                        set() {}
                    }
                }
            }
        });
        chromeHandle.isInChromeCtx = true;

        handleSpy = TestUtil.spyMethods(chromeHandle);
        chromeStoreGetSpy = jest.spyOn(chrome.storage.sync, 'get');
        chromeStoreSetSpy = jest.spyOn(chrome.storage.sync, 'set');
        chromeStoreSetSpy.mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should set optional store key', () => {
            expect((new ChromeHandle()).storeKey).toBe(chromeHandle.storeKey);
            expect((new ChromeHandle('lorem')).storeKey).toBe('lorem');
        });
    });

    describe('Method - getState: ', () => {
        it('should retrieve state', async () => {
            const mockData = 'lorem';
            const mockResolveFn = resolve => resolve(mockData);
            handleSpy.getResolveCallback.mockReturnValue(mockResolveFn);
            const data = await chromeHandle.getState();

            expect(data).toBe(mockData);
        });
    });

    describe('Method - saveState', () => {
        it('should save state if chrome exists', async () => {
            const mockExistState = { a: 1 };
            const mockMergeState: any = { b: 2 };
            handleSpy.getState.mockReturnValue(Promise.resolve(mockExistState));
            await chromeHandle.saveState(mockMergeState);

            expect(chromeStoreSetSpy).toHaveBeenCalledWith({
                [chromeHandle.storeKey]: {
                    ...mockExistState,
                    ...mockMergeState
                }
            });
        });

        it('should exit if chrome doesnt exist', async () => {
            chromeHandle.isInChromeCtx = false;
            await chromeHandle.saveState({});

            expect(handleSpy.getState).not.toHaveBeenCalled();
        });
    });

    describe('Method - getResolveCallback', () => {
        it('should return resolve callback function', () => {
            const mockResolveFn = () => {};
            const mockFn = () => 'fn';
            handleSpy.getStorageCallback.mockReturnValue(mockFn);
            const resolveCallback = chromeHandle.getResolveCallback();
            resolveCallback(mockResolveFn);

            expect(handleSpy.getStorageCallback).toHaveBeenCalledWith(mockResolveFn);
            expect(chromeStoreGetSpy).toHaveBeenCalledWith(
                chromeHandle.storeKey,
                mockFn,
            );
        });
    });

    describe('Method - getStorageCallback', () => {
        it('should return storage callback function', () => {
            const mockResolveFn = jest.fn();
            const mockStorage = { [chromeHandle.storeKey]: 'lorem' };
            const storageCallback = chromeHandle.getStorageCallback(mockResolveFn);
            storageCallback(mockStorage);

            expect(mockResolveFn).toHaveBeenCalledWith('lorem');
        });
    });
});