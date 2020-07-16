import { TestUtil } from '../../../test-util/';
import { TLsItem } from './type';
import { SortHandle } from '.';

describe('Handle Service - Default Sorter', () => {
    let sortHandle: SortHandle;
    let spy: Record<keyof SortHandle, jest.SpyInstance>;
    let sortedList: TLsItem[];

    beforeEach(() => {
        sortHandle = new SortHandle();
        spy = TestUtil.spyProtoMethods(sortHandle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method: sortByObjKey - Sort a list of object based on an object key', () => {
        const mockInvalidList: TLsItem[] = [{key: []}, {key: ()=>{}}, {key: 'y'}];
        const mockStrList: TLsItem[] = [{key: 'z'}, {key: 'x'}, {key: 'y'}];
        const mockNumList: TLsItem[] = [{key: 5}, {key: 1}, {key: 19},];
        const mockLocaleStrList: TLsItem[] = [{key: 'cqé'}, {key: 'rév'}, {key: 'écl'}];

        it('should not sort if values are not same type of number, string', () => {
            spy.isValSameType.mockReturnValue(false);
            sortedList = sortHandle.sortByObjKey(mockStrList, 'key');

            expect(sortedList).toEqual(mockStrList);
            expect(spy.compareStr).not.toHaveBeenCalled();
            expect(spy.compareNum).not.toHaveBeenCalled();
            expect(spy.compareLocaleStr).not.toHaveBeenCalled();
        });

        it('should not sort if values type are invalid', () => {
            sortedList = sortHandle.sortByObjKey(mockInvalidList, 'key');

            expect(sortedList).toEqual(mockInvalidList);
            expect(spy.compareStr).not.toHaveBeenCalled();
            expect(spy.compareNum).not.toHaveBeenCalled();
            expect(spy.compareLocaleStr).not.toHaveBeenCalled();
        });

        it('should sort based on string in asc. order', () => {
            sortedList = sortHandle.sortByObjKey(mockStrList, 'key');

            expect(spy.compareStr).toHaveBeenCalled();
            expect(spy.compareNum).not.toHaveBeenCalled();
            expect(spy.compareLocaleStr).not.toHaveBeenCalled();
            expect(sortedList).toEqual([{key: 'x'}, {key: 'y'}, {key: 'z'}]);
        });

        it('should sort based on string in dsc. order', () => {
            sortedList = sortHandle.sortByObjKey(mockStrList, 'key', false)

            expect(spy.compareStr).toHaveBeenCalled();
            expect(spy.compareNum).not.toHaveBeenCalled();
            expect(spy.compareLocaleStr).not.toHaveBeenCalled();
            expect(sortedList).toEqual([{key: 'z'}, {key: 'y'}, {key: 'x'}]);
        });

        it('should sort based on number in asc. order', () => {
            sortedList = sortHandle.sortByObjKey(mockNumList, 'key');

            expect(spy.compareNum).toHaveBeenCalled();
            expect(spy.compareStr).not.toHaveBeenCalled();
            expect(spy.compareLocaleStr).not.toHaveBeenCalled();
            expect(sortedList).toEqual([{key: 1}, {key: 5}, {key: 19}]);
        });

        it('should sort based on number in dsc. order', () => {
            sortedList = sortHandle.sortByObjKey(mockNumList, 'key', false);

            expect(spy.compareNum).toHaveBeenCalled();
            expect(spy.compareStr).not.toHaveBeenCalled();
            expect(spy.compareLocaleStr).not.toHaveBeenCalled();
            expect(sortedList).toEqual([{key: 19}, {key: 5}, {key: 1}]);
        });

        it('should sort based on locale string in asc. order', () => {
            sortedList = sortHandle.sortByObjKey(mockLocaleStrList, 'key', true, true);

            expect(spy.compareLocaleStr).toHaveBeenCalled();
            expect(spy.compareStr).not.toHaveBeenCalled();
            expect(spy.compareNum).not.toHaveBeenCalled();
            expect(sortedList).toEqual([{key: 'cqé'}, {key: 'écl'}, {key: 'rév'}]);
        });

        it('should sort based on locale string in dsc. order', () => {
            sortedList = sortHandle.sortByObjKey(mockLocaleStrList, 'key', false, true);

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
            const diff: number = sortHandle.compareNum(mockValX, mockValY, true);
            expect(diff).toBe(mockDiff);
        });

        it('should return the difference of b and a for dsc. order ', () => {
            const diff: number = sortHandle.compareNum(mockValX, mockValY, false);
            expect(diff).toBe(-mockDiff);
        });
    });

    describe('Method: compareStr - Compare 2 string values', () => {
        const mockValX: string = 'x';
        const mockValY: string = 'y';

        it('should return 0 when a and b are the same regardless of order', () => {
            expect(sortHandle.compareStr(mockValX, mockValX, true)).toBe(0);
            expect(sortHandle.compareStr(mockValX, mockValX, false)).toBe(0);
        });

        it('should return -1 (ab) when a and b are in asc. order for asc. order', () => {
            expect(sortHandle.compareStr(mockValX, mockValY, true)).toBe(-1);
        });

        it('should return 1 (ba) when a and b are in asc. order for dsc. order', () => {
            expect(sortHandle.compareStr(mockValX, mockValY, false)).toBe(1);
        });

        it('should return 1 (ba) when a and b are in dsc. order for asc. order', () => {
            expect(sortHandle.compareStr(mockValY, mockValX, true)).toBe(1);
        });

        it('should return -1 (ab) when a and b are in dsc. order for dsc. order', () => {
            expect(sortHandle.compareStr(mockValY, mockValX, false)).toBe(-1);
        });
    });

    describe('Method: compareLocaleStr - Compare 2 locale string values', () => {
        const mockValX: string = 'cqé';
        const mockValY: string = 'rév';

        it('should return 0 when a and b are the same regardless of order', () => {
            expect(sortHandle.compareLocaleStr(mockValX, mockValX, true)).toBe(0);
            expect(sortHandle.compareLocaleStr(mockValX, mockValX, false)).toBe(0);
        });

        it('should return -1 (ab) when a and b are in asc. order for asc. order', () => {
            expect(sortHandle.compareLocaleStr(mockValX, mockValY, true)).toBe(-1);
        });

        it('should return 1 (ba) when a and b are in asc. order for dsc. order', () => {
            expect(sortHandle.compareLocaleStr(mockValX, mockValY, false)).toBe(1);
        });
    });

    describe('Method: isValSameType - Check if 2 values have the same type', () => {
        it('should return true if they have same type', () => {
            expect(sortHandle.isValSameType('x', 'y', 'string')).toBe(true);
            expect(sortHandle.isValSameType(1, 2, 'number')).toBe(true);
        });

        it('should return false if they dont have same type', () => {
            expect(sortHandle.isValSameType('x', 2, 'string')).toBe(false);
        });

        it('should return false if the type specified doesnt exist', () => {
            expect(sortHandle.isValSameType('x', 'y', 'number')).toBe(false);
            expect(sortHandle.isValSameType(1, 2, 'lorem')).toBe(false);
        });
    });
});