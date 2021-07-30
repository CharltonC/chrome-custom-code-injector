import { dataCrudHandle } from './';
import { HostRuleConfig, LibRuleConfig } from '../../model/rule-config';
import { HandlerHelper } from '../../handle/app-state/helper';

jest.mock('../../handle/app-state/helper', () => ({
    HandlerHelper: {
        getPgnRowIdxCtx: () => ({})
    }
}));

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
                id: 'host-a'
            },
            {
                id: 'host-b' ,
                paths: [
                    { id: 'path-b-0' },
                    { id: 'path-b-1' },
                ]
            },
            {
                id: 'host-c' ,
                paths: [
                    {
                        id: 'path-c-0',
                        libs: mockLibs
                    },
                ]
            },
        ] as HostRuleConfig[];
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Getter', () => {
        describe('Method - getRuleIdxCtx: Get Rule index context from Id context', () => {
            it('should return rule index context when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const idxCtx = dataCrudHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 0,
                    pathIdx: null,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const idxCtx = dataCrudHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 1,
                    pathIdx: 0,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const idxCtx = dataCrudHandle.getRuleIdxCtxFromIdCtx(mockRules, mockIdCtx);
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
                const rule = dataCrudHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host index, path index exist', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                const rule = dataCrudHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return library when host index, path index, library index exist', () => {
                const mockIdxCtx = { hostIdx: 2, pathIdx: 0, libIdx: 0 };
                const rule = dataCrudHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
            });
        });

        describe('Method - getRuleFromIdCtx: Get Rule from id context', () => {
            it('should return host when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const rule = dataCrudHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const rule = dataCrudHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return library when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const rule = dataCrudHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
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
            getRuleFromIdCtxSpy = jest.spyOn(dataCrudHandle, 'getRuleFromIdCtx');
        });

        describe('Host/Path', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockHost);
            });

            it('Method - toggleJsExecStep: should toggle Js execution step', () => {
                const mockStep = 3;
                dataCrudHandle.toggleJsExecStep(mockRules, mockIdCtx, mockStep);
                expect(mockHost.jsExecPhase).toBe(mockStep);
            });

            it('Method - setLastActiveTab: should set the last active tab index', () => {
                const mockTabIdx = 3;
                dataCrudHandle.setLastActiveTab(mockRules, mockIdCtx, mockTabIdx);
                expect(mockHost.activeTabIdx).toBe(mockTabIdx);
            });

            it('Method - toggleJsSwitch: should toggle Js switch', () => {
                const val = mockHost.isJsOn;
                dataCrudHandle.toggleJsSwitch(mockRules, mockIdCtx);
                expect(mockHost.isJsOn).toBe(!val);
            });

            it('Method - toggleCssSwitch: should toggle Css switch', () => {
                const val = mockHost.isCssOn;
                dataCrudHandle.toggleCssSwitch(mockRules, mockIdCtx);
                expect(mockHost.isCssOn).toBe(!val);
            });

            it('Method - toggleLibSwitch: should toggle Library switch', () => {
                const val = mockHost.isLibOn;
                dataCrudHandle.toggleLibSwitch(mockRules, mockIdCtx);
                expect(mockHost.isLibOn).toBe(!val);
            });

            it('Method - setJsCode: should set the Js code', () => {
                const mockCode = 'lorem';
                dataCrudHandle.setJsCode(mockRules, mockIdCtx, mockCode);
                expect(mockHost.jsCode).toBe(mockCode);
            });

            it('Method - setCssCode: should set the Css code', () => {
                const mockCode = 'lorem';
                dataCrudHandle.setCssCode(mockRules, mockIdCtx, mockCode);
                expect(mockHost.cssCode).toBe(mockCode);
            });
        });

        describe('Library', () => {
            beforeEach(() => {
                getRuleFromIdCtxSpy.mockReturnValue(mockLib);
            });

            it('Method - toggleLibAsyncSwitch: should toggle Library Async switch', () => {
                const val = mockLib.isAsync;
                dataCrudHandle.toggleLibAsyncSwitch(mockRules, mockIdCtx);
                expect(mockLib.isAsync).toBe(!val);
            });

            it('Method - toggleLibIsOnSwitch: should toggle Library enable switch', () => {
                const val = mockLib.isOn;
                dataCrudHandle.toggleLibIsOnSwitch(mockRules, mockIdCtx);
                expect(mockLib.isOn).toBe(!val);
            });
        });
    });

    describe('Remove', () => {
        const mockIdCtx: any = {};

        describe('Remove Single', () => {
            let getRuleIdxCtxFromIdCtxSpy: jest.SpyInstance;

            beforeEach(() => {
                getRuleIdxCtxFromIdCtxSpy = jest.spyOn(dataCrudHandle, 'getRuleIdxCtxFromIdCtx');
            });

            it('Method - rmvHost: should remove host', () => {
                const mockIdxCtx = { hostIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataCrudHandle.rmvHost(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(2);
                expect(mockRules[0].id).toBe('host-b');
            });

            it('Method - rmvPath: should remove path', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataCrudHandle.rmvPath(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(3);
                expect(mockRules[1].paths.length).toBe(1);
                expect(mockRules[1].paths[0].id).toBe('path-b-1');
            });

            it('Method - rmvLib: should remove library', () => {
                const mockIdxCtx = { hostIdx: 2, pathIdx: 0, libIdx: 0 };
                getRuleIdxCtxFromIdCtxSpy.mockReturnValue(mockIdxCtx);

                dataCrudHandle.rmvLib(mockRules, mockIdCtx);
                expect(mockRules.length).toBe(3);
                expect(mockRules[2].paths[0].libs.length).toBe(2);
                expect(mockRules[2].paths[0].libs[0].id).toBe('lib-c-1');
            });
        });

        describe('Remove Multiple', () => {
            beforeEach(() => {
                const mockPath: any = { libs: mockLibs };
                jest
                    .spyOn(dataCrudHandle, 'getRuleFromIdCtx')
                    .mockReturnValue(mockPath);
            });

            it('Method - rmvPartialHosts: Remove partial hosts', () => {
                const mockSelectedRowKeyCtx = {
                    'host-b': true,
                    'host-c': true,
                };
                dataCrudHandle.rmvPartialHosts(mockRules, mockSelectedRowKeyCtx);
                expect(mockRules.length).toBe(1);
                expect(mockRules[0].id).toBe('host-a');
            });

            it('Method - rmvPartialLibs: Remove partial libaries', () => {
                const mockSelectedRowKeyCtx = {
                    'lib-c-0': true,
                    'lib-c-2': true,
                };
                dataCrudHandle.rmvPartialLibs(mockRules, mockSelectedRowKeyCtx, mockIdCtx);
                expect(mockLibs.length).toBe(1);
                expect(mockLibs[0].id).toBe('lib-c-1');
            });
        });

        describe('Remove All', () => {
            beforeEach(() => {
                const mockPath: any = { libs: mockLibs };
                const mockPaginationCtx: any = {
                    startRowIdx: 1,
                    endRowIdx: 3,
                };
                jest
                    .spyOn(dataCrudHandle, 'getRuleFromIdCtx')
                    .mockReturnValue(mockPath);
                jest
                    .spyOn(HandlerHelper, 'getPgnRowIdxCtx')
                    .mockReturnValue(mockPaginationCtx);
            });

            it('Method - rmvAllHosts: Remove all hosts', () => {
                dataCrudHandle.rmvAllHosts(mockRules, null, null);
                expect(mockRules.length).toBe(1);
            });

            it('Method - rmvAllibs: Remove all libraries', () => {
                const mockIdCtx: any = {};
                dataCrudHandle.rmvAllLibs(
                    mockRules,
                    null,
                    null,
                    mockIdCtx
                );
                expect(mockLibs.length).toBe(1);
            });
        });
    });
});
