import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { IOption, TLsItem } from './type';
import { SortHandle } from '.';

describe('Handle Service - Default Sorter', () => {
    let handle: SortHandle;
    let spy: TMethodSpy<SortHandle>;
    let sortedList: TLsItem[];

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
            const mockInvalidList: TLsItem[] = [{key: []}, {key: ()=>{}}, {key: 'y'}];
            const mockStrList: TLsItem[] = [{key: 'z'}, {key: 'x'}, {key: 'y'}];
            const mockNumList: TLsItem[] = [{key: 5}, {key: 1}, {key: 19},];
            const mockLocaleStrList: TLsItem[] = [{key: 'cqé'}, {key: 'rév'}, {key: 'écl'}];
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
                expect(sortedList).toEqual([{key: 'x'}, {key: 'y'}, {key: 'z'}]);
            });

            it('should sort based on string in dsc. order', () => {
                sortedList = handle.sortByObjKey(mockStrList, {...mockOption, isAsc: false})

                expect(spy.compareStr).toHaveBeenCalled();
                expect(spy.compareNum).not.toHaveBeenCalled();
                expect(spy.compareLocaleStr).not.toHaveBeenCalled();
                expect(sortedList).toEqual([{key: 'z'}, {key: 'y'}, {key: 'x'}]);
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
    });

    describe('UI - Generic Option and State', () => {
        describe('Method - createOption: Create an option from an partial option', () => {
            it('should return an option when existing option is given', () => {

            });

            it('should return an option when existing option is not given', () => {

            });
        });

        describe('Method - getDefOption: Get default option', () => {
            it('should return default option', () => {

            });
        });

        describe('Method - createstate: Create a sorted state (data)', () => {
            it('should return state when mandatory option is not given', () => {

            });

            it('should return state when mandatory option is given and data list is empty', () => {

            });

            it('should return state when mandatory option is given and data list is not empty', () => {

            });
        });

        describe('Method - getDefState: Get default sorted state (data)', () => {
            it('should return default state', () => {

            });
        });
    });

    describe('UI - Generic Component Attribute', () => {
        describe('Method - createGenericCmpAttr: Create Generic Attributes for Sort related Components', () => {
            it('should return attribute for components', () => {

            });
        });

        describe('Method - createSortBtnAttr: Create Generic Attributes for Sort Button Component', () => {
            it('should return attribute for Sort Reset is on and Current key is same as Sort Key', () => {

            });

            it('should return attribute for Sort Reset is off', () => {

            });
        });

        describe('Method - getGenericCmpEvtHandler: Get Generic Event Handler For Sort Related Components', () => {
            it('should return an binded event handler', () => {

            });
        });
    });
});