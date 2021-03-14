import { TMethodSpy } from '../../asset/ts/test-util/type';
import { TestUtil } from '../../asset/ts/test-util';
import { IOption, ALsItem, ICmpAttrQuery } from './type';
import { SortHandle } from '.';

describe('Handle Service - Default Sorter', () => {
    let handle: SortHandle;
    let spy: TMethodSpy<SortHandle>;
    let sortedList: ALsItem[];

    beforeEach(() => {
        handle = new SortHandle();
        spy = TestUtil.spyMethods(handle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Core', () => {
        describe('Method: sortByObjKey - Sort a list of object based on an object key', () => {
            const mockInvalidList: ALsItem[] = [{key: []}, {key: ()=>{}}, {key: 'y'}];
            const mockStrList: ALsItem[] = [{key: 'z'}, {key: 'X'}, {key: 'x'}, {key: 'y'}];
            const mockNumList: ALsItem[] = [{key: 5}, {key: 1}, {key: 19},];
            const mockLocaleStrList: ALsItem[] = [{key: 'cqé'}, {key: 'rév'}, {key: 'écl'}];
            const mockOption: IOption = { key: 'key', isAsc: true, hsLocale: false };

            it('should not sort if values are not same type of number, string', () => {
                spy.isValSameType.mockReturnValue(false);
                sortedList = handle.sortByObjKey(mockStrList, mockOption);

                expect(sortedList).toEqual(mockStrList);
                expect(spy.compareStr).not.toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
            });

            it('should not sort if values type are invalid', () => {
                sortedList = handle.sortByObjKey(mockInvalidList, mockOption);

                expect(sortedList).toEqual(mockInvalidList);
                expect(spy.compareStr).not.toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
            });

            it('should sort based on string in asc. order', () => {
                sortedList = handle.sortByObjKey(mockStrList, mockOption);

                expect(spy.compareStr).toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 'X'}, {key: 'x'}, {key: 'y'}, {key: 'z'}]);
            });

            it('should sort based on string in dsc. order', () => {
                sortedList = handle.sortByObjKey(mockStrList, {...mockOption, isAsc: false})

                expect(spy.compareStr).toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 'z'}, {key: 'y'}, {key: 'X'}, {key: 'x'}]);
            });

            it('should sort based on number in asc. order', () => {
                sortedList = handle.sortByObjKey(mockNumList, mockOption);

                expect(spy.compareNum).toHaveBeenCalled();
                expect(spy.compareStr).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 1}, {key: 5}, {key: 19}]);
            });

            it('should sort based on number in dsc. order', () => {
                sortedList = handle.sortByObjKey(mockNumList, {...mockOption, isAsc: false})

                expect(spy.compareNum).toHaveBeenCalled();
                expect(spy.compareStr).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 19}, {key: 5}, {key: 1}]);
            });

            it('should sort based on locale string in asc. order', () => {
                sortedList = handle.sortByObjKey(mockLocaleStrList, {...mockOption, hsLocale: true})

                expect(spy.compareLocaleStr).toHaveBeenCalled();
                expect(spy.compareStr).not.toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 'cqé'}, {key: 'écl'}, {key: 'rév'}]);
            });

            it('should sort based on locale string in dsc. order', () => {
                sortedList = handle.sortByObjKey(mockLocaleStrList, {...mockOption, isAsc: false, hsLocale: true});

                expect(spy.compareLocaleStr).toHaveBeenCalled();
                expect(spy.compareStr).not.toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 'rév'}, {key: 'écl'}, {key: 'cqé'}]);
            });

        });

        describe('Method: compareNum - Compare 2 Number values', () => {
            const mockValX: number = 3;
            const mockValY: number = 1;
            const mockDiff: number = mockValX - mockValY;

            it('should return the difference of a and b for asc. order', () => {
                const diff: number = handle.compareNum(mockValX, mockValY, true);
                expect(diff).toBe(mockDiff);
            });

            it('should return the difference of b and a for dsc. order ', () => {
                const diff: number = handle.compareNum(mockValX, mockValY, false);
                expect(diff).toBe(-mockDiff);
            });
        });

        describe('Method: compareStr - Compare 2 string values', () => {
            const mockValX: string = 'x';
            const mockValY: string = 'y';

            it('should return 0 when a and b are the same regardless of order', () => {
                expect(handle.compareStr(mockValX, mockValX, true)).toBe(0);
                expect(handle.compareStr(mockValX, mockValX, false)).toBe(0);
            });

            it('should return -1 (ab) when a and b are in asc. order for asc. order', () => {
                expect(handle.compareStr(mockValX, mockValY, true)).toBe(-1);
            });

            it('should return 1 (ba) when a and b are in asc. order for dsc. order', () => {
                expect(handle.compareStr(mockValX, mockValY, false)).toBe(1);
            });

            it('should return 1 (ba) when a and b are in dsc. order for asc. order', () => {
                expect(handle.compareStr(mockValY, mockValX, true)).toBe(1);
            });

            it('should return -1 (ab) when a and b are in dsc. order for dsc. order', () => {
                expect(handle.compareStr(mockValY, mockValX, false)).toBe(-1);
            });
        });

        describe('Method: compareLocaleStr - Compare 2 locale string values', () => {
            const mockValX: string = 'cqé';
            const mockValY: string = 'rév';

            it('should return 0 when a and b are the same regardless of order', () => {
                expect(handle.compareLocaleStr(mockValX, mockValX, true)).toBe(0);
                expect(handle.compareLocaleStr(mockValX, mockValX, false)).toBe(0);
            });

            it('should return -1 (ab) when a and b are in asc. order for asc. order', () => {
                expect(handle.compareLocaleStr(mockValX, mockValY, true)).toBe(-1);
            });

            it('should return 1 (ba) when a and b are in asc. order for dsc. order', () => {
                expect(handle.compareLocaleStr(mockValX, mockValY, false)).toBe(1);
            });
        });

        describe('Method: isValSameType - Check if 2 values have the same type', () => {
            it('should return true if they have same type', () => {
                expect(handle.isValSameType('x', 'y', 'string')).toBe(true);
                expect(handle.isValSameType(1, 2, 'number')).toBe(true);
            });

            it('should return false if they dont have same type', () => {
                expect(handle.isValSameType('x', 2, 'string')).toBe(false);
            });

            it('should return false if the type specified doesnt exist', () => {
                expect(handle.isValSameType('x', 'y', 'number')).toBe(false);
                expect(handle.isValSameType(1, 2, 'lorem')).toBe(false);
            });
        });

        describe('Method: shallSort - Check if data can be and should be sorted', () => {
            const mockData: any = ['a', 'b'];
            const mockOption: IOption = {key: 'lorem', isAsc: true };

            it('should return false when mandatory option is not present', () => {
                expect(handle.shallSort(mockData, {} as IOption)).toBeFalsy();
            });

            it('should return false when data has less than 1 item', () => {
                expect(handle.shallSort([], mockOption)).toBeFalsy();
                expect(handle.shallSort(['a'] as any, mockOption)).toBeFalsy();
            });

            it('should return true when data has more than 1 items and mandatory option is present', () => {
                expect(handle.shallSort(mockData, mockOption)).toBeTruthy();
            });
        });
    });

    describe('UI - Generic Option and State', () => {
        describe('Method - createOption: Create an option from an partial option', () => {
            const mockDefOption = {};
            const mockModOption: Partial<IOption> = { key: 'lorem' };

            beforeEach(() => {
                spy.getDefOption.mockReturnValue(mockDefOption);
            });

            it('should return an option when existing option is given', () => {
                const mockExistOption: IOption = { key: 'sum', isAsc: false };
                expect(handle.createOption(mockModOption, mockExistOption)).toEqual({
                    ...mockExistOption,
                    ...mockModOption
                });
                expect(spy.getDefOption).not.toHaveBeenCalled();
            });

            it('should return an option when existing option is not given', () => {
                expect(handle.createOption(mockModOption)).toEqual({
                    ...mockModOption
                });
                expect(spy.getDefOption).toHaveBeenCalled();
            });
        });

        describe('Method - getDefOption: Get default option', () => {
            it('should return default option', () => {
                expect(handle.getDefOption()).toEqual({
                    key: null,
                    isAsc: null,
                    hsLocale: false,
                    reset: false,
                });
            });
        });

        describe('Method - createstate: Create a sorted state (data)', () => {
            const mockData: any = ['a', 'b'];
            const mockOption = {} as IOption;
            const mockSortedData: any = [];

            beforeEach(() => {
                spy.sortByObjKey.mockReturnValue(mockSortedData);
            });

            it('should return state when data can be sorted', () => {
                spy.shallSort.mockReturnValue(true);

                expect(handle.createState(mockData, mockOption)).toEqual({
                    data: mockSortedData
                });
                expect(spy.shallSort).toHaveBeenCalledWith(mockData, mockOption);
                expect(spy.sortByObjKey).toHaveBeenCalledWith(mockData, mockOption);
            });

            it('should return state when data cannot be sorted', () => {
                spy.shallSort.mockReturnValue(false);

                expect(handle.createState(mockData, mockOption)).toEqual({
                    data: null
                });
                expect(spy.shallSort).toHaveBeenCalledWith(mockData, mockOption);
                expect(spy.sortByObjKey).not.toHaveBeenCalled();
            });
        });

        describe('Method - getDefState: Get default sorted state (data)', () => {
            it('should return default state', () => {
                expect(handle.getDefState()).toEqual({ data: null });
            });
        });
    });

    describe('UI - Generic Component Attribute', () => {
        describe('Method - createGenericCmpAttr: Create Generic Attributes for Sort related Components', () => {
            const mockEvtHandler: jest.Mock = jest.fn();
            const mockSortBtnAttr: any = {};
            const mockCmpAttrQuery = {
                data: [],
                option: {},
                callback: () => {}
            } as ICmpAttrQuery;
            const mockSortKey: string = 'lorem';

            beforeEach(() => {
                spy.getGenericCmpEvtHandler.mockReturnValue(mockEvtHandler);
                spy.createSortBtnAttr.mockReturnValue(mockSortBtnAttr);
            });

            it('should return attribute for components', () => {
                const { data, option, callback } = mockCmpAttrQuery

                expect(handle.createGenericCmpAttr(mockCmpAttrQuery, mockSortKey)).toEqual({
                    sortBtnAttr: mockSortBtnAttr
                });
                expect(spy.getGenericCmpEvtHandler).toHaveBeenCalledWith(
                    data,
                    option,
                    callback
                );
                expect(spy.createSortBtnAttr).toHaveBeenCalledWith({
                    onEvt: mockEvtHandler,
                    option,
                    sortKey: mockSortKey,
                    dataTotal: 0
                });
            });
        });

        describe('Method - createSortBtnAttr: Create Generic Attributes for Sort Button Component', () => {
            const { createSortBtnAttr } = SortHandle.prototype;
            let mockBaseOption: IOption;
            let mockOption: IOption;
            let mockEvtHandler: jest.Mock;
            let mockSortKey: string;

            beforeEach(() => {
                mockBaseOption = {
                    key: 'lorem',
                    isAsc: true,
                    reset: false,
                };
                mockEvtHandler = jest.fn();
            });

            describe('When Current key is same is sort key', () => {
                beforeEach(() => {
                    mockSortKey = mockBaseOption.key;
                });

                it('should return attribute for Sort Reset is off, current sort order is ascending', () => {
                    const { isAsc, onClick } = createSortBtnAttr({
                        onEvt: mockEvtHandler,
                        option: mockBaseOption,
                        sortKey: mockSortKey,
                        dataTotal: 2
                    });
                    onClick();

                    expect(isAsc).toBe(mockBaseOption.isAsc);
                    expect(mockEvtHandler).toHaveBeenCalledWith({
                        key: mockSortKey,
                        isAsc: !mockBaseOption.isAsc
                    });
                });

                it('should return attribute for Sort Reset is off, current sort order is descending', () => {
                    mockOption = {...mockBaseOption, isAsc: false };
                    const { isAsc, onClick } = createSortBtnAttr({
                        onEvt: mockEvtHandler,
                        option: mockOption,
                        sortKey: mockSortKey,
                        dataTotal: 2
                    });
                    onClick();

                    expect(isAsc).toBe(mockOption.isAsc);
                    expect(mockEvtHandler).toHaveBeenCalledWith({
                        key: mockSortKey,
                        isAsc: !mockOption.isAsc
                    });
                });

                it('should return attribute when Sort Reset is on, current sort order is ascending', () => {
                    mockOption = {...mockBaseOption, reset: true };
                    const { isAsc, onClick } = createSortBtnAttr({
                        onEvt: mockEvtHandler,
                        option: mockOption,
                        sortKey: mockSortKey,
                        dataTotal: 2
                    });
                    onClick();

                    expect(isAsc).toBe(mockOption.isAsc);
                    expect(mockEvtHandler).toHaveBeenCalledWith({
                        key: mockSortKey,
                        isAsc: !mockOption.isAsc
                    });
                });

                it('should return attribute when Sort Reset is on, current sort order is descending', () => {
                    mockOption = {...mockBaseOption, reset: true, isAsc: false };
                    const { isAsc, onClick } = createSortBtnAttr({
                        onEvt: mockEvtHandler,
                        option: mockOption,
                        sortKey: mockSortKey,
                        dataTotal: 2
                    });
                    onClick();

                    expect(isAsc).toBe(false);
                    expect(mockEvtHandler).toHaveBeenCalledWith({
                        key: null,
                        isAsc: null
                    });
                });
            });

            describe('When Current key is different to the sort key', () => {
                beforeEach(() => {
                    mockSortKey = 'sum';
                });

                it('should return attribute current sort order is ascending', () => {
                    const { isAsc, onClick } = createSortBtnAttr({
                        onEvt: mockEvtHandler,
                        option: mockBaseOption,
                        sortKey: mockSortKey,
                        dataTotal: 2
                    });
                    onClick();

                    expect(isAsc).toBe(null);
                    expect(mockEvtHandler).toHaveBeenCalledWith({
                        key: mockSortKey,
                        isAsc: true
                    });
                });

                it('should return attribute current sort order is descending', () => {
                    mockOption = {...mockBaseOption, isAsc: false };
                    const { isAsc, onClick } = createSortBtnAttr({
                        onEvt: mockEvtHandler,
                        option: mockOption,
                        sortKey: mockSortKey,
                        dataTotal: 2
                    });
                    onClick();

                    expect(isAsc).toBe(null);
                    expect(mockEvtHandler).toHaveBeenCalledWith({
                        key: mockSortKey,
                        isAsc: true
                    });
                });
            });

        });

        describe('Method - getGenericCmpEvtHandler: Get Generic Event Handler For Sort Related Components', () => {
            const mockData: any = [];
            const mockOption: any = {};
            const mockModOption: any = {key: 'lorem'};
            const mockCallback: jest.Mock = jest.fn();
            const mockRtnOption = 'option';
            const mockRtnState = 'state';

            beforeEach(() => {
                spy.createOption.mockReturnValue(mockRtnOption);
                spy.createState.mockReturnValue(mockRtnState);
            });

            it('should return an binded event handler when callback is provied', () => {
                const evtHandler = handle.getGenericCmpEvtHandler(mockData, mockOption, mockCallback);

                evtHandler(mockModOption);
                expect(spy.createOption).toHaveBeenCalledWith(mockModOption, mockOption);
                expect(spy.createState).toHaveBeenCalledWith(mockData, mockRtnOption);
                expect(mockCallback).toHaveBeenCalledWith({
                    sortOption: mockRtnOption,
                    sortState: mockRtnState
                });
            });

            it('should return a binded event handler when callback is not provided', () => {
                const evtHandler = handle.getGenericCmpEvtHandler(mockData, mockOption);
                evtHandler(mockModOption);
                expect(mockCallback).not.toHaveBeenCalled();
            });
        });
    });
});