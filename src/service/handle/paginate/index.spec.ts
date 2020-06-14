import { IState, IPageQuery } from './type';
import { PgnHandle } from './';

describe('Class - Paginate Handle', () => {
    let handle: PgnHandle;

    beforeEach(() => {
        handle = new PgnHandle();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method: hsPage - Check if a requested page is valid or exist', () => {
        // Aassume 3 pages
        const page1: number = 0;
        const page2: number = 1;
        const page3: number = 2;
        let isGteZeroSpy: jest.SpyInstance;

        beforeEach(() => {
            isGteZeroSpy = jest.spyOn(handle, 'isGteZero');
        });

        describe('check provided last page and current page', () => {
            it('should return false if provided page type does not match', () => {
                const mockInvalidTypeQuery: IPageQuery = {lastPage: page3, type: '', targetPage: 0};

                expect(handle.hsPage(mockInvalidTypeQuery)).toBe(false);
                expect(isGteZeroSpy).toHaveBeenCalledTimes(2);
            });

            it('should return false if provided last page is not gte 0 regardless of type and target page', () => {
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

            it('should return false if the page index is gt than last page index', () => {
                expect(handle.hsPage({...mock3PageBaseQuery, currPage: page1, targetPage: 4})).toBe(false);
            });
        });
    });
});