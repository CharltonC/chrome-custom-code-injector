import { TClpsShowTarget, IUserRowConfig, IRowConfig, IItemsReq } from './type';
import { ClpsHandle } from './';

describe('Service - Collapse Handle', () => {
    const { isNestedOpen, getRowCtx, validateMapping, parseRowConfig, isGteZeroInt } = ClpsHandle.prototype;
    let handle: ClpsHandle;
    let getMappedItemsSpy: jest.SpyInstance;
    let validateMappingSpy: jest.SpyInstance;
    let parseRowConfigSpy: jest.SpyInstance;
    let getRowCtxSpy: jest.SpyInstance;
    let getNestedMappedItemsSpy: jest.SpyInstance;
    let isNestedOpenSpy: jest.SpyInstance;
    let findItemInDataSpy: jest.SpyInstance;

    beforeEach(() => {
        handle = new ClpsHandle();
        getMappedItemsSpy = jest.spyOn(handle, 'getMappedItems');
        parseRowConfigSpy = jest.spyOn(handle, 'parseRowConfig');
        getRowCtxSpy = jest.spyOn(handle, 'getRowCtx');
        validateMappingSpy = jest.spyOn(handle, 'validateMapping');
        getNestedMappedItemsSpy = jest.spyOn(handle, 'getNestedMappedItems');
        isNestedOpenSpy = jest.spyOn(handle, 'isNestedOpen');
        findItemInDataSpy = jest.spyOn(handle, 'findItemInData');
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

            it('should return false if row context is found in the show target context', () => {
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

    describe('Method - validateMapping: Validate data and row config to determine if it can be proceed or not', () => {
        const mockRowKey: string = 'lorem';
        const mockTransformFn: jest.Mock = jest.fn();
        const mockConfig: IUserRowConfig = [ mockRowKey, mockTransformFn ];

        describe('when data is an array', () => {
            const mockEmptyDataAry: any[] = [];
            const mockDataAry: any[] = [1,2];

            it('should return false if data has no items', () => {
                expect(validateMapping(mockEmptyDataAry)).toBe(false);
            });

            it('should return true if data has items', () => {
                expect(validateMapping(mockDataAry)).toBe(true);
            });
        });

        describe('when data is an object', () => {
            const mockNestedData: any[] = [1,2];
            const mockDataObj: Record<string, any> = {[mockRowKey]: mockNestedData};

            it('should return false if config doesnt exist, or `rowkey` in config doesnt exist, or `rowKey` is empty', () => {
                expect(validateMapping(mockDataObj, null)).toBe(false);
                expect(validateMapping(mockDataObj, [] as any)).toBe(false);
                expect(validateMapping(mockDataObj, [ '' ])).toBe(false);
            });

            it('should return false if data`s property value is not an array or an empty array', () => {
                expect(validateMapping({}, mockConfig)).toBe(false);
                expect(validateMapping({[mockRowKey]: ''}, mockConfig)).toBe(false);
                expect(validateMapping({[mockRowKey]: []}, mockConfig)).toBe(false);
            });

            it('should return true if `rowkey` exist in config and data`s property value is not an empty array', () => {
                expect(validateMapping(mockDataObj, mockConfig)).toBe(true);
            });
        });

    });

    describe('Method - getNestedMappedItems: Get Nested Mapped Items', () => {
        const mockMappedItems: any[] = [];
        const mockItemsReq: IItemsReq = {
            data: [],
            rowConfigs: [],
            rowLvl: 0,
            prevItemCtx: '',
            showTargetCtx: []
        };

        beforeEach(() => {
            getMappedItemsSpy.mockReturnValue(mockMappedItems);
        });

        it('should return mapped items when mapping is valid', () => {
            validateMappingSpy.mockReturnValue(true);

            expect(handle.getNestedMappedItems(mockItemsReq)).toBe(mockMappedItems);
            expect(validateMappingSpy).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rowConfigs[0]
            );
            expect(getMappedItemsSpy).toHaveBeenCalledWith(mockItemsReq);

        });

        it('should return null when mapping is not valid', () => {
            validateMappingSpy.mockReturnValue(false);

            expect(handle.getNestedMappedItems(mockItemsReq)).toBe(null);
            expect(validateMappingSpy).toHaveBeenCalledWith(
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