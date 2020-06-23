import { TClpsShowTarget, IUserRowConfig, IRowConfig, IItemsReq } from './type';
import { ClpsHandle, ClpsConfig } from './';

describe('Service - Collapse Handle', () => {
    const { isNestedOpen, getRowCtx, getValidatedData, parseRowConfig, isGteZeroInt } = ClpsHandle.prototype;
    let handle: ClpsHandle;
    let getMappedItemsSpy: jest.SpyInstance;
    let getValidatedDataSpy: jest.SpyInstance;
    let parseRowConfigSpy: jest.SpyInstance;
    let getRowCtxSpy: jest.SpyInstance;
    let getNestedMappedItemsSpy: jest.SpyInstance;
    let isNestedOpenSpy: jest.SpyInstance;

    beforeEach(() => {
        handle = new ClpsHandle();
        getMappedItemsSpy = jest.spyOn(handle, 'getMappedItems');
        parseRowConfigSpy = jest.spyOn(handle, 'parseRowConfig');
        getRowCtxSpy = jest.spyOn(handle, 'getRowCtx');
        getValidatedDataSpy = jest.spyOn(handle, 'getValidatedData');
        getNestedMappedItemsSpy = jest.spyOn(handle, 'getNestedMappedItems');
        isNestedOpenSpy = jest.spyOn(handle, 'isNestedOpen');
    });

    describe('Property - defClpsConfig: Default Collapse User Option', () => {
        it('should have default values', () => {
            expect(handle.defClpsConfig).toEqual({
                data: [],
                rowConfigs: [],
                showTargetCtx: 'ALL'
            });
        });
    });

    describe('Property - Builtin Regex', () => {
        it('should test against item context', () => {
            const { ctxPattern } = handle;

            expect(ctxPattern.test('')).toBe(false);
            expect(ctxPattern.test('0')).toBe(true);
            expect(ctxPattern.test('0/key:1')).toBe(true);
            expect(ctxPattern.test('0/key:1/key')).toBe(true);
        });

        it('should test against the capture groups in item context', () => {
            const { ctxCapPattern } = handle;
            const [ fullCap, keyGrpCap, keyCap, indexCap ] = 'key:1'.match(ctxCapPattern);
            expect(fullCap).toBe('key:1');
            expect(keyGrpCap).toBe('key:');
            expect(keyCap).toBe('key');
            expect(indexCap).toBe('1');
        });
    });

    describe('Method - getClpsState: Get Collapse state based on User`s Collapse config/option', () => {
        const mockMappedItems: any[] = [];

        beforeEach(() => {
            getMappedItemsSpy.mockReturnValue(mockMappedItems);
        });

        it('should return falsy value if the config is invalid', () => {
            getValidatedDataSpy.mockReturnValue(null);

            expect(handle.getClpsState()).toBeFalsy();
            expect(getValidatedDataSpy).toHaveBeenCalledWith([]);
            expect(getMappedItemsSpy).not.toHaveBeenCalled();
        });

        it('should return mapped items if the config is valid', () => {
            getValidatedDataSpy.mockReturnValue([]);

            expect(handle.getClpsState()).toBe(mockMappedItems);
            expect(getValidatedDataSpy).toHaveBeenCalledWith([]);
            expect(getMappedItemsSpy).toHaveBeenCalledWith({
                ...handle.defClpsConfig,
                rowLvl: 0,
                prevItemCtx: ''
            });
        });
    });

    describe('Method - getMappedItems: Get mapped items based on the row configs provided', () => {
        const mockData: any[] = [ {text: 'a'}];
        const mockTransformFn: jest.Mock = jest.fn();
        const mockRowConfigs: IRowConfig = { rowKey: '', transformFn: mockTransformFn };
        const mockItemsReq: IItemsReq = {
            data: mockData,
            rowConfigs: [],
            rowLvl: 0,
            prevItemCtx: '',
            showTargetCtx: []
        };

        const mockItemCtx: string = 'itemCtx';
        const mockIsOpen: boolean = false;
        const mockTransformResult: any = {};

        beforeEach(() => {
            mockTransformFn.mockReturnValue(mockTransformResult);
            getRowCtxSpy.mockReturnValue(mockItemCtx);
            isNestedOpenSpy.mockReturnValue(mockIsOpen);
        });

        it('should return mapped items when transform function is provided and there are nested items', () => {
            const mockNestedItems: any[] = null;
            parseRowConfigSpy.mockReturnValue(mockRowConfigs);
            getNestedMappedItemsSpy.mockReturnValue(mockNestedItems);

            expect(handle.getMappedItems(mockItemsReq)).toEqual([mockTransformResult]);
            expect(isNestedOpenSpy).not.toHaveBeenCalled();
            expect(parseRowConfigSpy).toHaveBeenCalledWith(mockItemsReq.rowConfigs[0], mockItemsReq.rowLvl);
            expect(getRowCtxSpy).toHaveBeenCalledWith(0, '', mockItemsReq.prevItemCtx);
            expect(getNestedMappedItemsSpy).toHaveBeenCalledWith({
                ...mockItemsReq,
                data: mockData[0],
                rowLvl: mockItemsReq.rowLvl + 1,
                prevItemCtx: mockItemCtx
            });
            expect(mockTransformFn).toHaveBeenCalledWith({
                idx: 0,
                item: mockData[0],
                itemCtx: mockItemCtx,
                nestedItems: mockNestedItems,
                isNestedOpen: mockIsOpen
            });
        });

        it('should return mapped items when transform function is not provided and there is no nested items', () => {
            const mockNestedItems: any[] = [];
            parseRowConfigSpy.mockReturnValue({...mockRowConfigs, transformFn: null});
            getNestedMappedItemsSpy.mockReturnValue(mockNestedItems);

            expect(handle.getMappedItems({...mockItemsReq})).toEqual([{
                idx: 0,
                item: mockData[0],
                itemCtx: mockItemCtx,
                nestedItems: mockNestedItems,
                isNestedOpen: mockIsOpen
            }]);
            expect(isNestedOpenSpy).toHaveBeenCalledWith(mockItemCtx, mockItemsReq.showTargetCtx);
            expect(mockTransformFn).not.toHaveBeenCalled();
        });
    });

    describe('Method - isNestedOpen: Check if a row should open/collapse its nested rows', () => {
        describe('when show target context is an array of contexts', () => {
            const mockShowTargetCtx: TClpsShowTarget = [ 'a', 'a/b' ];

            it('should return false if row context is not found in the show target context', () => {
                expect(isNestedOpen('a/b/c', mockShowTargetCtx)).toBe(false);
            });

            it('should return true if row context is found in the show target context', () => {
                expect(isNestedOpen('a/b', mockShowTargetCtx)).toBe(true);
            });
        });

        describe('when show target context is `ALL` or `NONE`', () => {
            it('should return true if show target context is show all', () => {
                expect(isNestedOpen('', 'ALL')).toBe(true);
            });

            it('should return false if show target context is show none', () => {
                expect(isNestedOpen('', 'NONE')).toBe(false);
            });
        });
    });

    describe('Method - getRowCtx: Get Context for current Row', () => {
        const mockRowKey: string = 'key';
        const mockRowIdx: number = 0;
        const mockPrefixCtx: string = 'prefix';

        it('should return row context', () => {
            expect(getRowCtx(mockRowIdx, null, null)).toBe(`${mockRowIdx}`);
            expect(getRowCtx(mockRowIdx, null, mockPrefixCtx)).toBe(`${mockPrefixCtx}/${mockRowIdx}`);
            expect(getRowCtx(mockRowIdx, mockRowKey, null)).toBe(`${mockRowKey}:${mockRowIdx}`);
            expect(getRowCtx(mockRowIdx, mockRowKey, mockPrefixCtx)).toBe(`${mockPrefixCtx}/${mockRowKey}:${mockRowIdx}`);
        });
    });

    describe('Method - getValidatedData: Validate data and row config to determine if it can be proceed or not', () => {
        const mockRowKey: string = 'lorem';
        const mockTransformFn: jest.Mock = jest.fn();
        const mockConfig: IUserRowConfig = [ mockRowKey, mockTransformFn ];

        describe('when data is an array', () => {
            const mockEmptyDataAry: any[] = [];
            const mockDataAry: any[] = [1,2];

            it('should return null if data has no items', () => {
                expect(getValidatedData(mockEmptyDataAry)).toBe(null);
            });

            it('should return the data itself if data has items', () => {
                expect(getValidatedData(mockDataAry)).toBe(mockDataAry);
            });
        });

        describe('when data is an object', () => {
            const mockNestedData: any[] = [1,2];
            const mockDataObj: Record<string, any> = {[mockRowKey]: mockNestedData};

            it('should return null if config doesnt exist, or `rowkey` in config doesnt exist, or `rowKey` is empty', () => {
                expect(getValidatedData(mockDataObj, null)).toBe(null);
                expect(getValidatedData(mockDataObj, [] as any)).toBe(null);
                expect(getValidatedData(mockDataObj, [ '' ])).toBe(null);
            });

            it('should return null if data`s property value is not an array or an empty array', () => {
                expect(getValidatedData({}, mockConfig)).toBe(null);
                expect(getValidatedData({[mockRowKey]: ''}, mockConfig)).toBe(null);
                expect(getValidatedData({[mockRowKey]: []}, mockConfig)).toBe(null);
            });

            it('should return the nested data if `rowkey` exist in config and data`s property value is not an empty array', () => {
                expect(getValidatedData(mockDataObj, mockConfig)).toBe(mockNestedData);
            });
        });

    });

    describe('Method - getNestedMappedItems: Get Nested Mapped Items', () => {
        const mockMappedItems: any[] = [];
        const mockNestedData: any[] = [1,2];
        const mockNestedKey: string = 'prop';
        const mockItemsReq: IItemsReq = {
            data: {[mockNestedKey]: mockNestedData},
            rowConfigs: [[mockNestedKey]],
            rowLvl: 0,
            prevItemCtx: '',
            showTargetCtx: []
        };

        beforeEach(() => {
            getMappedItemsSpy.mockReturnValue(mockMappedItems);
        });

        it('should return mapped items when mapping is valid', () => {
            getValidatedDataSpy.mockReturnValue(mockNestedData);

            expect(handle.getNestedMappedItems(mockItemsReq)).toBe(mockMappedItems);
            expect(getValidatedDataSpy).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rowConfigs[0]
            );
            expect(getMappedItemsSpy).toHaveBeenCalledWith({
                ...mockItemsReq,
                data: mockNestedData
            });
        });

        it('should return null when mapping is not valid', () => {
            getValidatedDataSpy.mockReturnValue(null);

            expect(handle.getNestedMappedItems(mockItemsReq)).toBe(null);
            expect(getValidatedDataSpy).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rowConfigs[0]
            );
            expect(getMappedItemsSpy).not.toHaveBeenCalled();
        });
    });

    describe('Method - parseRowConfig: Parse the row config depending on the row level index', () => {
        it('should parse the row config when row level index is 0', () => {
            expect(parseRowConfig([], 0)).toEqual({
                rowKey: '',
                transformFn: null
            });

            const mockTransformFn: jest.Mock = jest.fn();
            expect(parseRowConfig([mockTransformFn], 0)).toEqual({
                rowKey: '',
                transformFn: mockTransformFn
            });
        });

        it('should parse the row config when row level index is greater than 0', () => {
            expect(parseRowConfig([], 1)).toEqual({
                rowKey: null,
                transformFn: null
            });

            const mockRowKey: string = 'lorem';
            const mockTransformFn: jest.Mock = jest.fn();
            expect(parseRowConfig([mockRowKey, mockTransformFn], 1)).toEqual({
                rowKey: mockRowKey,
                transformFn: mockTransformFn
            });
        });
    });

    describe('Method - findItemInData: Find an item based on its context in an data array', () => {
        const mockData: any[] = [{key: ['a', 'b']}];

        describe('invalid data or item context pattern', () => {
            it('should return falsy value when data has no items or when item context is empty', () => {
                expect(handle.findItemInData([], '0/key:0')).toBeFalsy();
                expect(handle.findItemInData(mockData, '')).toBeFalsy();
            });

            it('should return falsy value when the item context pattern does not match', () => {
                expect(handle.findItemInData(mockData, '/')).toBeFalsy();
                expect(handle.findItemInData(mockData, '..')).toBeFalsy();
            });
        });

        describe('valid data and item context pattern', () => {
            it('should return falsy value when data has no matched item and an error was found during the process', () => {
                expect(handle.findItemInData(mockData, '1')).toBeFalsy();
                expect(handle.findItemInData(mockData, '0/key:0/key:0')).toBeFalsy();
                expect(handle.findItemInData(mockData, '0/key:2')).toBeFalsy();
            });

            it('should return the item when data has matched item', () => {
                expect(handle.findItemInData(mockData, '0')).toBe(mockData[0]);
                expect(handle.findItemInData(mockData, '0/key')).toEqual(mockData[0].key);
                expect(handle.findItemInData(mockData, '0/key:0')).toBe('a');
                expect(handle.findItemInData(mockData, '0/key:1')).toBe('b');
            });
        });
    });

    describe('Method - isGteZeroInt: Check if a number is an integer greater than and equal to 0', () => {
        it('should return true if it is integer gte 0', () => {
            expect(isGteZeroInt(0)).toBe(true);
        });

        it('should return false if it is not integer or not gte 0', () => {
            expect(isGteZeroInt(-1)).toBe(false);
            expect(isGteZeroInt(1.11)).toBe(false);
        });
    });

});