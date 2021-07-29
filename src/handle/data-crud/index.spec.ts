import { DataCrudHandle } from './';
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
                const idxCtx = DataCrudHandle.getRuleIdxCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 0,
                    pathIdx: null,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const idxCtx = DataCrudHandle.getRuleIdxCtx(mockRules, mockIdCtx);
                expect(idxCtx).toEqual({
                    hostIdx: 1,
                    pathIdx: 0,
                    libIdx: null,
                });
            });

            it('should return rule index context when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const idxCtx = DataCrudHandle.getRuleIdxCtx(mockRules, mockIdCtx);
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
                const rule = DataCrudHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host index, path index exist', () => {
                const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
                const rule = DataCrudHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return library when host index, path index, library index exist', () => {
                const mockIdxCtx = { hostIdx: 2, pathIdx: 0, libIdx: 0 };
                const rule = DataCrudHandle.getRuleFromIdxCtx(mockRules, mockIdxCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
            });
        });

        describe('Method - getRuleFromIdCtx: Get Rule from id context', () => {
            it('should return host when host id exists', () => {
                const mockIdCtx = { hostId: 'host-a' };
                const rule = DataCrudHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[0]);
            });

            it('should return path when host id and path id exist', () => {
                const mockIdCtx = { hostId: 'host-b', pathId: 'path-b-0' };
                const rule = DataCrudHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[1].paths[0]);
            });

            it('should return library when host id, path id, library id exist', () => {
                const mockIdCtx = { hostId: 'host-c', pathId: 'path-c-0', libId: 'lib-c-0' };
                const rule = DataCrudHandle.getRuleFromIdCtx(mockRules, mockIdCtx);
                expect(rule).toBe(mockRules[2].paths[0].libs[0]);
            });
        });
    });

    describe('Toggle/Set', () => {
        let mockHost: HostRuleConfig;
        let mockLib: LibRuleConfig;

        beforeEach(() => {
            mockHost = new HostRuleConfig('title', 'value');
            mockLib = new LibRuleConfig('title', 'value');
        });

        it('Method - toggleJsExecStep: should toggle Js execution step', () => {
            const mockStep = 3;
            DataCrudHandle.toggleJsExecStep(mockHost, mockStep);
            expect(mockHost.jsExecPhase).toBe(mockStep);
        });

        it('Method - setLastActiveTab: should set the last active tab index', () => {
            const mockTabIdx = 3;
            DataCrudHandle.setLastActiveTab(mockHost, mockTabIdx);
            expect(mockHost.activeTabIdx).toBe(mockTabIdx);
        });

        it('Method - toggleJsSwitch: should toggle Js switch', () => {
            const val = mockHost.isJsOn;
            DataCrudHandle.toggleJsSwitch(mockHost);
            expect(mockHost.isJsOn).toBe(!val);
        });

        it('Method - toggleCssSwitch: should toggle Css switch', () => {
            const val = mockHost.isCssOn;
            DataCrudHandle.toggleCssSwitch(mockHost);
            expect(mockHost.isCssOn).toBe(!val);
        });

        it('Method - toggleLibSwitch: should toggle Library switch', () => {
            const val = mockHost.isLibOn;
            DataCrudHandle.toggleLibSwitch(mockHost);
            expect(mockHost.isLibOn).toBe(!val);
        });

        it('Method - setJsCode: should set the Js code', () => {
            const mockCode = 'lorem';
            DataCrudHandle.setJsCode(mockHost, mockCode);
            expect(mockHost.jsCode).toBe(mockCode);
        });

        it('Method - setCssCode: should set the Css code', () => {
            const mockCode = 'lorem';
            DataCrudHandle.setCssCode(mockHost, mockCode);
            expect(mockHost.cssCode).toBe(mockCode);
        });

        it('Method - toggleLibAsyncSwitch: should toggle Library Async switch', () => {
            const val = mockLib.isAsync;
            DataCrudHandle.toggleLibAsyncSwitch(mockLib);
            expect(mockLib.isAsync).toBe(!val);
        });

        it('Method - toggleLibIsOnSwitch: should toggle Library enable switch', () => {
            const val = mockLib.isOn;
            DataCrudHandle.toggleLibIsOnSwitch(mockLib);
            expect(mockLib.isOn).toBe(!val);
        });
    });

    describe('Remove Single', () => {
        let getRuleIdxCtxSpy: jest.SpyInstance;
        const mockIdCtx: any = {};

        beforeEach(() => {
            getRuleIdxCtxSpy = jest.spyOn(DataCrudHandle, 'getRuleIdxCtx');
        });

        it('Method - rmvHost: should remove host', () => {
            const mockIdxCtx = { hostIdx: 0 };
            getRuleIdxCtxSpy.mockReturnValue(mockIdxCtx);

            DataCrudHandle.rmvHost(mockRules, mockIdCtx);
            expect(mockRules.length).toBe(2);
            expect(mockRules[0].id).toBe('host-b');
        });

        it('Method - rmvPath: should remove path', () => {
            const mockIdxCtx = { hostIdx: 1, pathIdx: 0 };
            getRuleIdxCtxSpy.mockReturnValue(mockIdxCtx);

            DataCrudHandle.rmvPath(mockRules, mockIdCtx);
            expect(mockRules.length).toBe(3);
            expect(mockRules[1].paths.length).toBe(1);
            expect(mockRules[1].paths[0].id).toBe('path-b-1');
        });

        it('Method - rmvLib: should remove library', () => {
            const mockIdxCtx = { hostIdx: 2, pathIdx: 0, libIdx: 0 };
            getRuleIdxCtxSpy.mockReturnValue(mockIdxCtx);

            DataCrudHandle.rmvLib(mockRules, mockIdCtx);
            expect(mockRules.length).toBe(3);
            expect(mockRules[2].paths[0].libs.length).toBe(2);
            expect(mockRules[2].paths[0].libs[0].id).toBe('lib-c-1');
        });
    });

    describe('Remove Multiple', () => {
        it('Method - rmvPartialHosts: Remove partial hosts', () => {
            const mockSelectedRowKeyCtx = {
                'host-b': true,
                'host-c': true,
            };
            DataCrudHandle.rmvPartialHosts(mockRules, mockSelectedRowKeyCtx);

            expect(mockRules.length).toBe(1);
            expect(mockRules[0].id).toBe('host-a');
        });

        it('Method - rmvPartialLibs: Remove partial libaries', () => {
            const mockSelectedRowKeyCtx = {
                'lib-c-0': true,
                'lib-c-2': true,
            };
            DataCrudHandle.rmvPartialLibs(mockLibs, mockSelectedRowKeyCtx);

            expect(mockLibs.length).toBe(1);
            expect(mockLibs[0].id).toBe('lib-c-1');
        });
    });

    describe('Remove All', () => {
        const mockDataGridState: any = {};

        beforeEach(() => {
            const mockPaginationCtx: any = {
                startRowIdx: 1,
                endRowIdx: 3,
            };
            jest
                .spyOn(HandlerHelper, 'getPgnRowIdxCtx')
                .mockReturnValue(mockPaginationCtx);
        });

        it('Method - rmvAllHosts: Remove all hosts', () => {
            DataCrudHandle.rmvAllHosts(mockRules, mockDataGridState);
            expect(mockRules.length).toBe(1);
        });

        it('Method - rmvAllibs: Remove all libraries', () => {
            DataCrudHandle.rmvAllLibs(mockLibs, mockDataGridState);
            expect(mockLibs.length).toBe(1);
        });
    });
});
