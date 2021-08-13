import { TestUtil } from '../../asset/ts/test-util';
import { codeRunnerHandle as handle, CodeRunnerHandle } from './';
import { AMethodSpy } from '../../asset/ts/test-util/type';
import { HostRuleConfig, PathRuleConfig, LibRuleConfig } from '../../data/model/rule-config';

describe('Code Runner Handle', () => {
    let mockFn;
    let handleSpy: AMethodSpy<CodeRunnerHandle>;
    let mockHost: HostRuleConfig;
    let mockPath: PathRuleConfig;
    let mockRules: HostRuleConfig[];

    beforeEach(() => {
        handleSpy = TestUtil.spyMethods(handle);

        mockFn = () => {};

        mockHost = new HostRuleConfig('lorem', 'sum');
        mockPath = new PathRuleConfig('lorem-path', 'sum-path');
        mockHost.paths.push(mockPath);
        mockRules = [ mockHost ];
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - init', () => {
        beforeEach(() => {
            handleSpy.applyRule.mockImplementation(mockFn);
        });

        it('should apply host rule only if matches host only', () => {
            handleSpy.isMatchHost.mockReturnValue(true);
            handleSpy.isMatchPath.mockReturnValue(false);
            handle.init(mockRules);

            expect(handleSpy.applyRule).toHaveBeenCalledWith(mockHost, mockHost.codeExecPhase);
        });

        it('should apply both host and path rules if matches host and path', () => {
            handleSpy.isMatchHost.mockReturnValue(true);
            handleSpy.isMatchPath.mockReturnValue(true);
            handle.init(mockRules);

            expect(handleSpy.applyRule).toHaveBeenCalledTimes(2);
        });

        it('should not apply host rule if not match host', () => {
            handleSpy.isMatchHost.mockReturnValue(false);
            handle.init(mockRules);

            expect(handleSpy.applyRule).not.toHaveBeenCalled();
        });
    });

    describe('Method - applyRule', () => {
        beforeEach(() => {
            handleSpy.applyRuleNow.mockImplementation(mockFn);
            handleSpy.applyRuleAtLoaded.mockImplementation(mockFn);
        });

        it('should call `applyRuleNow` if code execution phase is 0', () => {
            handle.applyRule(mockHost, 0);
            expect(handleSpy.applyRuleNow).toHaveBeenCalled();
        });

        it('should call `appRuleAtLoaded` if code execution phase is 1', () => {
            handle.applyRule(mockHost, 1);
            expect(handleSpy.applyRuleAtLoaded).toHaveBeenCalled();
        });
    });

    describe('Method - applyRuleNow', () => {
        beforeEach(() => {
            handleSpy.injectJsCode.mockImplementation(mockFn);
            handleSpy.injectCssCode.mockImplementation(mockFn);
            handleSpy.injectLibs.mockImplementation(mockFn);
        });

        it('should not call corresponding injection method if not enabled', () => {
            // Mock Enabled Flag
            Object.assign(mockHost, {
                isJsOn: false,
                isCssOn: false,
                isLibOn: false
            });
            handle.applyRuleNow(mockHost);

            expect(handleSpy.injectJsCode).not.toHaveBeenCalled();
            expect(handleSpy.injectCssCode).not.toHaveBeenCalled();
            expect(handleSpy.injectLibs).not.toHaveBeenCalled();
        });

        it('should call corresponding injection method if enabled', () => {
            // Mock Enabled Flag
            Object.assign(mockHost, {
                isJsOn: true,
                isCssOn: true,
                isLibOn: true
            });
            handle.applyRuleNow(mockHost);

            expect(handleSpy.injectJsCode).toHaveBeenCalled();
            expect(handleSpy.injectCssCode).toHaveBeenCalled();
            expect(handleSpy.injectLibs).toHaveBeenCalled();
        });
    });

    describe('Method - appRuleAtLoaded', () => {
        let windowAddEvtSpy: jest.SpyInstance;

        beforeEach(() => {
            handleSpy.getOnWindowLoadCallback.mockReturnValue(mockFn);
            windowAddEvtSpy = jest.spyOn(window, 'addEventListener');
            windowAddEvtSpy.mockImplementation(() => {});
        });

        it('should add callback when window is loaded', () => {
            handle.applyRuleAtLoaded(mockHost);
            expect(windowAddEvtSpy).toHaveBeenCalledWith('load', mockFn);
        });
    });

    describe('Method - injectJsCode', () => {
        const $mockScript = document.createElement('script');

        beforeEach(() => {
            handleSpy.addToDom.mockImplementation(mockFn);
            jest.spyOn(document, 'createElement').mockReturnValue($mockScript);
        });

        it('should inject js code', () => {
            const mockCode = '';
            const mockId = 'id';
            const mockIsHost = true;

            handle.injectJsCode(mockCode, mockId, mockIsHost);
            expect(handleSpy.addToDom).toHaveBeenCalledWith({
                $code: $mockScript,
                isHost: mockIsHost,
                id: mockId,
                injectType: 'code',
                lang: 'js'
            });
        });
    });

    describe('Method - injectCssCode', () => {
        const $mockStyle = document.createElement('style');

        beforeEach(() => {
            handleSpy.addToDom.mockImplementation(mockFn);
            jest.spyOn(document, 'createElement').mockReturnValue($mockStyle);
        });

        it('should inject js code', () => {
            const mockCode = '';
            const mockId = 'id';
            const mockIsHost = true;

            handle.injectCssCode(mockCode, mockId, mockIsHost);
            expect(handleSpy.addToDom).toHaveBeenCalledWith({
                $code: $mockStyle,
                isHost: mockIsHost,
                id: mockId,
                injectType: 'code',
                lang: 'css'
            });
        });
    });

    describe('Method - injectLibs: Inject js/css libraries', () => {
        const mockIsHost = true;
        const mockId = 'id';

        // Mock the fragment container with children
        const $mockFragment = document.createDocumentFragment();
        const $mockElem = document.createElement('div');
        $mockFragment.appendChild($mockElem);

        // Mock libraries
        let mockLib: LibRuleConfig;
        let mockLibs: LibRuleConfig[];

        beforeEach(() => {
            mockLib = new LibRuleConfig('lorem', 'sum');
            mockLibs = [mockLib];

            handleSpy.injectJsLib.mockImplementation(mockFn);
            handleSpy.injectCssLib.mockImplementation(mockFn);
            handleSpy.addToDom.mockImplementation(mockFn);
        });

        it('should not inject if it is not enabled', () => {
            mockLib.isOn = false;
            handle.injectLibs(mockLibs, mockId, mockIsHost);

            expect(handleSpy.injectJsLib).not.toHaveBeenCalled();
            expect(handleSpy.injectCssLib).not.toHaveBeenCalled();
            expect(handleSpy.addToDom).not.toHaveBeenCalled();
        });

        it('should inject js library if library type is js', () => {
            mockLib.isOn = true;
            mockLib.type = 'js';
            jest.spyOn(document, 'createDocumentFragment').mockReturnValue($mockFragment);
            handle.injectLibs(mockLibs, mockId, mockIsHost);

            expect(handleSpy.injectJsLib).toHaveBeenCalled();
            expect(handleSpy.injectCssLib).not.toHaveBeenCalled();
            expect(handleSpy.addToDom).toHaveBeenCalledTimes(2);
        });

        it('should inject css library if library type is css', () => {
            mockLib.isOn = true;
            mockLib.type = 'css';
            jest.spyOn(document, 'createDocumentFragment').mockReturnValue($mockFragment);
            handle.injectLibs(mockLibs, mockId, mockIsHost);

            expect(handleSpy.injectJsLib).not.toHaveBeenCalled();
            expect(handleSpy.injectCssLib).toHaveBeenCalled();
            expect(handleSpy.addToDom).toHaveBeenCalledTimes(2);
        });

    });

    describe('Method - injectJsLib', () => {
        const $mockWrapper = document.createDocumentFragment();
        const $mockScript = document.createElement('script');
        const mockUrl = 'http://google.com/';
        const mockIsAsync = true;

        beforeEach(() => {
            jest.spyOn(document, 'createElement').mockReturnValue($mockScript);
        });

        it('should inject js library', () => {
            handle.injectJsLib($mockWrapper, mockUrl, mockIsAsync);
            expect($mockScript.src).toBe(mockUrl);
            expect($mockWrapper.firstChild).toBe($mockScript);
        });
    });

    describe('Method - injectCssLib', () => {
        const $mockWrapper = document.createDocumentFragment();
        const $mockLink = document.createElement('link');
        const mockUrl = 'http://google.com/';

        beforeEach(() => {
            jest.spyOn(document, 'createElement').mockReturnValue($mockLink);
        });

        it('should inject js library', () => {
            handle.injectCssLib($mockWrapper, mockUrl);
            expect($mockLink.href).toBe(mockUrl);
            expect($mockWrapper.firstChild).toBe($mockLink);
        });
    });

    describe('Method - addToDom', () => {
        const $mockCode = document.createElement('div');
        const baseArg = {
            $code: $mockCode,
            isHost: true,
            id: 'id',
            injectType: 'library',
            lang: 'js'
        };

        let bodyAppendChildSpy: jest.SpyInstance;
        let headAppendChildSpy: jest.SpyInstance;
        let logErrSpy: jest.SpyInstance;

        beforeEach(() => {
            bodyAppendChildSpy = jest.spyOn(document.body, 'appendChild');
            headAppendChildSpy = jest.spyOn(document.head, 'appendChild');
            logErrSpy = jest.spyOn(console, 'error').mockImplementation(mockFn);
        });

        it('should catch and log error', () => {
            bodyAppendChildSpy.mockImplementation(() => {
                throw new Error('mock-err');
            });

            handle.addToDom(baseArg);
            handle.addToDom({ ...baseArg, isHost: false });
            const [ callArgOne, callArgTwo ] = logErrSpy.mock.calls;

            expect(callArgOne[0].includes('host')).toBeTruthy();
            expect(callArgTwo[0].includes('path')).toBeTruthy();
        });

        it('should append js (script) to <body>', () => {
            handle.addToDom(baseArg);
            expect(bodyAppendChildSpy).toHaveBeenCalled();
            expect(headAppendChildSpy).not.toHaveBeenCalled();
        });

        it('should append stylesheet (link) to <head>', () => {
            handle.addToDom({ ...baseArg, lang: 'css' });
            expect(bodyAppendChildSpy).not.toHaveBeenCalled();
            expect(headAppendChildSpy).toHaveBeenCalled();
        });
    });

    describe('Method - getOnWindowLoadCallback', () => {
        let windowRmvListenerSpy: jest.SpyInstance;

        beforeEach(() => {
            jest.spyOn(handle, 'applyRuleNow').mockImplementation(mockFn);
            windowRmvListenerSpy = jest.spyOn(window, 'removeEventListener').mockImplementation(mockFn);
        });

        it('should return a callback for window on load', () => {
            const fn = handle.getOnWindowLoadCallback(mockHost);
            fn();
            expect(handleSpy.applyRuleNow).toHaveBeenCalled();
            expect(windowRmvListenerSpy).toHaveBeenCalledWith('load', fn);
        });
    });

    describe('Method - isMatchHost', () => {
        const mockHost = 'host';
        const mockInclHost = `some${mockHost}`;
        const mockIncorrectHost = '1234';
        const mockHostRule = new HostRuleConfig('lorem', mockHost);
        const mockProtocol = 'https';

        beforeEach(() => {
            handleSpy.isMatchProtocol.mockReturnValue(true);
        });

        describe('When exact match is required', () => {
            it('should return true if it matches', () => {
                expect(
                    handle.isMatchHost(mockProtocol, mockHost, {
                        ...mockHostRule,
                        isExactMatch: true
                    })
                ).toBeTruthy();
            });

            it('should return false if it doesnt matches', () => {
                expect(
                    handle.isMatchHost(mockProtocol, mockInclHost, {
                        ...mockHostRule,
                        isExactMatch: true
                    })
                ).toBeFalsy();
            });
        });

        describe('When exact match is not required', () => {
            it('should return true if it matches', () => {
                expect(
                    handle.isMatchHost(mockProtocol, mockInclHost, {
                        ...mockHostRule,
                        isExactMatch: false,
                    })
                ).toBeTruthy();
            });

            it('should return false if it doesnt matches', () => {
                expect(
                    handle.isMatchHost(mockProtocol, mockIncorrectHost, {
                        ...mockHostRule,
                        isExactMatch: false,
                    })
                ).toBeFalsy();
            });
        });
    });

    describe('Method - isMatchPath', () => {
        const mockPath = 'path';
        const mockExactPath = mockPath;
        const mockInclPath = `some${mockPath}`;
        const mockIncorrectPath = '1234';
        const mockPathRule = new PathRuleConfig('lorem', mockPath);

        describe('When exact match is required', () => {
            it('should return true if it matches', () => {
                expect(
                    handle.isMatchPath(mockExactPath, {
                        ...mockPathRule,
                        isExactMatch: true
                    })
                ).toBeTruthy();
            });

            it('should return false if it doesnt match', () => {
                expect(
                    handle.isMatchPath(mockInclPath, {
                        ...mockPathRule,
                        isExactMatch: true
                    })
                ).toBeFalsy();
            });
        });

        describe('When exact match is not required', () => {
            it('should return true it matches', () => {
                expect(
                    handle.isMatchPath(mockInclPath, {
                        ...mockPathRule,
                        isExactMatch: false
                    })
                ).toBeTruthy();
            });

            it('should return false it doesnt match', () => {
                expect(
                    handle.isMatchPath(mockIncorrectPath, {
                        ...mockPathRule,
                        isExactMatch: false
                    })
                ).toBeFalsy();
            });
        });
    });

    describe('Method - isMatchProtocol', () => {
        it('should check protocol if https is specified', () => {
            const isHttps = true;

            expect(
                handle.isMatchProtocol('https', isHttps)
            ).toBeTruthy();

            expect(
                handle.isMatchProtocol('ftp', isHttps)
            ).toBeFalsy();
        });

        it('should return true if https is not specified', () => {
            expect(
                handle.isMatchProtocol('ftp', false)
            ).toBeTruthy();
        });
    });
});
