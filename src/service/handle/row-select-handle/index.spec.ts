import { TestUtil } from '../../../asset/ts/test-util';
import { RowSelectHandle } from '.';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { IState } from './type';

describe('Row Select Handle', () => {
    let handle: RowSelectHandle;
    let spy: TMethodSpy<RowSelectHandle>;

    beforeEach(() => {
        handle = new RowSelectHandle();
        spy = TestUtil.spyMethods(handle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - getState: get state based on option', () => {
        const mockSelectAllState = 'ALL';
        const mockSelectOneState = 'ONE';

        beforeEach(() => {
            spy.toggleSelectAll.mockReturnValue(mockSelectAllState);
            spy.toggleSelectOne.mockReturnValue(mockSelectOneState);
        });

        it('should return the state by default option', () => {
            expect(handle.getState()).toBe(mockSelectAllState);
        });

        it('should return the state by provided option', () => {
            expect(handle.getState({isAll: false})).toBe(mockSelectOneState);
        });
    });

    describe('Method - toggleSelectAll: Select/Unselect all rows', () => {
        it('should return all selected', () => {
            expect(handle.toggleSelectAll({ areAllRowsSelected: false } as IState)).toEqual({
                areAllRowsSelected: true,
                selectedRowKeys: {},
            });
        });

        it('should return all unselected', () => {
            expect(handle.toggleSelectAll({ areAllRowsSelected: true } as IState)).toEqual({
                areAllRowsSelected: false,
                selectedRowKeys: {},
            });
        });
    });

    describe('Method - toggleSelectOne: Select/Unselect a single row', () => {
        it('should return partially selected state when all rows are currently selected', () => {
            const mockCurrState = { areAllRowsSelected: true, selectedRowKeys: {} };

            expect(handle.toggleSelectOne(mockCurrState, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 3
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeys: { 1: true, 2: true, }
            });

            expect(handle.toggleSelectOne(mockCurrState, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 1
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeys: { 2: true, 3: true, }
            });

            expect(handle.toggleSelectOne({ ...mockCurrState, selectedRowKeys: { 1: true } }, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 1
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeys: { 2: true, 3: true }
            });
        });

        it('should return state when all rows are currently unselected', () => {
            const mockCurrState = {
                areAllRowsSelected: false,
                selectedRowKeys: { 1: true }
            };

            expect(handle.toggleSelectOne(mockCurrState, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 1
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeys: {}
            });

            expect(handle.toggleSelectOne(mockCurrState, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 2
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeys: { 1: true, 2: true }
            });

            const modState = handle.toggleSelectOne(mockCurrState, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 2
            });
            expect(handle.toggleSelectOne(modState, {
                startRowIdx: 1,
                endRowIdx: 4,
                rowIdx: 3
            })).toEqual({
                areAllRowsSelected: true,
                selectedRowKeys: {}
            })
        });

        it('should throw error when row index is in conflict with either row start index or row end index', () => {
            const mockCurrState = { areAllRowsSelected: true, selectedRowKeys: {} };

            expect(() => {
                handle.toggleSelectOne(mockCurrState, {
                    startRowIdx: 1,
                    endRowIdx: 2,
                    rowIdx: 10
                });
            }).toThrowError(handle.ROW_IDX_ERR);

            expect(() => {
                handle.toggleSelectOne(mockCurrState, {
                    startRowIdx: 1,
                    endRowIdx: 2,
                    rowIdx: 2
                });
            }).toThrowError(handle.ROW_IDX_ERR);
        });
    });

    describe('Method - toggleSelect', () => {
        const mockRowIdx = 1;
        const mockSelectIndexes = {};

        it('should toggle', () => {
            handle.toggleSelect(mockSelectIndexes, mockRowIdx);
            expect(mockSelectIndexes[mockRowIdx]).toBeTruthy();

            handle.toggleSelect(mockSelectIndexes, mockRowIdx, false);
            expect(mockSelectIndexes[mockRowIdx]).toBeFalsy();
        });
    });
});