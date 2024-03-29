import { dataHandle, DataHandle } from '.';
import { HostRule, LibRule, PathRule } from '../../model/rule';
import { AMethodSpy } from '../../asset/ts/test-util/type';
import { TestUtil } from '../../asset/ts/test-util';

describe('Data Crud Handle', () => {
    let mockRules: HostRule[];
    let mockLibs: LibRule[];
    let spy: AMethodSpy<DataHandle>

    beforeEach(() => {
        mockLibs = [
            { id: 'lib-c-0' },
            { id: 'lib-c-1' },
            { id: 'lib-c-2' }
        ] as LibRule[];

        mockRules = [
            {
                id: 'host-a',
                paths: [],
                libs: [
                    { id: 'lib-a-0' }
                ]
            },
            {
                id: 'host-b',
                paths: [
                    { id: 'path-b-0', libs: [] },
                    { id: 'path-b-1', libs: [] },
                ]
            },
            {
                id: 'host-c' ,
                paths: [
                    {
                        id: 'path-c-0',
                        libs: mockLibs
                    },
                ],
                libs: [
                    { id: 'host-lib-c-0' }
                ]
            },
        ] as HostRule[];

        spy = TestUtil.spyMethods(dataHandle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Getter', () => {
        describe('Method - getRuleIdxCtxFromIdCtx: Get Rule index context from Id context', () => {
            it('should return rule index context when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const idxCtx = dataHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 0,
                    pathIdx: null,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const idxCtx = dataHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 1,
                    pathIdx: 0,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id and library id exist', () => {
                const mockIdCtx = { hostId: 'host-a', libId: 'lib-a-0' };
                const idxCtx = dataHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 0,
                    pathIdx: null,
                    libIdx: 0,
                });
            });

            it('should return rule index context when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const idxCtx = dataHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 2,
                    pathIdx: 0,
                    libIdx: 0,
                });
            });
        });

        describe('Method - getRuleFromIdxCtx: Get Rule from index context', () => {
            it('should return host when host index exists', () => {
                const mockIdxCtx = { hostIdx: 0 };
                const rule = dataHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host index and path index exist', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                const rule = dataHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return library when host index and library index exist', () => {
                const mockIdxCtx = { hostIdx: 0, libIdx: 0 };
                const rule = dataHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[0].libs[0]);
            });

            it('should return library when host index, path index, library index exist', () => {
                const mockIdxCtx = { hostIdx: 2, pathIdx: 0, libIdx: 0 };
                const rule = dataHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
            });
        });

        describe('Method - getRuleFromIdCtx: Get Rule from id context', () => {
            it('should return host when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const rule = dataHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const rule = dataHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return path when host id and library id exist', () => {
                const mockIdCtx = { hostId: 'host-a', libId: 'lib-a-0' };
                const rule = dataHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[0].libs[0]);
            });

            it('should return library when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const rule = dataHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
            });
        });

        describe('Method - getFilteredRules: Get filtered rules by searching the text in title and value of host/path', () => {
            const mockRules = [
                {
                    id: '1',
                    title: 'host-title-1',
                    value: 'host-value-1',
                    paths: [
                        {
                            id: '1-1',
                            title: 'path-title-1',
                            value: 'path-value-1',
                        }
                    ]
                },
                {
                    id: '2',
                    title: 'host-title-2',
                    value: 'host-value-2',
                    paths: [
                        {
                            id: '2-1',
                            title: 'path-title-2',
                            value: 'path-value-2',
                        }
                    ]
                }
            ] as HostRule[];

            it('should return unfiltered rules when text is empty or is whitespace', () => {
                expect(dataHandle.getFilteredRules(mockRules, '')).toBe(mockRules);
                expect(dataHandle.getFilteredRules(mockRules, ' ')).toBe(mockRules);
            });

            it('should return filtered rules if text is not empty', () => {
                expect(dataHandle.getFilteredRules(mockRules, 'host-title-1')).toEqual([ mockRules[0] ]);
                expect(dataHandle.getFilteredRules(mockRules, 'host-value-1')).toEqual([ mockRules[0] ]);
                expect(dataHandle.getFilteredRules(mockRules, 'path-title-1')).toEqual([ mockRules[0] ]);
                expect(dataHandle.getFilteredRules(mockRules, 'path-value-1')).toEqual([ mockRules[0] ]);
                expect(dataHandle.getFilteredRules(mockRules, ' path-value-1 ')).toEqual([ mockRules[0] ]);
            });

            it('should return filter rules if text has uppercase characters', () => {
                expect(dataHandle.getFilteredRules(mockRules, 'HOST-TITLE-1')).toEqual([ mockRules[0] ]);
            });

            it('should return filtered rules when text is space separated string', () => {
                expect(dataHandle.getFilteredRules(mockRules, 'abc path-title-1')).toEqual([ mockRules[0] ]);
            });

            it('should return empty rules when there is not match', () => {
                expect(dataHandle.getFilteredRules(mockRules, 'lorem')).toEqual([]);
            });
        });

        describe('Method - getLibs: Get Libraries from either a host or path', () => {
            let mockHost;

            beforeEach(() => {
                mockHost = mockRules[2];
            });

            it('should return host libraries of a host when path index is not provide', () => {
                const libs = dataHandle.getLibs(mockHost);
                expect(libs[0].id).toBe('host-lib-c-0');
            });

            it('should return path libraries of a path when path index is provided', () => {
                const libs = dataHandle.getLibs(mockHost, 0);
                expect(libs[0].id).toBe('lib-c-0');
            });
        });

        describe('Method - getNextAvailRuleIdCtx: Get the next available def/active rule id context when a host/path is removed', () => {
            let getRuleIdxCtxFromIdCtxSpy: jest.SpyInstance;

            beforeEach(() => {
                getRuleIdxCtxFromIdCtxSpy = jest.spyOn(dataHandle, 'getRuleIdxCtxFromIdCtx');
            });

            it('should return id context of the 1st host when a host is removed', () => {
                const mockIdCtx = { hostId: 'host' };
                const mockIdxCtx = { hostIdx: 1 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                const idCtx = dataHandle.getNextAvailRuleIdCtx(mockRules, mockIdCtx);
                expect(idCtx).toEqual({
                    hostId: mockRules[0].id,
                    pathId: undefined
                });
            });

            it('should return id context of the 1st path when not the only path is removed', () => {
                const mockIdCtx = { hostId: 'host', pathId: 'path' };
                const mockIdxCtx = { hostIdx: 1, pathIdx: 1 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                const idCtx = dataHandle.getNextAvailRuleIdCtx(mockRules, mockIdCtx);
                expect(idCtx).toEqual({
                    hostId: mockRules[mockIdxCtx.hostIdx].id,
                    pathId: mockRules[mockIdxCtx.hostIdx].paths[0].id,
                });
            });

            it('should return id context of the 1st host when a only path is removed', () => {
                const mockIdCtx = { hostId: 'host', pathId: 'path' };
                const mockIdxCtx = { hostIdx: 0, pathIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                const idCtx = dataHandle.getNextAvailRuleIdCtx(mockRules, mockIdCtx);
                expect(idCtx).toEqual({
                    hostId: mockRules[mockIdxCtx.hostIdx].id,
                    pathId: undefined
                });
            });
        });

        describe('Method - getHostFromUrl', () => {
            const mockRules = [
                new HostRule('lorem', 'sum')
            ];
            const mockUrl = {
                host: 'host',
                protocol: 'proto',
                pathname: 'path'
            } as URL;

            it('should return match host if found', () => {
                spy.isMatchHost.mockReturnValue(true);

                const host = dataHandle.getHostFromUrl(mockRules, mockUrl);
                expect(host).toBe(mockRules[0]);
            });

            it('should return null if not found', () => {
                spy.isMatchHost.mockReturnValue(false);

                const host = dataHandle.getHostFromUrl(mockRules, mockUrl);
                expect(host).toBeFalsy();
            });

            it('should return null if no rules are available', () => {
                expect(
                    dataHandle.getHostFromUrl([], mockUrl)
                ).toBeFalsy();

                expect(
                    dataHandle.getHostFromUrl(null, mockUrl)
                ).toBeFalsy();
            });
        });

        describe('Method - getPathFromUrl', () => {
            const mockPaths = [
                new PathRule('lorem', 'sum')
            ];
            const mockUrl = {
                host: 'host',
                protocol: 'proto',
                pathname: 'path'
            } as URL;

            it('should return match path if found', () => {
                spy.isMatchPath.mockReturnValue(true);

                const host = dataHandle.getPathFromUrl(mockPaths, mockUrl);
                expect(host).toBe(mockPaths[0]);
            });

            it('should return null if not found', () => {
                spy.isMatchPath.mockReturnValue(false);

                const path = dataHandle.getPathFromUrl(mockPaths, mockUrl);
                expect(path).toBeFalsy();
            });

            it('should return null if no paths are available', () => {
                expect(
                    dataHandle.getPathFromUrl([], mockUrl)
                ).toBeFalsy();

                expect(
                    dataHandle.getPathFromUrl(null, mockUrl)
                ).toBeFalsy();
            });
        });
    });

    describe('Toggle/Set', () => {
        let mockHost: HostRule;
        let mockLib: LibRule;
        let getRuleFromIdCtxSpy: jest.SpyInstance;
        const mockIdCtx: any = {};

        beforeEach(() => {
            mockHost = new HostRule('title', 'value');
            mockLib = new LibRule('title', 'value');
            getRuleFromIdCtxSpy = jest.spyOn(dataHandle, 'getRuleFromIdCtx');
        });

        describe('Host/Path/Library', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockHost);
            });

            it('Method - setProps: should set multiple properties', () => {
                const mockTitle = 'lorem';
                const mockValue = 'sum';
                dataHandle.setProps(mockRules, mockIdCtx, {
                    title: mockTitle,
                    value: mockValue
                });
                expect(mockHost.title).toBe(mockTitle);
                expect(mockHost.value).toBe(mockValue);
            });

            it('Method - setTitle: should set title', () => {
                const mockTitle = 'title';
                dataHandle.setTitle(mockRules, mockIdCtx, mockTitle);
                expect(mockHost.title).toBe(mockTitle);
            });

            it('Method - setValue: should set value', () => {
                const mockValue = 'value';
                dataHandle.setValue(mockRules, mockIdCtx, mockValue);
                expect(mockHost.value).toBe(mockValue);
            });
        });

        describe('Host/Path', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockHost);
            });

            it('Method - toggleHttpsSwitch: should toggle Https switch ', () => {
                const val = mockHost.isHttps;
                dataHandle.toggleHttpsSwitch(mockRules, mockIdCtx);
                expect(mockHost.isHttps).toBe(!val);
            });

            it('Method - toggleExactSwitch: should toggle Regex switch ', () => {
                const val = mockHost.isExactMatch;
                dataHandle.toggleExactSwitch(mockRules, mockIdCtx);
                expect(mockHost.isExactMatch).toBe(!val);
            });

            it('Method - toggleJsExecStep: should toggle Js execution step', () => {
                const mockStep = 3;
                dataHandle.toggleJsExecStep(mockRules, mockIdCtx, mockStep);
                expect(mockHost.codeExecPhase).toBe(mockStep);
            });

            it('Method - setLastActiveTab: should set the last active tab index', () => {
                const mockTabIdx = 3;
                dataHandle.setLastActiveTab(mockRules, mockIdCtx, mockTabIdx);
                expect(mockHost.activeTabIdx).toBe(mockTabIdx);
            });

            it('Method - toggleJsSwitch: should toggle Js switch', () => {
                const val = mockHost.isJsOn;
                dataHandle.toggleJsSwitch(mockRules, mockIdCtx);
                expect(mockHost.isJsOn).toBe(!val);
            });

            it('Method - toggleCssSwitch: should toggle Css switch', () => {
                const val = mockHost.isCssOn;
                dataHandle.toggleCssSwitch(mockRules, mockIdCtx);
                expect(mockHost.isCssOn).toBe(!val);
            });

            it('Method - toggleLibSwitch: should toggle Library switch', () => {
                const val = mockHost.isLibOn;
                dataHandle.toggleLibSwitch(mockRules, mockIdCtx);
                expect(mockHost.isLibOn).toBe(!val);
            });

            it('Method - setJsCode: should set the Js code', () => {
                const mockCode = 'lorem';
                dataHandle.setJsCode(mockRules, mockIdCtx, mockCode);
                expect(mockHost.jsCode).toBe(mockCode);
            });

            it('Method - setCssCode: should set the Css code', () => {
                const mockCode = 'lorem';
                dataHandle.setCssCode(mockRules, mockIdCtx, mockCode);
                expect(mockHost.cssCode).toBe(mockCode);
            });
        });

        describe('Library', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockLib);
            });

            it('Method - toggleLibAsyncSwitch: should toggle Library Async switch', () => {
                const mockVal = 'css';
                expect(mockLib.type).toBe('js');
                dataHandle.setLibType(mockRules, mockIdCtx, mockVal);
                expect(mockLib.type).toBe(mockVal);
            });

            it('Method - toggleLibAsyncSwitch: should toggle Library Async switch', () => {
                const val = mockLib.isAsync;
                dataHandle.toggleLibAsyncSwitch(mockRules, mockIdCtx);
                expect(mockLib.isAsync).toBe(!val);
            });

            it('Method - toggleLibIsOnSwitch: should toggle Library enable switch', () => {
                const val = mockLib.isOn;
                dataHandle.toggleLibIsOnSwitch(mockRules, mockIdCtx);
                expect(mockLib.isOn).toBe(!val);
            });
        });
    });

    describe('Add', () => {
        let getRuleIdxCtxFromIdCtxSpy: jest.SpyInstance;
        let getLibsSpy: jest.SpyInstance;
        const mockRule: any = { id: 'mock-rule' };
        const mockIdCtx: any = {};

        beforeEach(() => {
            getRuleIdxCtxFromIdCtxSpy = jest.spyOn(dataHandle, 'getRuleIdxCtxFromIdCtx');
            getLibsSpy = jest.spyOn(dataHandle, 'getLibs');
        });

        it('Method - addHost: should add host to rules', () => {
            dataHandle.addHost(mockRules, mockRule);
            expect(mockRules.includes(mockRule)).toBeTruthy();
        });

        it('Method - addPath: should add path to target host', () => {
            const mockHostIdx = 1;
            const mockHostIdCtx = { hostIdx: mockHostIdx };
            getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockHostIdCtx);

            dataHandle.addPath(mockRules, mockIdCtx, mockRule);
            const { paths } = mockRules[mockHostIdx];
            expect(paths.includes(mockRule)).toBeTruthy();
        });

        it('Method - addLib: should add library to target path', () => {
            const mockPathIdIdx = {};
            getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockPathIdIdx);
            getLibsSpy.mockReturnValue(mockRules[0].libs);

            dataHandle.addLib(mockRules, mockIdCtx, mockRule);
            const { libs } = mockRules[0];
            expect(libs.includes(mockRule)).toBeTruthy();
        });
    });

    describe('Remove', () => {
        const mockIdCtx: any = {};

        describe('Remove Single', () => {
            let getRuleIdxCtxFromIdCtxSpy: jest.SpyInstance;
            let getLibsSpy: jest.SpyInstance;

            beforeEach(() => {
                getRuleIdxCtxFromIdCtxSpy = jest.spyOn(dataHandle, 'getRuleIdxCtxFromIdCtx');
                getLibsSpy = jest.spyOn(dataHandle, 'getLibs');
            });

            it('Method - rmvHost: should remove host', () => {
                const mockIdxCtx = { hostIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataHandle.rmvHost(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(2);
                expect(mockRules[0].id).toBe('host-b');
            });

            it('Method - rmvPath: should remove path', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataHandle.rmvPath(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(3);
                expect(mockRules[1].paths.length).toBe(1);
                expect(mockRules[1].paths[0].id).toBe('path-b-1');
            });

            it('Method - rmvLib: should remove library', () => {
                const mockIdxCtx = { libIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);
                getLibsSpy.mockReturnValue(mockRules[0].libs);

                dataHandle.rmvLib(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(3);
                expect(mockRules[0].libs.length).toBe(0);
            });
        });

        describe('Remove Multiple', () => {
            beforeEach(() => {
                const mockPath: any = { libs: mockLibs };
                jest
                    .spyOn(dataHandle, 'getRuleFromIdCtx')
                    .mockReturnValue(mockPath);
            });

            it('Method - rmvHostsFromIds: Remove partial hosts from a list of host IDs', () => {
                const mockRules = [
                    { id: 'a' },
                    { id: 'b' }
                ] as HostRule[];
                const mockHostIds = ['a', 'c'];
                dataHandle.rmvHostsFromIds(mockRules, mockHostIds);
                expect(mockRules.length).toBe(1);
                expect(mockRules[0].id).toEqual('b');
            });

            it('Method - rmvPartialHosts: Remove partial hosts', () => {
                const mockSelectedRowKeyCtx = {
                    'host-b': true,
                    'host-c': true,
                    'host-not-exist': true,
                };
                dataHandle.rmvPartialHosts(mockRules, mockSelectedRowKeyCtx);
                expect(mockRules.length).toBe(1);
                expect(mockRules[0].id).toBe('host-a');
            });

            it('Method - rmvPartialLibs: Remove partial libaries', () => {
                const mockSelectedRowKeyCtx = {
                    'lib-c-0': true,
                    'lib-c-2': true,
                    'lib-not-exist': true,
                };
                dataHandle.rmvPartialLibs(mockRules, mockSelectedRowKeyCtx, mockIdCtx);
                expect(mockLibs.length).toBe(1);
                expect(mockLibs[0].id).toBe('lib-c-1');
            });
        });

        describe('Remove All', () => {
            const mockSliceIdxCtx = {
                startIdx: 1,
                endIdx: 3,
            };

            beforeEach(() => {
                const mockPath: any = { libs: mockLibs };
                jest
                    .spyOn(dataHandle, 'getRuleFromIdCtx')
                    .mockReturnValue(mockPath);
            });

            it('Method - rmvAllHosts: Remove all hosts', () => {
                dataHandle.rmvAllHosts(mockRules, mockSliceIdxCtx);
                expect(mockRules.length).toBe(1);
            });

            it('Method - rmvAllibs: Remove all libraries', () => {
                dataHandle.rmvAllLibs(
                    mockRules,
                    mockIdCtx
                );
                expect(mockLibs.length).toBe(0);
            });
        });
    });

    describe('Helper', () => {
        describe('Method - isMatchHost', () => {
            const mockHost = 'host';
            const mockInclHost = `some${mockHost}`;
            const mockIncorrectHost = '1234';
            const mockHostRule = new HostRule('lorem', mockHost);
            const mockProtocol = 'https';

            beforeEach(() => {
                spy.isMatchProtocol.mockReturnValue(true);
            });

            describe('When exact match is required', () => {
                it('should return true if it matches', () => {
                    expect(
                        dataHandle.isMatchHost(mockProtocol, mockHost, {
                            ...mockHostRule,
                            isExactMatch: true
                        })
                    ).toBeTruthy();
                });

                it('should return false if it doesnt matches', () => {
                    expect(
                        dataHandle.isMatchHost(mockProtocol, mockInclHost, {
                            ...mockHostRule,
                            isExactMatch: true
                        })
                    ).toBeFalsy();
                });
            });

            describe('When exact match is not required', () => {
                it('should return true if it matches', () => {
                    expect(
                        dataHandle.isMatchHost(mockProtocol, mockInclHost, {
                            ...mockHostRule,
                            isExactMatch: false,
                        })
                    ).toBeTruthy();
                });

                it('should return false if it doesnt matches', () => {
                    expect(
                        dataHandle.isMatchHost(mockProtocol, mockIncorrectHost, {
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
            const mockPathRule = new PathRule('lorem', mockPath);

            describe('When exact match is required', () => {
                it('should return true if it matches', () => {
                    expect(
                        dataHandle.isMatchPath(mockExactPath, {
                            ...mockPathRule,
                            isExactMatch: true
                        })
                    ).toBeTruthy();
                });

                it('should return false if it doesnt match', () => {
                    expect(
                        dataHandle.isMatchPath(mockInclPath, {
                            ...mockPathRule,
                            isExactMatch: true
                        })
                    ).toBeFalsy();
                });
            });

            describe('When exact match is not required', () => {
                it('should return true it matches', () => {
                    expect(
                        dataHandle.isMatchPath(mockInclPath, {
                            ...mockPathRule,
                            isExactMatch: false
                        })
                    ).toBeTruthy();
                });

                it('should return false it doesnt match', () => {
                    expect(
                        dataHandle.isMatchPath(mockIncorrectPath, {
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
                    dataHandle.isMatchProtocol('https', isHttps)
                ).toBeTruthy();

                expect(
                    dataHandle.isMatchProtocol('ftp', isHttps)
                ).toBeFalsy();
            });

            it('should return true if https is not specified', () => {
                expect(
                    dataHandle.isMatchProtocol('ftp', false)
                ).toBeTruthy();
            });
        });
    });
});
