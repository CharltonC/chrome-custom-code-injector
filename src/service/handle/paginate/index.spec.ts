import { IState, ISliceIdx, ISliceScope, IOptionValidity, IPerPageConfig } from './type';
import { PgnHandle } from './';

describe('Class - Paginate Handle', () => {
    let pgnHandle: PgnHandle;

    beforeEach(() => {
        pgnHandle = new PgnHandle();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method: pgnHandle.hsPage - Check if a requested page is valid or exist', () => {
        const mock1PageLastPage: number = 0;
        const mock3PageLastPage: number = 2;
        const mock1stCurrPage: number = 0;
        const mock2ndCurrPage: number = 1;
        const mock3rdCurrPage: number = 2;
        let isGteZeroSpy: jest.SpyInstance;

        beforeEach(() => {
            isGteZeroSpy = jest.spyOn(pgnHandle, 'isGteZero');
        });

        describe('check provided last page and current page', () => {
            beforeEach(() => {
                isGteZeroSpy.mockReturnValue(false);
            });

            it('should return false if provided last page and current page are not gte 0', () => {
                expect(pgnHandle.hsPage('prev', mock3PageLastPage)).toBe(false);
                expect(pgnHandle.hsPage('next', mock3PageLastPage)).toBe(false);
                expect(pgnHandle.hsPage('first', mock3PageLastPage)).toBe(false);
                expect(pgnHandle.hsPage('last', mock3PageLastPage)).toBe(false);
                expect(pgnHandle.hsPage(0, mock3PageLastPage)).toBe(false);
                expect(isGteZeroSpy).toHaveBeenCalledTimes(5);
                expect(isGteZeroSpy).toHaveBeenCalledWith([mock3PageLastPage, 0]);
            });
        });

        describe('check if there is previous page', () => {
            it('should return true if previous page index is gte 0 and lt current page index', () => {
                expect(pgnHandle.hsPage('prev', mock3PageLastPage, mock2ndCurrPage)).toBe(true);
                expect(pgnHandle.hsPage('prev', mock3PageLastPage, mock3rdCurrPage)).toBe(true);
            });

            it('should return false if previous page index is lt 0 or gte to current page index', () => {
                expect(pgnHandle.hsPage('prev', mock3PageLastPage, mock1stCurrPage)).toBe(false);
            });
        });

        describe('check if there is next page', () => {
            it('should return true if next page index gt current page index and lte last page index', () => {
                expect(pgnHandle.hsPage('next', mock3PageLastPage, mock1stCurrPage)).toBe(true);
                expect(pgnHandle.hsPage('next', mock3PageLastPage, mock2ndCurrPage)).toBe(true);
            });

            it('should return false if next page index lte last page index', () => {
                expect(pgnHandle.hsPage('next', mock3PageLastPage, mock3rdCurrPage)).toBe(false);
            });
        });

        describe('check if there is first page', () => {
            it('should return true if current page index is not 0 and first page index is lt current page index', () => {
                expect(pgnHandle.hsPage('first', mock3PageLastPage, mock2ndCurrPage)).toBe(true);
                expect(pgnHandle.hsPage('first', mock3PageLastPage, mock3rdCurrPage)).toBe(true);
            });

            it('should return false if current page index is 0 or first page index is gte than current page index', () => {
                expect(pgnHandle.hsPage('first', mock3PageLastPage, mock1stCurrPage)).toBe(false);
            });
        });

        describe('check if there is last page', () => {
            it('should return true if last page index is gt current page index', () => {
                expect(pgnHandle.hsPage('last', mock3PageLastPage, mock1stCurrPage)).toBe(true);
                expect(pgnHandle.hsPage('last', mock3PageLastPage, mock2ndCurrPage)).toBe(true);
            });

            it('should return false if last page index is lte current page index', () => {
                expect(pgnHandle.hsPage('last', mock3PageLastPage, mock3rdCurrPage)).toBe(false);
            });
        });

        describe('check if there is a specific page index', () => {
            beforeEach(() => {
                isGteZeroSpy.mockReturnValue(true);
            });

            it('should return true if the page index is a number gte 0, not same as current page index and lte last page index', () => {
                expect(pgnHandle.hsPage(1, mock3PageLastPage, mock1stCurrPage)).toBe(true);
                expect(pgnHandle.hsPage(2, mock3PageLastPage, mock1stCurrPage)).toBe(true);
                expect(pgnHandle.hsPage(0, mock3PageLastPage, mock2ndCurrPage)).toBe(true);
                expect(pgnHandle.hsPage(2, mock3PageLastPage, mock2ndCurrPage)).toBe(true);
            });

            it('should return false if the page index is same as current page index', () => {
                expect(pgnHandle.hsPage(0, mock3PageLastPage, mock1stCurrPage)).toBe(false);
            });

            it('should return false if the page index is gt than last page index', () => {
                expect(pgnHandle.hsPage(4, mock3PageLastPage, mock1stCurrPage)).toBe(false);
            });
        });
    });
});