import { TMethodSpy } from '../../asset/ts/test-util/type';
import { TestUtil } from '../../asset/ts/test-util';
import {
    IState, IOption,
    IPageNavQuery,
    IPageCtx, IPageSlice, IPageRange, IRelPage, IRelPageCtx, ISpreadCtx,
    ICmpAttrQuery, TPageList,
} from './type';
import { PgnHandle } from '.';

describe('Class - Paginate Handle', () => {
    let handle: PgnHandle;
    let defOption: IOption;
    let spy: TMethodSpy<PgnHandle>;

    beforeEach(() => {
        handle = new PgnHandle();
        defOption = handle.getDefOption();
        spy = TestUtil.spyMethods(handle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method Group - Full State and Option', () => {
        describe('Method: createState - Get Pagination state based on list and user option', () => {
            const mockList: any[] = ['a', 'b', 'c', 'd', 'e', 'f'];

            describe('test with spied/mocked methods', () => {
                const mockPgnOption: Partial<IOption> = {};
                const mockNoPerPage: number = 20;
                const mockEmptyObj = {};
                let increment: number[];
                let incrementIdx: number;

                beforeEach(() => {
                    ({ increment, incrementIdx } = defOption);
                    spy.getNoPerPage.mockReturnValue(mockNoPerPage);
                    spy.getDefState.mockReturnValue(mockEmptyObj);
                    spy.getTotalPage.mockReturnValue(1);
                    spy.getRecordCtx.mockReturnValue(mockEmptyObj);
                    spy.getSpreadCtx.mockReturnValue(mockEmptyObj);
                });

                it('should return def paginate state when list only has 1 or less items', () => {
                    expect(handle.createState(['a'], mockPgnOption)).toEqual(mockEmptyObj);
                    expect(spy.getDefOption).toHaveBeenCalled();
                    expect(spy.getNoPerPage).toHaveBeenCalledWith(increment, incrementIdx, increment[0]);
                    expect(spy.getDefState).toHaveBeenCalledWith(1, mockNoPerPage);
                    expect(spy.getTotalPage).not.toHaveBeenCalled();
                });

                it('should return def paginate state when total page is lte 1', () => {
                    expect(handle.createState(mockList, mockPgnOption)).toEqual(mockEmptyObj);
                    expect(spy.getDefOption).toHaveBeenCalled();
                    expect(spy.getNoPerPage).toHaveBeenCalledWith(increment, incrementIdx, increment[0]);
                    expect(spy.getTotalPage).toHaveBeenCalledWith(mockList.length, mockNoPerPage);
                    expect(spy.getDefState).toHaveBeenCalledWith(mockList.length, mockNoPerPage);
                    expect(spy.getCurrPage).not.toHaveBeenCalled();
                });

                it('should return paginate state when total list has more than 1 items and total page is more than 1', () => {
                    const { page } = defOption;

                    const mockCurrPage: number = 0;
                    const mockCurrPageNo: number = 1;
                    const mockCurrPageCtx: IPageCtx = {curr: mockCurrPage, pageNo: mockCurrPageNo};
                    const mockTotalPage: number = 20;
                    const mockSliceIdx: IPageSlice = {startIdx: 0, endIdx: 1};
                    const mockRelPage: IRelPage = {first: 1, prev: 1, next: 1, last: 1};
                    const mockRelPageCtx: IRelPageCtx = {first: true, prev: true, next: true, last: true};
                    const mockParsedRelPage: IRelPage = {first: 2, prev: 2, next: 2, last: 2};
                    const mockSpread: ISpreadCtx = { ltSpread: [], rtSpread: [], maxSpread: 1}

                    spy.getTotalPage.mockReturnValue(mockTotalPage);
                    spy.getCurrPage.mockReturnValue(mockCurrPageCtx);
                    spy.getPageSliceIdx.mockReturnValue(mockSliceIdx);
                    spy.getRelPage.mockReturnValue(mockRelPage);
                    spy.getRelPageCtx.mockReturnValue(mockRelPageCtx);
                    spy.parseRelPage.mockReturnValue(mockParsedRelPage);
                    spy.getSpreadCtx.mockReturnValue(mockSpread);

                    expect(handle.createState(mockList, mockPgnOption)).toEqual({
                        ...mockSliceIdx,
                        ...mockParsedRelPage,
                        ...mockSpread,
                        curr: mockCurrPage,
                        pageNo: mockCurrPageNo,
                        perPage: mockNoPerPage,
                        totalPage: mockTotalPage
                    });
                    expect(spy.getDefOption).toHaveBeenCalled();
                    expect(spy.getNoPerPage).toHaveBeenCalledWith(increment, incrementIdx, increment[0]);
                    expect(spy.getDefState).toHaveBeenCalledWith(mockList.length, mockNoPerPage);
                    expect(spy.getTotalPage).toHaveBeenCalledWith(mockList.length, mockNoPerPage);
                    expect(spy.getCurrPage).toHaveBeenCalledWith(page, mockTotalPage-1);
                    expect(spy.getPageSliceIdx).toHaveBeenCalledWith(mockList, mockNoPerPage, page);
                    expect(spy.getRelPage).toHaveBeenCalledWith(mockTotalPage, page);
                    expect(spy.getRelPageCtx).toHaveBeenCalledWith({curr: page, last: mockRelPage.last}, mockRelPage);
                    expect(spy.getSpreadCtx).toHaveBeenCalledWith(mockCurrPageNo, mockTotalPage, 3);
                    expect(spy.parseRelPage).toHaveBeenCalledWith(mockRelPage, mockRelPageCtx);
                });
            });

            describe('test with unspied/unmocked methods', () => {
                const mockPerPage: number = 4;
                const mockPgnOption: Partial<IOption> = { increment: [mockPerPage] };

                it('should return paginate state by default', () => {
                    expect(handle.createState(mockList, mockPgnOption)).toEqual({
                        curr: 0,
                        startIdx: 0,
                        endIdx: 4,
                        first: null,
                        prev: null,
                        next: 1,
                        last: 1,
                        pageNo: 1,
                        totalPage: 2,
                        perPage: mockPerPage,
                        startRecord: 1,
                        endRecord: 4,
                        totalRecord: mockList.length,
                        ltSpread: null,
                        rtSpread: null,
                        maxSpread: 3,
                    });
                });

                it('should return paginate state when provided current page index', () => {
                    const mockCurrPage: number = 1;
                    expect(handle.createState(mockList, {...mockPgnOption, page: mockCurrPage})).toEqual({
                        curr: mockCurrPage,
                        startIdx: 4,
                        endIdx: undefined,
                        first: 0,
                        prev: 0,
                        next: null,
                        last: null,
                        pageNo: 2,
                        totalPage: 2,
                        perPage: mockPerPage,
                        startRecord: 5,
                        endRecord: 6,
                        totalRecord: mockList.length,
                        ltSpread: null,
                        rtSpread: null,
                        maxSpread: 3,
                    });
                });
            });
        });

        describe('Method: getDefState - Get Default Pagination state where there is only one page', () => {
            beforeEach(() => {
                spy.getRecordCtx.mockReturnValue({});
            });

            it('should return default state', () => {
                const mockTotalRecord: number = 0;
                const mockPerPage: number = 1;

                expect(handle.getDefState(mockTotalRecord, mockPerPage)).toEqual({
                    perPage: mockPerPage,
                    startIdx: 0,
                    pageNo: 1,
                    totalPage: 1
                });
            });
        });

        describe('Method: createOption - Create a new Pagination option from an option merged with either default or custom existing option', () => {
            const mockOption: Partial<IOption> = { page: 2 };

            it('should return an option merged with default option when existing option is not provided', () => {
                spy.getDefOption.mockReturnValue({});
                expect(handle.createOption(mockOption)).toEqual(mockOption);
                expect(spy.getDefOption).toHaveBeenCalled();
            });

            it('should return an option merged with existing option when it is provided', () => {
                const mockExistOption = {} as IOption;
                expect(handle.createOption(mockOption, mockExistOption)).toEqual(mockOption);
                expect(spy.getDefOption).not.toHaveBeenCalled();
            });
        });

        describe('Method: getDefOption - Get Default Pagination Option', () => {
            it('should have default values', () => {
                expect(handle.getDefOption()).toEqual({
                    page: 0,
                    increment: [10],
                    incrementIdx: 0,
                    maxSpread: 3
                });
            });
        });
    });

    describe('Method Group - Partial State', () => {
        describe('Method: getRecordCtx - Get Record Context', () => {
            it('should return the record context when total record is 0', () => {
                const mockTotalRecord: number = 0;

                expect(handle.getRecordCtx(mockTotalRecord, 1)).toEqual({
                    startRecord: mockTotalRecord,
                    endRecord: mockTotalRecord,
                    totalRecord: mockTotalRecord
                });
                expect(handle.getRecordCtx(mockTotalRecord, 1, 2)).toEqual({
                    startRecord: mockTotalRecord,
                    endRecord: mockTotalRecord,
                    totalRecord: mockTotalRecord
                });
            });

            it('should return the record context when total record is not 0', () => {
                const mockTotalRecord: number = 1;
                const mockStartIdx: number = 0;
                const mockEndIdx: number = 2;

                expect(handle.getRecordCtx(mockTotalRecord, mockStartIdx)).toEqual({
                    startRecord: mockStartIdx+1,
                    endRecord: mockTotalRecord,
                    totalRecord: mockTotalRecord
                });
                expect(handle.getRecordCtx(mockTotalRecord, mockStartIdx, mockEndIdx)).toEqual({
                    startRecord: mockStartIdx+1,
                    endRecord: mockEndIdx,
                    totalRecord: mockTotalRecord
                });
            });
        });

        describe('Method: getNoPerPage - Get the total per page', () => {
            const mockIncrm: number[] = [1,2,3];
            const fallbackVal: number = 1;
            const mockIncrmIdx: number = 0;

            it('should return the provided increment value if the provided increment is valid', () => {
                expect(handle.getNoPerPage(mockIncrm, mockIncrmIdx, fallbackVal)).toEqual(mockIncrm[mockIncrmIdx]);
            });

            it('should return the fallback increment value if no increments are provided', () => {
                expect(handle.getNoPerPage([], mockIncrmIdx, fallbackVal)).toEqual(fallbackVal);
            });

            it('should return the fallback increment value if the provided increment is negative number', () => {
                const mockIncrmVal: number = -1;
                expect(handle.getNoPerPage([mockIncrmVal], 0, fallbackVal)).toEqual(fallbackVal);
            });

            it('should return the fallback increment value if the provided increment does not exist', () => {
                expect(handle.getNoPerPage(mockIncrm, 10, fallbackVal)).toEqual(fallbackVal);
            });
        });

        describe('Method: parseNoPerPage - Parse the total per page', () => {
            it('should parse the increment values by removing any negative increment value', () => {
                expect(handle.parseNoPerPage([1,-1,3])).toEqual([1,3]);
                expect(handle.parseNoPerPage([1,2])).toEqual([1,2]);
            });
        });

        describe('Method: getTotalPage - Get total no. of pages available based on total per page', () => {
            const mockNoPerPage: number = 2;

            it('should return a rounded total no. of pages if total list items is greater than total per page', () => {
                const mockListLen: number = 3;
                expect(handle.getTotalPage(mockListLen, mockNoPerPage)).toBe(2);
            });

            it('should return 1 if total list items is lte total per page', () => {
                const mockListLen: number = 1;
                expect(handle.getTotalPage(mockListLen, mockNoPerPage)).toBe(1);
            });
        });

        describe('Method: getCurrPage - Get a validated/parsed value for current page index and current page number', () => {
            it('should return the parsed current page if its within allowed range', () => {
                expect(handle.getCurrPage(1, 2)).toEqual({curr: 1, pageNo: 2});
            });

            it('should return default value 0 if the current page isnt within allowed range', () => {
                expect(handle.getCurrPage(-1, 2)).toEqual({curr: 0, pageNo: 1});
                expect(handle.getCurrPage(3, 2)).toEqual({curr: 0, pageNo: 1});
            });
        });

        describe('Method: getRelPage - Get the index for relevant pages based on the current page and total number of page', () => {
            const mockTotalPage: number = 2;
            const mockCurrPage: number = 0;

            it('should return the index for relevant pages', () => {
                expect(handle.getRelPage(mockTotalPage, mockCurrPage)).toEqual({
                    first: 0,
                    prev: -1,
                    next: 1,
                    last: 1
                });
            });
        });

        describe('Method: getRealPageCtx - Check if relevant pages are valid based on their context', () => {
            const mockPageRang: IPageRange = {curr: 0, last: 0};
            const mockRelPage: IRelPage = { first: 1, prev: 1, next: 1, last: 1 };

            it('should return relevant page with false value if it is valid (i.e. navigatable to that page)', () => {
                spy.canNavToPage.mockReturnValue(true);

                expect(handle.getRelPageCtx(mockPageRang, mockRelPage)).toEqual({
                    first: true, prev: true, next: true, last: true
                });
            });

            it('should return relevant page with false value if it is invalid (i.e. unnavigatable to that page)', () => {
                spy.canNavToPage.mockReturnValue(false);

                expect(handle.getRelPageCtx(mockPageRang, mockRelPage)).toEqual({
                    first: false, prev: false, next: false, last: false
                });
            });
        });

        describe('Method: parseRelPage - Parse the value for the relevant pages if they are invalid', () => {
            const mockRelPage: IRelPage = { first: 1, prev: 1, next: 1, last: 1 };
            const mockRelPageCtx: IRelPageCtx = { first: true, prev: true, next: true, last: false };

            it('should pasrse the and replaced the invalid value of relevant pages to be undefined', () => {
                expect(handle.parseRelPage(mockRelPage, mockRelPageCtx)).toEqual({...mockRelPage, last: null});
            });
        });

        describe('Method: getPageSliceIdx - Get the corresponding slice index for `slice` in the list array based on a provided page index', () => {
            const mockList: any[] = [];
            const mockPerPage: number = 2;
            const mockPage: number = 1;
            let slice: IPageSlice

            it('should return the index if it exists in the list array', () => {
                spy.isDefined.mockReturnValue(true);
                slice = handle.getPageSliceIdx(mockList, mockPerPage, mockPage);

                expect(slice).toEqual({startIdx: 2, endIdx: 4});
            });

            it('should return the index if it doesnt exist in the list array', () => {
                spy.isDefined.mockReturnValue(false);
                slice = handle.getPageSliceIdx(mockList, mockPerPage, mockPage);

                expect(slice).toEqual({startIdx: undefined, endIdx: undefined});
            });
        });

        describe('Method: getSpreadCtx - Get the page index for the left and right spread in relation to current page', () => {
            const { getSpreadCtx } = PgnHandle.prototype;
            const totalPage: number = 10;

            it('should return spread context with max spread of default 3 pages', () => {
                expect(getSpreadCtx(1, totalPage)).toEqual({
                    ltSpread: null,
                    rtSpread: [2,3,4,'...'],
                    maxSpread: 3
                });

                expect(getSpreadCtx(2, totalPage)).toEqual({
                    ltSpread: null,
                    rtSpread: [3,4,5,'...'],
                    maxSpread: 3
                });

                expect(getSpreadCtx(3, totalPage)).toEqual({
                    ltSpread: [2],
                    rtSpread: [4,5,6,'...'],
                    maxSpread: 3
                });

                expect(getSpreadCtx(7, totalPage)).toEqual({
                    ltSpread: ['...',4,5,6],
                    rtSpread: [8,9],
                    maxSpread: 3
                });

                expect(getSpreadCtx(10, totalPage)).toEqual({
                    ltSpread: ['...',7,8,9],
                    rtSpread: null,
                    maxSpread: 3
                });
            });

            it('should return spread context with max spread of custom pages', () => {
                const customMaxSpread: number = 5;

                expect(getSpreadCtx(1, totalPage, customMaxSpread)).toEqual({
                    ltSpread: null,
                    rtSpread: [2,3,4,5,6,'...'],
                    maxSpread: 5
                });

                expect(getSpreadCtx(7, totalPage, customMaxSpread)).toEqual({
                    ltSpread: [2,3,4,5,6],
                    rtSpread: [8,9],
                    maxSpread: 5
                });

                expect(getSpreadCtx(8, totalPage, customMaxSpread)).toEqual({
                    ltSpread: ['...',3,4,5,6,7],
                    rtSpread: [9],
                    maxSpread: 5
                });
            });
        });

        describe('Method: getPageIdxForSpread -  calculating corresponding page index for left/right spread', () => {
            const { getPageIdxForSpread } = PgnHandle.prototype;
            const mockMaxSpread: number = 3;

              it('should return the page index for left spread', () => {
                const mockCurrPageIdx: number = 9;
                const pageIdx: number = getPageIdxForSpread(mockCurrPageIdx, mockMaxSpread, true);
                expect(pageIdx).toBe(5);
            });

            it('should return the page index for right spread', () => {
                const mockCurrPageIdx: number = 0;
                const pageIdx: number = getPageIdxForSpread(mockCurrPageIdx, mockMaxSpread, false);
                expect(pageIdx).toBe(4);
            });
        });
    });

    describe('Method Group - Helper', () => {
        describe('Method: canNavToPage - Check if a requested page can be navigated to', () => {
            // Aassume 3 pages
            const PAGE1: number = 0;
            const PAGE2: number = 1;
            const PAGE3: number = 2;
            const mockCurrPage1: IPageRange = {last: PAGE3, curr: PAGE1 };
            const mockCurrPage2: IPageRange = {last: PAGE3, curr: PAGE2 };
            const mockCurrPage3: IPageRange = {last: PAGE3, curr: PAGE3 };

            beforeEach(() => {
                spy.isGteZero.mockReturnValue(true);
            });

            describe('check if page is valid', () => {
                it('should return false if current page or last page is less than 0', () => {
                    spy.isGteZero.mockReturnValue(false);

                    expect(handle.canNavToPage(mockCurrPage1, {type: ''})).toBe(false);
                    expect(spy.isGteZero).toHaveBeenCalledWith([PAGE1, PAGE3]);
                    expect(spy.isGteZero).toHaveBeenCalledTimes(1);
                });

                it('should return false if requested page type does not match', () => {
                    expect(handle.canNavToPage(mockCurrPage1, {type: ''})).toBe(false);
                    expect(spy.isGteZero).toHaveBeenCalledTimes(1);
                    expect(spy.isDefined).not.toHaveBeenCalled();
                });
            });

            describe('check if there is previous page', () => {
                it('should return true if previous page index is gte 0 and lt current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage2, {type: 'prev', target: PAGE3-1})).toBe(true);
                });

                it('should return false if previous page index is lt 0 or gte to current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, {type: 'prev', target: PAGE1-1})).toBe(false);
                });
            });

             describe('check if there is next page', () => {
                it('should return true if next page index gt current page index and lte last page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, {type: 'next', target: PAGE1+1})).toBe(true);
                });

                it('should return false if next page index lte last page index', () => {
                    expect(handle.canNavToPage(mockCurrPage3, {type: 'next', target: PAGE3+1})).toBe(false);
                });
            });

            describe('check if there is first page', () => {
                const mockTargetFirstPage: IPageNavQuery = {type: 'first', target: 0};

                it('should return true if current page index is not 0 and first page index is lt current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage2, mockTargetFirstPage)).toBe(true);
                });

                it('should return false if current page index is 0 or first page index is gte than current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, mockTargetFirstPage)).toBe(false);
                });
            });

            describe('check if there is last page', () => {
                const mockTargetLastPage: IPageNavQuery = {type: 'last', target: PAGE3};

                it('should return true if last page index is gt current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, mockTargetLastPage)).toBe(true);
                });

                it('should return false if last page index is lte current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage3, mockTargetLastPage)).toBe(false);
                });
            });

            describe('check if there is a specific page index', () => {
                it('should return true if the page index is a number gte 0, not same as current page index and lte last page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, {type: 'page',target: PAGE2})).toBe(true);
                    expect(handle.canNavToPage(mockCurrPage2, {type: 'page',target: PAGE1})).toBe(true);
                });

                it('should return false if the page index is same as current page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, {type: 'page',target: PAGE1})).toBe(false);
                });

                it('should return false if the page index is gt last page index', () => {
                    expect(handle.canNavToPage(mockCurrPage1, {type: 'page',target: 4})).toBe(false);
                });
            });
        });

        describe('Method: isDefined - Check if a value is define', () => {
            it('should return true if value is defined', () => {
                expect(handle.isDefined('')).toBe(true);
            });

            it('should return false if value isnt defined', () => {
                expect(handle.isDefined()).toBe(false);
            });
        });

        describe('Method: isGteZero - Check if a value or an array of value is an interger and also greater or equal to 0', () => {
            it('should return true if it or all of the values are an interger and gte 0', () => {
                expect(handle.isGteZero(1)).toBe(true);
                expect(handle.isGteZero([1, 2])).toBe(true);
            });

            it('should return false if it or one of the values isnt an interger or gte 0', () => {
                expect(handle.isGteZero(-1)).toBe(false);
                expect(handle.isGteZero(1.1)).toBe(false);
                expect(handle.isGteZero([0, -1])).toBe(false);
                expect(handle.isGteZero([0, 1.1])).toBe(false);
            });
        });
    });

    describe('Method Group - Generic Component Attributes', () => {
        const {
            getTextBtnAttr,
            getPerPageSelectAttr,
        } = PgnHandle.prototype;

        let mockEvtHandler: jest.Mock;

        beforeEach(() => {
            mockEvtHandler = jest.fn();
        });

        describe('Method - createGenericCmpAttr: Get Generic Attributes of a Pagination Component', () => {
            const mockOption = {} as IOption;

            const mockState = {
                first: 1,
                prev: 2,
                next: 3,
                last: 4,
                ltSpread: [5],
                rtSpread: [6]
            } as IState;

            const mockQuery = {
                data: [],
                option: mockOption,
                state: mockState,
                callback: mockEvtHandler
            } as ICmpAttrQuery;

            beforeEach(() => {
                spy.getGenericCmpEvtHandler.mockReturnValue(mockEvtHandler);
                spy.getTextBtnAttr.mockReturnValue({})
                spy.getSpreadBtnAttr.mockReturnValue({})
                spy.getPageSelectAttr.mockReturnValue({})
                spy.getPerPageSelectAttr.mockReturnValue({})
            });

            it('should return attributes when left/right spread exist', () => {
                expect(handle.createGenericCmpAttr(mockQuery)).toEqual({
                    firstBtnAttr: {},
                    prevBtnAttr: {},
                    nextBtnAttr: {},
                    lastBtnAttr: {},
                    ltSpreadBtnsAttr: [{}],
                    rtSpreadBtnsAttr: [{}],
                    pageSelectAttr: {},
                    perPageSelectAttr: {},
                });
            });

            it('should return attributes when left/right spread dont exist', () => {
                expect(handle.createGenericCmpAttr({
                    ...mockQuery,
                    state: {...mockState, ltSpread: null, rtSpread: null}
                })).toEqual({
                    firstBtnAttr: {},
                    prevBtnAttr: {},
                    nextBtnAttr: {},
                    lastBtnAttr: {},
                    ltSpreadBtnsAttr: null,
                    rtSpreadBtnsAttr: null,
                    pageSelectAttr: {},
                    perPageSelectAttr: {},
                });
            });
        });

        describe('Method - getTextBtnAttr: Get Generic Attributes of a Pagination Text Button Element (e.g. first, prev, next, last)', () => {
            it('should return attributes', () => {
                const mockTitle = 'lorem';
                const mockPageIdx = 1;
                const { onClick, ...attrs } = getTextBtnAttr(mockEvtHandler, [mockTitle, mockPageIdx]);
                onClick();

                expect(attrs).toEqual({
                    title: mockTitle,
                    disabled: false
                });
                expect(mockEvtHandler).toHaveBeenCalledWith({page: mockPageIdx});
            });
        });

        describe('Method - getSpreadBtnAttr: Get Generic Attributes of a Pagination Spread Button Element (e.g. `...`)', () => {
            const rtnTargetPageIdx: number = 99
            const mockState = { curr: 1, maxSpread: 3 } as IState;

            beforeEach(() => {
                spy.getPageIdxForSpread.mockReturnValue(rtnTargetPageIdx);
            });

            it('should return attributes for left spread button when it is a number', () => {
                const mockPage = 2;
                const mockIsLtSpread = true;
                const expTargetPageIdx = 0;

                const { title, isSpread, onClick } = handle.getSpreadBtnAttr(mockEvtHandler, mockState, [mockPage, mockIsLtSpread]);
                onClick();

                expect(title).toBe(mockPage);
                expect(isSpread).toBe(false);
                expect(mockEvtHandler).toHaveBeenCalledWith({page: expTargetPageIdx});
            });

            it('should return attributes for left spread button when it is not a number (i.e. a string symbol)', () => {
                const mockPage = '...';
                const mockIsLtSpread = true;

                const { title, isSpread, onClick } = handle.getSpreadBtnAttr(mockEvtHandler, mockState, [mockPage, mockIsLtSpread]);
                onClick();

                expect(title).toBe('left-spread');
                expect(isSpread).toBe(true);
                expect(mockEvtHandler).toHaveBeenCalledWith({page: rtnTargetPageIdx});
            });

            it('should return attributes for right spread button when it is a number', () => {
                const mockPage = 2;
                const mockIsLtSpread = false;
                const expTargetPageIdx = 2;

                const { title, isSpread, onClick } = handle.getSpreadBtnAttr(mockEvtHandler, mockState, [mockPage, mockIsLtSpread]);
                onClick();

                expect(title).toBe(mockPage);
                expect(isSpread).toBe(false);
                expect(mockEvtHandler).toHaveBeenCalledWith({page: expTargetPageIdx});
            });

            it('should return attributes for right spread button when it is not a number (i.e. a string symbol)', () => {
                const mockPage = '...';
                const mockIsLtSpread = false;

                const { title, isSpread, onClick } = handle.getSpreadBtnAttr(mockEvtHandler, mockState, [mockPage, mockIsLtSpread]);
                onClick();

                expect(title).toBe('right-spread');
                expect(isSpread).toBe(true);
                expect(mockEvtHandler).toHaveBeenCalledWith({page: rtnTargetPageIdx});
            });
        });

        describe('Method - getPageSelectAttr: Get Generic Attributes of a Pagination Page Select Element', () => {
            const pageNo: number = 4;
            const totalPage: number = 10;
            const ltSpread: TPageList = [2,3];
            const rtSpread: TPageList = [5,6];
            const mockEvt = { target: { value: 0 }};
            const mockTargetPageIdx: number = 99;
            let mockState;

            beforeEach(() => {
                spy.getTargetPageIdxByPos.mockReturnValue(mockTargetPageIdx);
                mockState = { pageNo, totalPage, ltSpread, rtSpread } as IState;
            });

            describe('regular scenarios - when current page is not first page or last page or total pages is more than 1', () => {
                it('should return attributes when both left and right spread exist', () => {
                    const { onSelect, ...attrs } = handle.getPageSelectAttr(mockEvtHandler, mockState);
                    onSelect(mockEvt);

                    expect(attrs).toEqual({
                        title: 'page select',
                        disabled: false,
                        options: [ 1,2,3,4,5,6,10 ],
                        selectedOptionValue: pageNo,
                        selectedOptionIdx: 3
                    });
                    expect(mockEvtHandler).toHaveBeenCalledWith({page: mockTargetPageIdx});
                });


                it('should return attributes when left spread doesnt exist', () => {
                    const { onSelect, ...attrs } = handle.getPageSelectAttr(mockEvtHandler, {...mockState, ltSpread: null});
                    onSelect(mockEvt);

                    expect(attrs).toEqual({
                        title: 'page select',
                        disabled: false,
                        options: [ 1,4,5,6,10 ],
                        selectedOptionValue: pageNo,
                        selectedOptionIdx: 1
                    });
                    expect(mockEvtHandler).toHaveBeenCalledWith({page: mockTargetPageIdx});
                });

                it('should return attributes when right spread doesnt exist', () => {
                    const { onSelect, ...attrs } = handle.getPageSelectAttr(mockEvtHandler, {...mockState, rtSpread: null});
                    onSelect(mockEvt);

                    expect(attrs).toEqual({
                        title: 'page select',
                        disabled: false,
                        options: [ 1,2,3,4,10 ],
                        selectedOptionValue: pageNo,
                        selectedOptionIdx: 3
                    });
                    expect(mockEvtHandler).toHaveBeenCalledWith({page: mockTargetPageIdx});
                });
            });

            describe('special scenarios - when current page is first page or last page or total page is 1', () => {
                it('should return attributes when current page is 1', () => {
                    const mockPageNo: number = 1;
                    mockState = {...mockState, pageNo: mockPageNo};

                    const { onSelect, ...attrs } = handle.getPageSelectAttr(mockEvtHandler, mockState);
                    onSelect(mockEvt);

                    const expectOptionIdx: number = 0;
                    const expectOptions: TPageList = [ mockPageNo, ...rtSpread, totalPage ];

                    expect(attrs).toEqual({
                        title: 'page select',
                        disabled: false,
                        options: expectOptions,
                        selectedOptionValue: mockPageNo,
                        selectedOptionIdx: expectOptionIdx
                    });
                    expect(mockEvtHandler).toHaveBeenCalledWith({page: mockTargetPageIdx});
                });

                it('should return attributes when current page is last page', () => {
                    mockState = {...mockState, totalPage: pageNo };
                    const expectOptions: TPageList = [ 1, ...ltSpread, pageNo ];
                    const expectOptionIdx: number = 1 + ltSpread.length;
                    const { onSelect, ...attrs } = handle.getPageSelectAttr(mockEvtHandler, mockState);
                    onSelect(mockEvt);

                    expect(attrs).toEqual({
                        title: 'page select',
                        disabled: false,
                        options: expectOptions,
                        selectedOptionValue: pageNo,
                        selectedOptionIdx: expectOptionIdx
                    });
                    expect(mockEvtHandler).toHaveBeenCalledWith({page: mockTargetPageIdx});
                });

                it('should return attributes when total page is 1', () => {
                    mockState = {...mockState, totalPage: 1 };
                    const expectOptions: TPageList = [ 1 ];
                    const expectOptionIdx: number = 0;
                    const { onSelect, ...attrs } = handle.getPageSelectAttr(mockEvtHandler, mockState);
                    onSelect(mockEvt);

                    expect(attrs).toEqual({
                        title: 'page select',
                        disabled: true,
                        options: expectOptions,
                        selectedOptionValue: pageNo,
                        selectedOptionIdx: expectOptionIdx
                    });
                    expect(mockEvtHandler).toHaveBeenCalledWith({page: mockTargetPageIdx});
                });
            });
        });

        describe('Method - getPerPageSelectAttr: Get Generic Attributes of a Pagination Per Page Select Element', () => {
            it('should return attributes', () => {
                const mockOption = {
                    increment: [10,20],
                    incrementIdx: 0
                } as IOption;
                const mockEvtTargetVal = 1;
                const mockEvt = { target: { value: mockEvtTargetVal} };

                const { onSelect, ...attrs } = getPerPageSelectAttr(mockEvtHandler, mockOption);
                onSelect(mockEvt);

                expect(attrs).toEqual({
                    title: 'per page select',
                    disabled: false,
                    options: mockOption.increment,
                    selectedOptionValue: 10,
                    selectedOptionIdx: mockOption.incrementIdx,
                });
                expect(mockEvtHandler).toHaveBeenCalledWith({
                    page: 0,
                    incrementIdx: mockEvtTargetVal
                });
            });
        });

        describe('Method - getGenericCmpEvtHandler: Create a common event handler function', () => {
            const mockRtnPgnOption = 'option';
            const mockRtnPgnState = 'state'

            beforeEach(() => {
                spy.createOption.mockReturnValue(mockRtnPgnOption);
                spy.createState.mockReturnValue(mockRtnPgnState);
            });

            it('should return the event handler function when callback is provided', () => {
                const mockData = [];
                const mockOption = {} as IOption;
                const mockModOption = { page: 1 } as IOption;

                const evtHandler = handle.getGenericCmpEvtHandler(mockData, mockOption, mockEvtHandler);
                evtHandler(mockModOption);

                expect(spy.createOption).toHaveBeenCalledWith(mockModOption, mockOption);
                expect(spy.createState).toHaveBeenCalledWith(mockData, mockRtnPgnOption);
                expect(mockEvtHandler).toHaveBeenCalledWith({
                    pgnOption: mockRtnPgnOption,
                    pgnState: mockRtnPgnState
                });
            });

            it('should return the event handler function when callback is not provided', () => {
                const mockData = [];
                const mockOption = {} as IOption;
                const mockModOption = { page: 1 } as IOption;

                const evtHandler = handle.getGenericCmpEvtHandler(mockData, mockOption);
                evtHandler(mockModOption);

                expect(spy.createOption).toHaveBeenCalledWith(mockModOption, mockOption);
                expect(spy.createState).toHaveBeenCalledWith(mockData, mockRtnPgnOption);
                expect(mockEvtHandler).not.toHaveBeenCalledWith();
            });
        });

        describe('method - getTargetPageIdxByPos: Get the corresponding target page index based on its index a list of pages', () => {
            const mockCurrPos: number = 0;
            const mockLeftPos: [number, number] = [ mockCurrPos, 1 ];
            const mockRightPos: [number, number] = [ mockCurrPos, -1 ];
            const mockPageNo: number = 5;
            const mockMaxSpread: number = 3;
            const mockState = { pageNo: mockPageNo, maxSpread: mockMaxSpread } as IState;
            const mockPageIdxForSpread: number = 99;

            beforeEach(() => {
                spy.getPageIdxForSpread.mockReturnValue(mockPageIdxForSpread);
            });

            it('should return the target page index when page is a number', () => {
                const mockPages = [ 8, 9, 10];
                expect(handle.getTargetPageIdxByPos(mockState, mockPages, mockLeftPos)).toBe(mockPages[mockCurrPos] - 1);
            });

            it('should return the target page index when page is not a number', () => {
                const mockPages = [ '...', 9, 10];
                expect(handle.getTargetPageIdxByPos(mockState, mockPages, mockLeftPos)).toBe(mockPageIdxForSpread);
                expect(handle.getTargetPageIdxByPos(mockState, mockPages, mockRightPos)).toBe(mockPageIdxForSpread);
            });
        });
    });
});