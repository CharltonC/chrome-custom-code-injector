import { dataManager } from '.';
import { HostRuleConfig, LibRuleConfig } from '../model/rule-config';

describe('Data Crud Handle', () => {
    let mockRules: HostRuleConfig[];
    let mockLibs: LibRuleConfig[];

    beforeEach(() => {
        mockLibs = [
            { id: 'lib-c-0' },
            { id: 'lib-c-1' },
            { id: 'lib-c-2' }
        ] as LibRuleConfig[];

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
        ] as HostRuleConfig[];
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Getter', () => {
        describe('Method - getRuleIdxCtxFromIdCtx: Get Rule index context from Id context', () => {
            it('should return rule index context when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const idxCtx = dataManager.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 0,
                    pathIdx: null,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const idxCtx = dataManager.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 1,
                    pathIdx: 0,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id and library id exist', () => {
                const mockIdCtx = { hostId: 'host-a', libId: 'lib-a-0' };
                const idxCtx = dataManager.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 0,
                    pathIdx: null,
                    libIdx: 0,
                });
            });

            it('should return rule index context when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const idxCtx = dataManager.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
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
                const rule = dataManager.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host index and path index exist', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                const rule = dataManager.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return library when host index and library index exist', () => {
                const mockIdxCtx = { hostIdx: 0, libIdx: 0 };
                const rule = dataManager.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[0].libs[0]);
            });

            it('should return library when host index, path index, library index exist', () => {
                const mockIdxCtx = { hostIdx: 2, pathIdx: 0, libIdx: 0 };
                const rule = dataManager.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
            });
        });

        describe('Method - getRuleFromIdCtx: Get Rule from id context', () => {
            it('should return host when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const rule = dataManager.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const rule = dataManager.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return path when host id and library id exist', () => {
                const mockIdCtx = { hostId: 'host-a', libId: 'lib-a-0' };
                const rule = dataManager.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[0].libs[0]);
            });

            it('should return library when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const rule = dataManager.getRuleFromIdCtx(mockRules, mockIdCtx);
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
            ] as HostRuleConfig[];

            it('should return unfiltered rules when text is empty or is whitespace', () => {
                expect(dataManager.getFilteredRules(mockRules, '')).toBe(mockRules);
                expect(dataManager.getFilteredRules(mockRules, ' ')).toBe(mockRules);
            });

            it('should return filtered rules if text is not empty', () => {
                expect(dataManager.getFilteredRules(mockRules, 'host-title-1')).toEqual([ mockRules[0] ]);
                expect(dataManager.getFilteredRules(mockRules, 'host-value-1')).toEqual([ mockRules[0] ]);
                expect(dataManager.getFilteredRules(mockRules, 'path-title-1')).toEqual([ mockRules[0] ]);
                expect(dataManager.getFilteredRules(mockRules, 'path-value-1')).toEqual([ mockRules[0] ]);
                expect(dataManager.getFilteredRules(mockRules, ' path-value-1 ')).toEqual([ mockRules[0] ]);
            });

            it('should return filter rules if text has uppercase characters', () => {
                expect(dataManager.getFilteredRules(mockRules, 'HOST-TITLE-1')).toEqual([ mockRules[0] ]);
            });

            it('should return filtered rules when text is space separated string', () => {
                expect(dataManager.getFilteredRules(mockRules, 'abc path-title-1')).toEqual([ mockRules[0] ]);
            });

            it('should return empty rules when there is not match', () => {
                expect(dataManager.getFilteredRules(mockRules, 'lorem')).toEqual([]);
            });
        });

        describe('Method - getLibs: Get Libraries from either a host or path', () => {
            let mockHost;

            beforeEach(() => {
                mockHost = mockRules[2];
            });

            it('should return host libraries of a host when path index is not provide', () => {
                const libs = dataManager.getLibs(mockHost);
                expect(libs[0].id).toBe('host-lib-c-0');
            });

            it('should return path libraries of a path when path index is provided', () => {
                const libs = dataManager.getLibs(mockHost, 0);
                expect(libs[0].id).toBe('lib-c-0');
            });
        });
    });

    describe('Toggle/Set', () => {
        let mockHost: HostRuleConfig;
        let mockLib: LibRuleConfig;
        let getRuleFromIdCtxSpy: jest.SpyInstance;
        const mockIdCtx: any = {};

        beforeEach(() => {
            mockHost = new HostRuleConfig('title', 'value');
            mockLib = new LibRuleConfig('title', 'value');
            getRuleFromIdCtxSpy = jest.spyOn(dataManager, 'getRuleFromIdCtx');
        });

        describe('Host/Path/Library', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockHost);
            });

            it('Method - setProps: should set multiple properties', () => {
                const mockTitle = 'lorem';
                const mockValue = 'sum';
                dataManager.setProps(mockRules, mockIdCtx, {
                    title: mockTitle,
                    value: mockValue
                });
                expect(mockHost.title).toBe(mockTitle);
                expect(mockHost.value).toBe(mockValue);
            });

            it('Method - setTitle: should set title', () => {
                const mockTitle = 'title';
                dataManager.setTitle(mockRules, mockIdCtx, mockTitle);
                expect(mockHost.title).toBe(mockTitle);
            });

            it('Method - setValue: should set value', () => {
                const mockValue = 'value';
                dataManager.setValue(mockRules, mockIdCtx, mockValue);
                expect(mockHost.value).toBe(mockValue);
            });
        });

        describe('Host/Path', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockHost);
            });

            it('Method - toggleHttpsSwitch: should toggle Https switch ', () => {
                const val = mockHost.isHttps;
                dataManager.toggleHttpsSwitch(mockRules, mockIdCtx);
                expect(mockHost.isHttps).toBe(!val);
            });

            it('Method - toggleRegexSwitch: should toggle Regex switch ', () => {
                const val = mockHost.isRegex;
                dataManager.toggleRegexSwitch(mockRules, mockIdCtx);
                expect(mockHost.isRegex).toBe(!val);
            });

            it('Method - toggleJsExecStep: should toggle Js execution step', () => {
                const mockStep = 3;
                dataManager.toggleJsExecStep(mockRules, mockIdCtx, mockStep);
                expect(mockHost.jsExecPhase).toBe(mockStep);
            });

            it('Method - setLastActiveTab: should set the last active tab index', () => {
                const mockTabIdx = 3;
                dataManager.setLastActiveTab(mockRules, mockIdCtx, mockTabIdx);
                expect(mockHost.activeTabIdx).toBe(mockTabIdx);
            });

            it('Method - toggleJsSwitch: should toggle Js switch', () => {
                const val = mockHost.isJsOn;
                dataManager.toggleJsSwitch(mockRules, mockIdCtx);
                expect(mockHost.isJsOn).toBe(!val);
            });

            it('Method - toggleCssSwitch: should toggle Css switch', () => {
                const val = mockHost.isCssOn;
                dataManager.toggleCssSwitch(mockRules, mockIdCtx);
                expect(mockHost.isCssOn).toBe(!val);
            });

            it('Method - toggleLibSwitch: should toggle Library switch', () => {
                const val = mockHost.isLibOn;
                dataManager.toggleLibSwitch(mockRules, mockIdCtx);
                expect(mockHost.isLibOn).toBe(!val);
            });

            it('Method - setJsCode: should set the Js code', () => {
                const mockCode = 'lorem';
                dataManager.setJsCode(mockRules, mockIdCtx, mockCode);
                expect(mockHost.jsCode).toBe(mockCode);
            });

            it('Method - setCssCode: should set the Css code', () => {
                const mockCode = 'lorem';
                dataManager.setCssCode(mockRules, mockIdCtx, mockCode);
                expect(mockHost.cssCode).toBe(mockCode);
            });
        });

        describe('Library', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockLib);
            });

            it('Method - toggleLibAsyncSwitch: should toggle Library Async switch', () => {
                const val = mockLib.isAsync;
                dataManager.toggleLibAsyncSwitch(mockRules, mockIdCtx);
                expect(mockLib.isAsync).toBe(!val);
            });

            it('Method - toggleLibIsOnSwitch: should toggle Library enable switch', () => {
                const val = mockLib.isOn;
                dataManager.toggleLibIsOnSwitch(mockRules, mockIdCtx);
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
            getRuleIdxCtxFromIdCtxSpy = jest.spyOn(dataManager, 'getRuleIdxCtxFromIdCtx');
            getLibsSpy = jest.spyOn(dataManager, 'getLibs');
        });

        it('Method - addHost: should add host to rules', () => {
            dataManager.addHost(mockRules, mockRule);
            expect(mockRules.includes(mockRule)).toBeTruthy();
        });

        it('Method - addPath: should add path to target host', () => {
            const mockHostIdx = 1;
            const mockHostIdCtx = { hostIdx: mockHostIdx };
            getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockHostIdCtx);

            dataManager.addPath(mockRules, mockIdCtx, mockRule);
            const { paths } = mockRules[mockHostIdx];
            expect(paths.includes(mockRule)).toBeTruthy();
        });

        it('Method - addLib: should add library to target path', () => {
            const mockPathIdIdx = {};
            getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockPathIdIdx);
            getLibsSpy.mockReturnValue(mockRules[0].libs);

            dataManager.addLib(mockRules, mockIdCtx, mockRule);
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
                getRuleIdxCtxFromIdCtxSpy = jest.spyOn(dataManager, 'getRuleIdxCtxFromIdCtx');
                getLibsSpy = jest.spyOn(dataManager, 'getLibs');
            });

            it('Method - rmvHost: should remove host', () => {
                const mockIdxCtx = { hostIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataManager.rmvHost(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(2);
                expect(mockRules[0].id).toBe('host-b');
            });

            it('Method - rmvPath: should remove path', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataManager.rmvPath(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(3);
                expect(mockRules[1].paths.length).toBe(1);
                expect(mockRules[1].paths[0].id).toBe('path-b-1');
            });

            it('Method - rmvLib: should remove library', () => {
                const mockIdxCtx = { libIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);
                getLibsSpy.mockReturnValue(mockRules[0].libs);

                dataManager.rmvLib(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(3);
                expect(mockRules[0].libs.length).toBe(0);
            });
        });

        describe('Remove Multiple', () => {
            beforeEach(() => {
                const mockPath: any = { libs: mockLibs };
                jest
                    .spyOn(dataManager, 'getRuleFromIdCtx')
                    .mockReturnValue(mockPath);
            });

            it('Method - rmvHostsFromIds: Remove partial hosts from a list of host IDs', () => {
                const mockRules = [
                    { id: 'a' },
                    { id: 'b' }
                ] as HostRuleConfig[];
                const mockHostIds = ['a', 'c'];
                dataManager.rmvHostsFromIds(mockRules, mockHostIds);
                expect(mockRules.length).toBe(1);
                expect(mockRules[0].id).toEqual('b');
            });

            it('Method - rmvPartialHosts: Remove partial hosts', () => {
                const mockSelectedRowKeyCtx = {
                    'host-b': true,
                    'host-c': true,
                    'host-not-exist': true,
                };
                dataManager.rmvPartialHosts(mockRules, mockSelectedRowKeyCtx);
                expect(mockRules.length).toBe(1);
                expect(mockRules[0].id).toBe('host-a');
            });

            it('Method - rmvPartialLibs: Remove partial libaries', () => {
                const mockSelectedRowKeyCtx = {
                    'lib-c-0': true,
                    'lib-c-2': true,
                    'lib-not-exist': true,
                };
                dataManager.rmvPartialLibs(mockRules, mockSelectedRowKeyCtx, mockIdCtx);
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
                    .spyOn(dataManager, 'getRuleFromIdCtx')
                    .mockReturnValue(mockPath);
            });

            it('Method - rmvAllHosts: Remove all hosts', () => {
                dataManager.rmvAllHosts(mockRules, mockSliceIdxCtx);
                expect(mockRules.length).toBe(1);
            });

            it('Method - rmvAllibs: Remove all libraries', () => {
                dataManager.rmvAllLibs(
                    mockRules,
                    mockIdCtx
                );
                expect(mockLibs.length).toBe(0);
            });
        });
    });
});
