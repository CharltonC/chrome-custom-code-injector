import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { IRawRowsOption, IParsedRowsOption, ICtxRowsQuery, IOption } from './type';
import { RowHandle } from '.';

describe('Service - Row Handle', () => {
    const { getItemPath, parseRowConfig, isGteZeroInt, getRowType } = RowHandle.prototype;
    let handle: RowHandle;
    let spy: TMethodSpy<RowHandle>;

    beforeEach(() => {
        handle = new RowHandle();
        spy = TestUtil.spyMethods(handle);
    });

    describe('Method - createOption', () => {
        const mockModOption = { data: ['a'] } as IOption;

        it('should return merged option when existing option is provided', () => {
            expect(handle.createOption(mockModOption)).toEqual({
                rows: [],
                showAll: false,
                ...mockModOption
            });
        });

        it('should return merged option when existing option is not provided', () => {
            const mockExistOption = { data: ['b'], showAll: true } as IOption;

            expect(handle.createOption(mockModOption, mockExistOption)).toEqual({
                ...mockExistOption,
                ...mockModOption
            });
        });
    });

    describe('Method - createCtxRows: Get Expand state based on User`s Expand config/option', () => {
        const mockMappedItems: any[] = [];

        beforeEach(() => {
            spy.getCtxRows.mockReturnValue(mockMappedItems);
        });

        it('should return null if data is not valid', () => {
            spy.getValidatedData.mockReturnValue(false);
            expect(handle.createCtxRows()).toBeFalsy();
            expect(spy.getValidatedData).toHaveBeenCalledWith(mockMappedItems);
        });

        it('should return mapped items', () => {
            spy.getValidatedData.mockReturnValue([]);

            expect(handle.createCtxRows()).toBe(mockMappedItems);
            expect(spy.getValidatedData).toHaveBeenCalledWith(mockMappedItems);
        });
    });

    describe('Method - getCtxRows: Get mapped items based on the row configs provided', () => {
        const mockData: any[] = [ {text: 'a'}];
        const mockTransformFn: jest.Mock = jest.fn();
        const mockRows: IParsedRowsOption = { rowKey: '', transformFn: mockTransformFn };
        const mockItemsReq: ICtxRowsQuery = {
            data: mockData,
            rows: [],
            rowLvl: 0,
            parentPath: '',
            showAll: true
        };
        const mockItemPath: string = 'itemPath';
        const mockTransformResult: any = {};

        beforeEach(() => {
            mockTransformFn.mockReturnValue(mockTransformResult);
            spy.getItemPath.mockReturnValue(mockItemPath);
            spy.getRowType.mockReturnValue('odd');
        });

        it('should return mapped items when transform function is provided and there are nested items', () => {
            const mockNestedItems: any[] = ['b'];
            spy.parseRowConfig.mockReturnValue(mockRows);
            spy.getCtxNestedRows.mockReturnValue(mockNestedItems);

            expect(handle.getCtxRows(mockItemsReq)).toEqual([mockTransformResult]);
            expect(spy.parseRowConfig).toHaveBeenCalledWith(mockItemsReq.rows[0], mockItemsReq.rowLvl);
            expect(spy.getItemPath).toHaveBeenCalledWith(0, '', mockItemsReq.parentPath);
            expect(spy.getCtxNestedRows).toHaveBeenCalledWith({
                ...mockItemsReq,
                data: mockData[0],
                rowLvl: mockItemsReq.rowLvl + 1,
                parentPath: mockItemPath
            });
            expect(mockTransformFn).toHaveBeenCalledWith({
                idx: 0,
                rowType: 'odd',
                item: mockData[0],
                itemKey: '',
                itemLvl: mockItemsReq.rowLvl,
                itemPath: mockItemPath,
                parentPath: '',
                nestedItems: mockNestedItems,
                isExpdByDef: true
            });
        });

        it('should return mapped items when transform function is not provided and there is no nested items', () => {
            const mockNestedItems: any[] = null;
            spy.parseRowConfig.mockReturnValue({...mockRows, transformFn: null});
            spy.getCtxNestedRows.mockReturnValue(mockNestedItems);

            expect(handle.getCtxRows({...mockItemsReq})).toEqual([{
                idx: 0,
                rowType: 'odd',
                item: mockData[0],
                itemKey: '',
                itemPath: mockItemPath,
                parentPath: '',
                itemLvl: mockItemsReq.rowLvl,
                nestedItems: mockNestedItems,
                isExpdByDef: false
            }]);
            expect(mockTransformFn).not.toHaveBeenCalled();
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

    describe('Method - getRowType: Get the row type, whether its odd or even', () => {
        it('should return `odd` row type if remainder is 0 when divided by 2', () => {
            expect(getRowType(0)).toBe('odd');
            expect(getRowType(2)).toBe('odd');
        });

        it('should return `even` row type remainder is not 0 when divided by 2', () => {
            expect(getRowType(1)).toBe('even');
            expect(getRowType(3)).toBe('even');
        });
    });

    describe('Method - getValidatedData: Validate data and row config to determine if it can be proceed or not', () => {
        const mockRowKey: string = 'lorem';
        const mockTransformFn: jest.Mock = jest.fn();
        const mockConfig: IRawRowsOption = [ mockRowKey, mockTransformFn ];

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

    describe('Method - getCtxNestedRows: Get Nested Mapped Items', () => {
        const mockMappedItems: any[] = [];
        const mockNestedData: any[] = [1,2];
        const mockNestedKey: string = 'prop';
        const mockItemsReq: ICtxRowsQuery = {
            data: {[mockNestedKey]: mockNestedData},
            rows: [[mockNestedKey]],
            rowLvl: 0,
            parentPath: '',
            showAll: true
        };

        beforeEach(() => {
            spy.getCtxRows.mockReturnValue(mockMappedItems);
        });

        it('should return mapped items when mapping is valid', () => {
            spy.getValidatedData.mockReturnValue(mockNestedData);

            expect(handle.getCtxNestedRows(mockItemsReq)).toBe(mockMappedItems);
            expect(spy.getValidatedData).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rows[0]
            );
            expect(spy.getCtxRows).toHaveBeenCalledWith({
                ...mockItemsReq,
                data: mockNestedData
            });
        });

        it('should return null when mapping is not valid', () => {
            spy.getValidatedData.mockReturnValue(null);

            expect(handle.getCtxNestedRows(mockItemsReq)).toBe(null);
            expect(spy.getValidatedData).toHaveBeenCalledWith(
                mockItemsReq.data,
                mockItemsReq.rows[0]
            );
            expect(spy.getCtxRows).not.toHaveBeenCalled();
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