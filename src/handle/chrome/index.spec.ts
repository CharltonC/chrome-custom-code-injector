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
    const mockRuntimeId = 'runtime-id';
    let spy: AMethodSpy<ChromeHandle>;
    let chromeStoreGetSpy: jest.SpyInstance;
    let chromeStoreSetSpy: jest.SpyInstance;
    let chromeTabQuerySpy: jest.SpyInstance;
    let chromeTabCreateSpy: jest.SpyInstance;
    let jsonParseSpy: jest.SpyInstance;
    let jsonStringifySpy: jest.SpyInstance;

    beforeEach(() => {
        // Mock Global Chrome API
        Object.assign(globalThis, {
            chrome: {
                runtime: {
                    id: mockRuntimeId
                },
                tabs: {
                    query(){},
                    create(){}
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

        spy = TestUtil.spyMethods(chromeHandle);
        chromeTabQuerySpy = jest.spyOn(chrome.tabs, 'query');
        chromeTabCreateSpy = jest.spyOn(chrome.tabs, 'create');
        chromeStoreGetSpy = jest.spyOn(chrome.storage.sync, 'get');
        chromeStoreSetSpy = jest.spyOn(chrome.storage.sync, 'set');
        chromeStoreSetSpy.mockImplementation(() => {});
        chromeTabCreateSpy.mockImplementation(() => {});
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
                spy.getOnGetStateResolved.mockReturnValue(mockResolveFn);
                jsonParseSpy.mockReturnValue(mockData);

                const data = await chromeHandle.getState();
                expect(data).toBe(mockData);
            });

            it('should return default state if not found in chrome storage', async () => {
                const mockResolveFn = resolve => resolve(null);
                spy.getOnGetStateResolved.mockReturnValue(mockResolveFn);
                const mockDefState: any = {
                    setting: 'settting',
                    rules: 'rules'
                };
                spy.getDefState.mockResolvedValue(mockDefState);

                const data = await chromeHandle.getState();
                expect(data).toBe(mockDefState);
            });
        });

        describe('Method - getDefState', () => {
            it('should return default state and save it to chrome', async () => {
                spy.saveState.mockImplementation(() => Promise.resolve(true));
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
                spy.getState.mockResolvedValue({});
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
                expect(spy.getState).not.toHaveBeenCalled();
                expect(jsonStringifySpy).not.toHaveBeenCalled();
                expect(chromeStoreSetSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('Url/Tab', () => {
        describe('Method - getTabUrl', () => {
            it('should return the current tab url', async () => {
                const mockUrl = { host: 'host' };
                spy.getOnGetCurrentResolved.mockReturnValue(resolve => {
                    resolve(mockUrl);
                });

                const url = await chromeHandle.getTabUrl();
                expect(url).toEqual(mockUrl);
            });
        });

        describe('Method - isMainframeRequest', () => {
            it('should return true if it is a document request', () => {
                expect(
                    chromeHandle.isMainframeRequest({
                        frameId: 0,
                        method: 'GET',
                        type: 'main_frame',
                        statusCode: 200
                    })
                ).toBeTruthy();
            });

            it('should return false if it is not document request', () => {
                expect(
                    chromeHandle.isMainframeRequest({
                        frameId: 1,
                        method: 'GET',
                        type: 'main_frame',
                        statusCode: 200
                    })
                ).toBeFalsy();

                expect(
                    chromeHandle.isMainframeRequest({
                        frameId: 1,
                        method: 'GET',
                        type: 'main_frame',
                        statusCode: 300
                    })
                ).toBeFalsy();

                expect(
                    chromeHandle.isMainframeRequest({
                        frameId: 0,
                        method: 'POST',
                        type: 'main_frame',
                        statusCode: 200
                    })
                ).toBeFalsy();

                expect(
                    chromeHandle.isMainframeRequest({
                        frameId: 0,
                        method: 'POST',
                        type: 'image',
                        statusCode: 200
                    })
                ).toBeFalsy();
            });
        });

        describe('Method - openExtOptionTab', () => {
            it('should open option without query params', () => {
                chromeHandle.openExtOptionTab();
                expect(chromeTabCreateSpy).toHaveBeenCalledWith(
                    { url: `chrome-extension://${mockRuntimeId}/option/index.html` }
                );
            });

            it('should open option with query params', () => {
                const baseUrl = `chrome-extension://${mockRuntimeId}/option/index.html?hostId=`;
                const mockHostIdCtx = { hostId: 'hostId' };
                chromeHandle.openExtOptionTab(mockHostIdCtx);
                expect(chromeTabCreateSpy).toHaveBeenCalledWith(
                    { url: `${baseUrl}${mockHostIdCtx.hostId}` }
                );

                const mockPathIdCtx = { ...mockHostIdCtx, pathId: 'pathId' };
                chromeHandle.openExtOptionTab(mockPathIdCtx);
                expect(chromeTabCreateSpy).toHaveBeenCalledWith(
                    { url: `${baseUrl}${mockHostIdCtx.hostId}&pathId=${mockPathIdCtx.pathId}` }
                );

            });
        });

        describe('Method - openUserguideTab', () => {
            it('should open user guide', () => {
                chromeHandle.openUserguideTab();
                expect(chromeTabCreateSpy).toHaveBeenCalledWith(
                    { url: `https://github.com/CharltonC/chrome-custom-code-injector-userguide` }
                );
            });
        });
    });

    describe('CSP (Content Security Policy)', () => {
        describe('Method - getAlteredCsp', () => {
            it('should not alter CSP if partial CSP exists and contain `self`', () => {
                const mockCsp = `script-src abc.com 'self'`;
                const mockPolicies = [ 'script-src' ];

                const csp = chromeHandle.getAlteredCsp(mockCsp, mockPolicies);
                expect(csp).toBe(mockCsp);
                expect(spy.addCspSubPolicyValue).not.toHaveBeenCalled();
                expect(spy.addCspSubPolicy).not.toHaveBeenCalled();
            });

            it('should alter CSP if partial CSP exists but doesnt contain `self`', () => {
                const mockPartialCsp = 'script-src abc.com';
                const mockCsp = `style-src 'self'; ${mockPartialCsp}`;
                const mockPolicies = [ 'script-src' ];

                const csp = chromeHandle.getAlteredCsp(mockCsp, mockPolicies);
                expect(csp).toBe(`${mockCsp} 'self'`);
                expect(spy.addCspSubPolicyValue).toHaveBeenCalledWith(mockCsp, mockPartialCsp);
                expect(spy.addCspSubPolicy).not.toHaveBeenCalled();
            });

            it('should not alter CSP if partial CSP doesnt exist while `default-src` contains `self`', () => {
                const mockCsp = `default-src 'self'; style-src 'self'`;
                const mockPolicies = [ 'script-src' ];

                const csp = chromeHandle.getAlteredCsp(mockCsp, mockPolicies);
                expect(csp).toBe(mockCsp);
                expect(spy.addCspSubPolicyValue).not.toHaveBeenCalled();
                expect(spy.addCspSubPolicy).not.toHaveBeenCalled();
            });

            it('should alter CSP if partial CSP doesnt exist while `default-src` doesnt exist or `default-src` doesnt contain `self`', () => {
                const mockCsp = `default-src: 'none'`;
                const mockPolicies = [ 'script-src' ];

                const csp = chromeHandle.getAlteredCsp(mockCsp, mockPolicies);
                expect(csp).toBe(`${mockCsp}; ${mockPolicies[0]} 'self'`);
                expect(spy.addCspSubPolicyValue).not.toHaveBeenCalled();
                expect(spy.addCspSubPolicy).toHaveBeenCalledWith(mockCsp, mockPolicies[0]);
            });
        });

        describe('Method - getCsp', () => {
            it('should return CSP value if found', () => {
                const mockRespHeaders = [
                    { name: 'Content-Security-Policy', value: 'csp' }
                ];
                const csp = chromeHandle.getCsp(mockRespHeaders);
                expect(csp).toBe(mockRespHeaders[0]);
            });

            it('should return null if not found', () => {
                const mockRespHeaders = [];
                const csp = chromeHandle.getCsp(mockRespHeaders);
                expect(csp).toBeFalsy();
            });
        });

        describe('Method - getCspSubPolicy', () => {
            const mockCsp = `default-src 'none'; style-src 'self'; srcript-src 'self' google.com`;

            it('should return partial CSP value if found', () => {
                expect(
                    chromeHandle.getCspSubPolicy(mockCsp, 'srcript-src')
                ).toBe(`srcript-src 'self' google.com`);

                expect(
                    chromeHandle.getCspSubPolicy(mockCsp, 'style-src')
                ).toBe(`style-src 'self'`);
            });

            it('should return null if not found', () => {
                expect(
                    chromeHandle.getCspSubPolicy(mockCsp, 'lorem')
                ).toBeFalsy();
            });
        });

        describe('Method - addCspSubPolicy', () => {
            it('should add new policy with value `self` to CSP', () => {
                const mockCsp = `default-src 'none'`;
                const mockPolicy = `style-src`;
                const csp = chromeHandle.addCspSubPolicy(mockCsp, mockPolicy);
                expect(csp).toBe(`${mockCsp}; ${mockPolicy} 'self'`);
            });
        });

        describe('Method - addCspSubPolicyValue', () => {
            it('should add a partial value to the existing policy in the CSP', () => {
                const mockPolicy = `style-src 'none' abc.com`;
                const mockCsp = `default-src 'none'; ${mockPolicy}`;
                const csp = chromeHandle.addCspSubPolicyValue(mockCsp, mockPolicy);
                expect(csp).toBe(`${mockCsp} 'self'`);
            });
        });
    });

    describe('Helper', () => {
        describe('Method - getOnGetStateResolved', () => {
            it('should return resolve callback function', () => {
                const mockResolveFn = () => {};
                const mockFn = () => 'fn';
                spy.getOnStorage.mockReturnValue(mockFn);
                const resolveCallback = chromeHandle.getOnGetStateResolved();
                resolveCallback(mockResolveFn);

                expect(spy.getOnStorage).toHaveBeenCalledWith(mockResolveFn);
                expect(chromeStoreGetSpy).toHaveBeenCalledWith(
                    chromeHandle.storeKey,
                    mockFn,
                );
            });
        });

        describe('Method - getOnStorage', () => {
            it('should return storage callback function', () => {
                const mockResolveFn = jest.fn();
                const mockStorage = { [chromeHandle.storeKey]: 'lorem' };
                const storageCallback = chromeHandle.getOnStorage(mockResolveFn);
                storageCallback(mockStorage);

                expect(mockResolveFn).toHaveBeenCalledWith('lorem');
            });
        });

        describe('Method - getOnGetCurrentResolved', () => {
            it('should return resolve callback function', () => {
                const mockFn = () => {};
                spy.getOnTabQuery.mockReturnValue(mockFn);
                chromeTabQuerySpy.mockImplementation(() => {});

                const resolveFn = chromeHandle.getOnGetCurrentResolved();
                resolveFn();
                expect(chromeTabQuerySpy).toHaveBeenCalledWith(
                    {"active": true, "currentWindow": true},
                    mockFn
                );
            });
        });

        describe('Method - getOnTabQuery', () => {
            it('should return url callback', () => {
                const mockTabs = [
                    { url: 'http://abc.com/' }
                ];
                const mockUrl = new URL(mockTabs[0].url);
                const mockResolveFn = jest.fn();
                const callback = chromeHandle.getOnTabQuery(mockResolveFn);

                callback(mockTabs);
                expect(mockResolveFn).toHaveBeenCalledWith(mockUrl);
            });
        });
    });
});