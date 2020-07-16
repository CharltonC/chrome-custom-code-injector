import { TMethodSpy } from '../../../test-util/type';
import { TestUtil } from '../../../test-util/';
import { TVisibleNestablePath, IRawRowConfig, IParsedRowConfig, IItemsCtxReq, IOption } from './type';
import { RowHandle } from '.';

describe('Service - Row Handle', () => {
    const { isExpdByDef, getItemPath, parseRowConfig, isGteZeroInt } = RowHandle.prototype;
    let handle: RowHandle;
    let spy: TMethodSpy<RowHandle>;

    beforeEach(() => {
        handle = new RowHandle();
        spy = TestUtil.spyMethods(handle);
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

    describe('Method - createOption', () => {
        const mockModOption = { data: ['a'] } as IOption;

        it('should return merged option when existing option is provided', () => {
            expect(handle.createOption(mockModOption)).toEqual({
                ...handle.getDefOption(),
                ...mockModOption
            });
        });

        it('should return merged option when existing option is not provided', () => {
            const mockExistOption = { data: ['b'], visiblePath: 'NONE' } as IOption;

            expect(handle.createOption(mockModOption, mockExistOption)).toEqual({
                ...mockExistOption,
                ...mockModOption
            });
        });
    });

    describe('Method - getDefOption: Default Expand User Option', () => {
        it('should have default values', () => {
            expect(handle.getDefOption()).toEqual({
                data: [],
                rows: [],
                visiblePath: 'ALL'
            });
        });
    });

    describe('Method - createState: Get Expand state based on User`s Expand config/option', () => {
        const mockMappedItems: any[] = [];

        beforeEach(() => {
            spy.getMappedItemsCtx.mockReturnValue(mockMappedItems);
        });

        it('should return null if data is not valid', () => {
            spy.getValidatedData.mockReturnValue(false);
            expect(handle.createState()).toBeFalsy();
            expect(spy.getValidatedData).toHaveBeenCalledWith(mockMappedItems);
        });

        it('should return mapped items', () => {
            spy.getValidatedData.mockReturnValue([]);

            expect(handle.createState()).toBe(mockMappedItems);
            expect(spy.getValidatedData).toHaveBeenCalledWith(mockMappedItems);
            expect(spy.getMappedItemsCtx).toHaveBeenCalledWith({
                ...handle.getDefOption(),
                rowLvl: 0,
                parentPath: ''
            });
        });
    });

    describe('Method - getDefState', () => {
        it('should return default state', () => {
            expect(handle.getDefState()).toEqual([]);
        });
    });

    describe('Method - getMappedItemsCtx: Get mapped items based on the row configs provided', () => {
        const mockData: any[] = [ {text: 'a'}];
        const mockTransformFn: jest.Mock = jest.fn();
        const mockRows: IParsedRowConfig = { rowKey: '', transformFn: mockTransformFn };
        const mockItemsReq: IItemsCtxReq = {
            data: mockData,
            rows: [],
            rowLvl: 0,
            parentPath: '',
            visiblePath: []
        };

        const mockItemPath: string = 'itemPath';
        const mockIsOpen: boolean = false;
        const mockTransformResult: any = {};

        beforeEach(() => {
            mockTransformFn.mockReturnValue(mockTransformResult);
            spy.getItemPath.mockReturnValue(mockItemPath);
            spy.isExpdByDef.mockReturnValue(mockIsOpen);
        });

        it('should return mapped items when transform function is provided and there are nested items', () => {
            const mockNestedItems: any[] = null;
            spy.parseRowConfig.mockReturnValue(mockRows);
            spy.getMappedNestedItemsCtx.mockReturnValue(mockNestedItems);

            expect(handle.getMappedItemsCtx(mockItemsReq)).toEqual([mockTransformResult]);
            expect(spy.isExpdByDef).not.toHaveBeenCalled();
            expect(spy.parseRowConfig).toHaveBeenCalledWith(mockItemsReq.rows[0], mockItemsReq.rowLvl);
            expect(spy.getItemPath).toHaveBeenCalledWith(0, '', mockItemsReq.parentPath);
            expect(spy.getMappedNestedItemsCtx).toHaveBeenCalledWith({
                ...mockItemsReq,
                data: mockData[0],
                rowLvl: mockItemsReq.rowLvl + 1,
                parentPath: mockItemPath
            });
            expect(mockTransformFn).toHaveBeenCalledWith({
                idx: 0,
                item: mockData[0],
                itemKey: '',
                itemLvl: mockItemsReq.rowLvl,
                itemPath: mockItemPath,
                parentPath: '',
                nestedItems: mockNestedItems,
                isExpdByDef: mockIsOpen
            });
        });

        it('should return mapped items when transform function is not provided and there is no nested items', () => {
            const mockNestedItems: any[] = [];
            spy.parseRowConfig.mockReturnValue({...mockRows, transformFn: null});
            spy.getMappedNestedItemsCtx.mockReturnValue(mockNestedItems);

            expect(handle.getMappedItemsCtx({...mockItemsReq})).toEqual([{
                idx: 0,
                item: mockData[0],
                itemKey: '',
                itemPath: mockItemPath,
                parentPath: '',
                itemLvl: mockItemsReq.rowLvl,
                nestedItems: mockNestedItems,
                isExpdByDef: mockIsOpen
            }]);
            expect(spy.isExpdByDef).toHaveBeenCalledWith(mockItemPath, mockItemsReq.visiblePath);
            expect(mockTransformFn).not.toHaveBeenCalled();
        });
    });

    describe('Method - isExpdByDef: Check if a row should open/collapse its nested rows', () => {
        describe('when show target context is an array of contexts', () => {
            const mockVisiblePath: TVisibleNestablePath = [ 'a', 'a/b' ];

            it('should return false if row context is not found in the show target context', () => {
                expect(isExpdByDef('a/b/c', mockVisiblePath)).toBe(false);
            });

            it('should return true if row context is found in the show target context', () => {
                expect(isExpdByDef('a/b', mockVisiblePath)).toBe(true);
            });
        });

        describe('when show target context is `ALL` or `NONE`', () => {
            it('should return true if show target context is show all', () => {
                expect(isExpdByDef('', 'ALL')).toBe(true);
            });

            it('should return false if show target context is show none', () => {
                expect(isExpdByDef('', 'NONE')).toBe(false);
            });
        });
    });

    describe('Method - getItemPath: Get Context for current Row', () => {
        const mockRowKey: string = 'key';
        const mockRowIdx: number = 0;
        const mockPrefixCtx: string = 'prefix';

        it('should return row context', () => {
            expect(getItemPath(mockRowIdx, null, null)).toBe(`${mockRowIdx}`);
            expect(getItemPath(mockRowIdx, null, mockPrefixCtx)).toBe(`${mockPrefixCtx}/${mockRowIdx}`);
            expect(getItemPath(mockRowIdx, mockRowKey, null)).toBe(`${mockRowKey}:${mockRowIdx}`);
            expect(getItemPath(mockRowIdx, mockRowKey, mockPrefixCtx)).toBe(`${mockPrefixCtx}/${mockRowKey}:${mockRowIdx}`);
        });
    });

    describe('Method - getValidatedData: Validate data and row config to determine if it can be proceed or not', () => {
        const mockRowKey: string = 'lorem';
        const mockTransformFn: jest.Mock = jest.fn();
        const mockConfig: IRawRowConfig = [ mockRowKey, mockTransformFn ];

        describe('when data is an array', () => {
            const mockEmptyDataAry: any[] = [];
            const mockDataAry: any[] = [1,2];

            it('should return null if data has no items', () => {
                expect(handle.getValidatedData(mockEmptyDataAry)).toBe(null);
            });

            it('should return the data itself if data has items', () => {
                expect(handle.getValidatedData(mockDataAry)).toBe(mockDataAry);
            });
        });

        describe('when data is an object', () => {
            const mockNestedData: any[] = [1,2];
            const mockDataObj: Record<string, any> = {[mockRowKey]: mockNestedData};

            it('should throw error if `rowkey` in config doesnt exist, or `rowKey` is empty', () => {
                const { ROW_KEY_MISSING } = handle.errMsg;

                expect(() => {
                    handle.getValidatedData(mockDataObj, [] as any);
                }).toThrowError(ROW_KEY_MISSING);

                expect(() => {
                    handle.getValidatedData(mockDataObj, [ '' ]);
                }).toThrowError(ROW_KEY_MISSING);
            });

            it('should throw error if row key is not a string, or if data`s property exist but not an array', () => {
                const { ROW_KEY_TYPE, PROP_DATA_TYPE } = handle.errMsg;

                expect(() => {
                    handle.getValidatedData({}, [ ()=>{} ])
                }).toThrowError(ROW_KEY_TYPE);

                expect(() => {
                    handle.getValidatedData({[mockRowKey]: 'abc'}, mockConfig)
                }).toThrowError(PROP_DATA_TYPE);
            });

            it('should return null if config doesnt exist', () => {
                expect(handle.getValidatedData(mockDataObj, null)).toBe(null);
            });

            it('should return null if data`s property value is an empty array', () => {
                expect(handle.getValidatedData({[mockRowKey]: []}, mockConfig)).toBe(null);
            });

            it('should return the nested data if `rowkey` exist in config and data`s property value is not an empty array', () => {
                expect(handle.getValidatedData(mockDataObj, mockConfig)).toBe(mockNestedData);
            });
        });

    });

    describe('Method - getMappedNestedItemsCtx: Get Nested Mapped Items', () => {
        const mockMappedItems: any[] = [];
        const mockNestedData: any[] = [1,2];
        const mockNestedKey: string = 'prop';
        const mockItemsReq: IItemsCtxReq = {
            data: {[mockNestedKey]: mockNestedData},
            rows: [[mockNestedKey]],
            rowLvl: 0,
            parentPath: '',
            visiblePath: []
        };

        beforeEach(() => {
            spy.getMappedItemsCtx.mockReturnValue(mockMappedItems);
        });

        it('should return mapped items when mapping is valid', () => {
            spy.getValidatedData.mockReturnValue(mockNestedData);

            expect(handle.getMappedNestedItemsCtx(mockItemsReq)).toBe(mockMappedItems);
            expect(spy.getValidatedData).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rows[0]
            );
            expect(spy.getMappedItemsCtx).toHaveBeenCalledWith({
                ...mockItemsReq,
                data: mockNestedData
            });
        });

        it('should return null when mapping is not valid', () => {
            spy.getValidatedData.mockReturnValue(null);

            expect(handle.getMappedNestedItemsCtx(mockItemsReq)).toBe(null);
            expect(spy.getValidatedData).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rows[0]
            );
            expect(spy.getMappedItemsCtx).not.toHaveBeenCalled();
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