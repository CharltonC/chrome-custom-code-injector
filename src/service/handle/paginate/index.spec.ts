import { IPageQuery } from './type';
import { PgnHandle, PgnOption } from './';

describe('Class - Paginate Handle', () => {
    let handle: PgnHandle;
    let isGteZeroSpy: jest.SpyInstance;
    // let getNoPerPageSpy: jest.SpyInstance;
    // let hsPageSpy: jest.SpyInstance;

    beforeEach(() => {
        handle = new PgnHandle();
        isGteZeroSpy = jest.spyOn(handle, 'isGteZero');
        // getNoPerPageSpy = jest.spyOn(handle, 'getNoPerPage');
        // hsPageSpy = jest.spyOn(handle, 'hsPage');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method: getPgnState - Get Pagination state based on list and user option', () => {
        const mockList: any[] = ['a', 'b', 'c', 'd', 'e', 'f'];
        const mockBasePgnOption: PgnOption = { list: mockList };
        const mockNoPerPage: number = 4;
        const mockIncrement: number[] = [2, 4];

        describe('paginate state for insufficient items for 1 page', () => {
            it('should return no paginate state when the list has lte 1 item', () => {
                expect(handle.getPgnState({list: []})).toBeFalsy();
                expect(handle.getPgnState({list: ['a']})).toBeFalsy();
            });

            it('should return no paginate state when total number of items is lte total 10 per page ', () => {
                expect(handle.getPgnState(mockBasePgnOption)).toBeFalsy();
                expect(handle.getPgnState({...mockBasePgnOption, increment: mockList.length})).toBeFalsy();
            });
        });

        describe('paginate state for single increment number', () => {
            const mockIncrePgnOption = {...mockBasePgnOption, increment: mockNoPerPage};

            it('should return paginate state for default starting page index 0', () => {
                expect(handle.getPgnState(mockIncrePgnOption)).toEqual({
                    currPage: 0,
                    startIdx: 0,
                    endIdx: 4,
                    first: null,
                    prev: null,
                    next: 1,
                    last: 1,
                    noOfPages: 2,
                    noPerPage: 4
                });
            });

            it('should return paginate state for invalid starting page index (def to zero)', () => {
                const mockPageIdx: number = 99;

                expect(handle.getPgnState({...mockIncrePgnOption, pageIdx: mockPageIdx})).toEqual({
                    currPage: 0,
                    startIdx: 0,
                    endIdx: 4,
                    first: null,
                    prev: null,
                    next: 1,
                    last: 1,
                    noOfPages: 2,
                    noPerPage: 4
                });
            });

            it('should return paginate state for valid starting page index', () => {
                const mockPageIdx: number = 1;

                expect(handle.getPgnState({...mockIncrePgnOption, pageIdx: mockPageIdx})).toEqual({
                    currPage: mockPageIdx,
                    startIdx: 4,
                    endIdx: undefined,
                    first: 0,
                    prev: 0,
                    next: null,
                    last: null,
                    noOfPages: 2,
                    noPerPage: 4
                });
            });
        });

        describe('paginate state for single increment array of numbers', () => {
            const mockIncrePgnOption = {...mockBasePgnOption, increment: mockIncrement};

            it('should return paginate state with default 1st increment option', () => {
                const expectedNoPerPage: number = mockIncrement[0];

                expect(handle.getPgnState(mockIncrePgnOption)).toEqual({
                    currPage: 0,
                    startIdx: 0,
                    endIdx: 2,
                    first: null,
                    prev: null,
                    next: 1,
                    last: 2,
                    noOfPages: 3,
                    noPerPage: expectedNoPerPage
                });

                expect(handle.getPgnState({...mockIncrePgnOption, pageIdx: 1})).toEqual({
                    currPage: 1,
                    startIdx: 2,
                    endIdx: 4,
                    first: 0,
                    prev: 0,
                    next: 2,
                    last: 2,
                    noOfPages: 3,
                    noPerPage: expectedNoPerPage
                });
            });

            it('should return paginate state with valid increment option', () => {
                const mockIncrementIdx: number = 1;
                const expectedNoPerPage: number = mockIncrement[mockIncrementIdx];

                expect(handle.getPgnState({...mockIncrePgnOption, incrementIdx: mockIncrementIdx})).toEqual({
                    currPage: 0,
                    startIdx: 0,
                    endIdx: 4,
                    first: null,
                    prev: null,
                    next: 1,
                    last: 1,
                    noOfPages: 2,
                    noPerPage: expectedNoPerPage
                });

                expect(handle.getPgnState({...mockIncrePgnOption, incrementIdx: mockIncrementIdx, pageIdx: 1})).toEqual({
                    currPage: 1,
                    startIdx: 4,
                    endIdx: undefined,
                    first: 0,
                    prev: 0,
                    next: null,
                    last: null,
                    noOfPages: 2,
                    noPerPage: expectedNoPerPage
                });
            });

            it('should return not paginate state for invalid increment option (default to 10 per page)', () => {
                expect(handle.getPgnState({...mockIncrePgnOption, incrementIdx: 99})).toBeFalsy();
            });
        });
    });

    describe('Method: hsPage - Check if a requested page is valid or exist', () => {
        // Aassume 3 pages
        const page1: number = 0;
        const page2: number = 1;
        const page3: number = 2;

        describe('check requested page is valid', () => {
            it('should return false if requested page type does not match', () => {
                const mockInvalidTypeQuery: IPageQuery = {lastPage: page3, type: '', targetPage: 0};

                expect(handle.hsPage(mockInvalidTypeQuery)).toBe(false);
                expect(isGteZeroSpy).toHaveBeenCalledTimes(2);
            });

            it('should return false if requested last page is not gte 0 regardless of type and target page', () => {
                const mockInvalidLastPageQuery = {lastPage: page3, targetPage: 0} as IPageQuery;
                isGteZeroSpy.mockReturnValue(false);

                expect(handle.hsPage({...mockInvalidLastPageQuery, type: 'prev'})).toBe(false);
                expect(handle.hsPage({...mockInvalidLastPageQuery, type: 'next'})).toBe(false);
                expect(handle.hsPage({...mockInvalidLastPageQuery, type: 'first'})).toBe(false);
                expect(handle.hsPage({...mockInvalidLastPageQuery, type: 'last'})).toBe(false);
                expect(handle.hsPage({...mockInvalidLastPageQuery, type: 'page'})).toBe(false);
            });
        });

        describe('check if there is previous page', () => {
            const mock3PageBaseQuery = {lastPage: page3, type: 'prev'} as IPageQuery;
            const getPrevPage = (currPage: number): number => currPage - 1;

            it('should return true if previous page index is gte 0 and lt current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page2, targetPage: getPrevPage(page2)})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page3, targetPage: getPrevPage(page3)})).toBe(true);
            });

            it('should return false if previous page index is lt 0 or gte to current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: getPrevPage(page1)})).toBe(false);
            });
        });

        describe('check if there is next page', () => {
            const mock3PageBaseQuery = {lastPage: page3, type: 'next'} as IPageQuery;
            const getNextPage = (currPage: number): number => currPage + 1;

            it('should return true if next page index gt current page index and lte last page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: getNextPage(page1)})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page2, targetPage: getNextPage(page2)})).toBe(true);
            });

            it('should return false if next page index lte last page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page3, targetPage: getNextPage(page3)})).toBe(false);
            });
        });

        describe('check if there is first page', () => {
            const mock3PageBaseQuery = {lastPage: page3, type: 'first'} as IPageQuery;

            it('should return true if current page index is not 0 and first page index is lt current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page2, targetPage: 0})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page3, targetPage: 0})).toBe(true);
            });

            it('should return false if current page index is 0 or first page index is gte than current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: 0})).toBe(false);
            });
        });

        describe('check if there is last page', () => {
            const mock3PageBaseQuery = {lastPage: page3, type: 'last'} as IPageQuery;

            it('should return true if last page index is gt current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: page3})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page2, targetPage: page3})).toBe(true);
            });

            it('should return false if last page index is lte current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page3, targetPage: page3})).toBe(false);
            });
        });

        describe('check if there is a specific page index', () => {
            const mock3PageBaseQuery = {lastPage: page3, type: 'page'} as IPageQuery;

            beforeEach(() => {
                isGteZeroSpy.mockReturnValue(true);
            });

            it('should return true if the page index is a number gte 0, not same as current page index and lte last page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: page2})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: page3})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page2, targetPage: page1})).toBe(true);
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page2, targetPage: page3})).toBe(true);
            });

            it('should return false if the page index is same as current page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: page1})).toBe(false);
            });

            it('should return false if the page index is gt last page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: 4})).toBe(false);
            });
        });
    });
});