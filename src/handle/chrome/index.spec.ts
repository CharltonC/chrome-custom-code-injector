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
    let chromeTabQuerySpy: jest.SpyInstance;
    let jsonParseSpy: jest.SpyInstance;
    let jsonStringifySpy: jest.SpyInstance;

    beforeEach(() => {
        // Mock Global Chrome API
        Object.assign(globalThis, {
            chrome: {
                tabs: {
                    query(){}
                },
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
        chromeTabQuerySpy = jest.spyOn(chrome.tabs, 'query');
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

    describe('State storage', () => {
        describe('Method - getState: ', () => {
            it('should return existing state if found in chrome storage', async () => {
                const mockData = 'lorem';
                const mockResolveFn = resolve => resolve(mockData);
                handleSpy.getGetStateResolveFn.mockReturnValue(mockResolveFn);
                jsonParseSpy.mockReturnValue(mockData);

                const data = await chromeHandle.getState();
                expect(data).toBe(mockData);
            });

            it('should return default state if not found in chrome storage', async () => {
                const mockResolveFn = resolve => resolve(null);
                handleSpy.getGetStateResolveFn.mockReturnValue(mockResolveFn);
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
    });

    describe('Url', () => {
        describe('Method - getTabUrl', () => {
            it('should return the current tab url', async () => {
                const mockUrl = { host: 'host' };
                handleSpy.getGetCurrentResolveFn.mockReturnValue(resolve => {
                    resolve(mockUrl);
                });

                const url = await chromeHandle.getTabUrl();
                expect(url).toEqual(mockUrl);
            });
        });
    });

    describe('Helper', () => {
        describe('Method - getGetStateResolveFn', () => {
            it('should return resolve callback function', () => {
                const mockResolveFn = () => {};
                const mockFn = () => 'fn';
                handleSpy.getStorageCallback.mockReturnValue(mockFn);
                const resolveCallback = chromeHandle.getGetStateResolveFn();
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

        describe('Method - getGetCurrentResolveFn', () => {
            it('should return resolve callback function', () => {
                const mockFn = () => {};
                handleSpy.getUrlCallback.mockReturnValue(mockFn);
                chromeTabQuerySpy.mockImplementation(() => {});

                const resolveFn = chromeHandle.getGetCurrentResolveFn();
                resolveFn();
                expect(chromeTabQuerySpy).toHaveBeenCalledWith(
                    {"active": true, "currentWindow": true},
                    mockFn
                );
            });
        });

        describe('Method - getUrlCallback', () => {
            it('should return url callback', () => {
                const mockTabs = [
                    { url: 'http://abc.com/' }
                ];
                const mockUrl = new URL(mockTabs[0].url);
                const mockResolveFn = jest.fn();
                const callback = chromeHandle.getUrlCallback(mockResolveFn);

                callback(mockTabs);
                expect(mockResolveFn).toHaveBeenCalledWith(mockUrl);
            });
        });
    });
});