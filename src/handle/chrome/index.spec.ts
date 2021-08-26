import { TestUtil } from '../../asset/ts/test-util';
import { AMethodSpy } from '../../asset/ts/test-util/type';
import { chromeHandle, ChromeHandle } from './';
import { SettingState } from '../../model/setting-state';

const mockDefRules = 'def-rules';
jest.mock('../../model/rule/default', () => {
    return {
        getDefRules() {
            return mockDefRules
        }
    };
});

describe('Chrome Handle', () => {
    let handleSpy: AMethodSpy<ChromeHandle>;
    let chromeStoreGetSpy: jest.SpyInstance;
    let chromeStoreSetSpy: jest.SpyInstance;
    let jsonParseSpy: jest.SpyInstance;
    let jsonStringifySpy: jest.SpyInstance;

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
        jsonParseSpy = jest.spyOn(JSON, 'parse');
        jsonStringifySpy = jest.spyOn(JSON, 'stringify');
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
        it('should return existing state if found in chrome storage', async () => {
            const mockData = 'lorem';
            const mockResolveFn = resolve => resolve(mockData);
            handleSpy.getResolveCallback.mockReturnValue(mockResolveFn);
            jsonParseSpy.mockReturnValue(mockData);

            const data = await chromeHandle.getState();
            expect(data).toBe(mockData);
        });

        it('should return default state if not found in chrome storage', async () => {
            const mockResolveFn = resolve => resolve(null);
            handleSpy.getResolveCallback.mockReturnValue(mockResolveFn);
            const mockDefState: any = {
                setting: 'settting',
                rules: 'rules'
            };
            handleSpy.getDefState.mockResolvedValue(mockDefState);

            const data = await chromeHandle.getState();
            expect(data).toBe(mockDefState);
        });
    });

    describe('Method - getDefState', () => {
        it('should return default state and save it to chrome', async () => {
            handleSpy.saveState.mockImplementation(() => Promise.resolve(true));
            const state = await chromeHandle.getDefState();

            expect(state).toEqual({
                rules: mockDefRules,
                setting: new SettingState(),
            });
        });
    });

    describe('Method - saveState', () => {
        const mockState: any = {};
        const mockSaveValue = {'a': 'b'};

        beforeEach(() => {
            handleSpy.getState.mockResolvedValue({});
            jsonStringifySpy.mockReturnValue(mockSaveValue);
        });

        it('should save state if chrome exists', async () => {
            await chromeHandle.saveState(mockState);
            expect(chromeStoreSetSpy).toHaveBeenCalledWith({
                [chromeHandle.storeKey]: mockSaveValue
            });
        });

        it('should exit if chrome doesnt exist', async () => {
            chromeHandle.isInChromeCtx = false;

            await chromeHandle.saveState(mockState);
            expect(handleSpy.getState).not.toHaveBeenCalled();
            expect(jsonStringifySpy).not.toHaveBeenCalled();
            expect(chromeStoreSetSpy).not.toHaveBeenCalled();
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