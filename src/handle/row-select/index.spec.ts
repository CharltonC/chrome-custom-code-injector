import { TestUtil } from '../../asset/ts/test-util';
import { RowSelectHandle } from '.';
import { AMethodSpy } from '../../asset/ts/test-util/type';
import { IState } from './type';

describe('Row Select Handle', () => {
    let handle: RowSelectHandle;
    let spy: AMethodSpy<RowSelectHandle>;

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

    describe('Method - distillState: get a more detailed state to differentiate single selected or all selected', () => {
        it('should return the distilled state when all rows are selected', () => {
            expect(handle.distillState({
                areAllRowsSelected: true,
                selectedRowKeyCtx: {}
            })).toEqual({
                isPartiallySelected: false,
                hasSelected: true,
            });
        });

        it('should return the distilled state when single row is selected', () => {
            expect(handle.distillState({
                areAllRowsSelected: false,
                selectedRowKeyCtx: { lorem: true }
            })).toEqual({
                isPartiallySelected: true,
                hasSelected: true,
            });
        });

        it('should return the distilled state when multiple rows are selected', () => {
            expect(handle.distillState({
                areAllRowsSelected: false,
                selectedRowKeyCtx: { lorem: true, sum: true }
            })).toEqual({
                isPartiallySelected: true,
                hasSelected: true,
            });
        });

        it('should return the distilled state when no rows are selected', () => {
            expect(handle.distillState({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {}
            })).toEqual({
                isPartiallySelected: false,
                hasSelected: false,
            });
        });
    });

    describe('Method - toggleSelectAll: Select/Unselect all rows', () => {
        it('should return all selected if no rows are currently selected', () => {
            expect(handle.toggleSelectAll({ areAllRowsSelected: false } as IState)).toEqual({
                areAllRowsSelected: true,
                selectedRowKeyCtx: {},
            });
        });

        it('should return all unselected if no rows are currently selected', () => {
            expect(handle.toggleSelectAll({ areAllRowsSelected: true } as IState)).toEqual({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {},
            });
        });

        it('should return all unselected if 1 or more rows are selected', () => {
            const mockSelectedRowKeys = { '0': true };
            expect(handle.toggleSelectAll({
                areAllRowsSelected: false,
                selectedRowKeyCtx: mockSelectedRowKeys
            } as IState)).toEqual({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {},
            });
        });
    });

    describe('Method - toggleSelectOne: Select/Unselect a single row', () => {
        const mockRows = [
            { id: 'one' },
            { id: 'two' },
            { id: 'three' },
        ];

        it('should return state where all other rows selected except target row', () => {
            const mockCurrState = {
                areAllRowsSelected: true,
                selectedRowKeyCtx: {}
            };

            expect(handle.toggleSelectOne(mockCurrState, {
                rows: mockRows,
                rowKey: 'one'
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {
                    'two': true,
                    'three': true,
                }
            });
        });

        it('should return state where target row is toggled when not all rows are selected', () => {
            const mockCurrState = {
                areAllRowsSelected: false,
                selectedRowKeyCtx: {
                    'one': true,
                    'two': true
                }
            };

            expect(handle.toggleSelectOne(mockCurrState, {
                rows: mockRows,
                rowKey: 'one'
            })).toEqual({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {
                    'two': true,
                }
            });
        });

        it('should return state where all rows are selected when all rows are selected except target row', () => {
            const mockCurrState = {
                areAllRowsSelected: false,
                selectedRowKeyCtx: {
                    'one': true,
                    'two': true
                }
            };

            expect(handle.toggleSelectOne(mockCurrState, {
                rows: mockRows,
                rowKey: 'three'
            })).toEqual({
                areAllRowsSelected: true,
                selectedRowKeyCtx: {}
            });
        });
    });

    describe('Method - toggleSelect', () => {
        const mockRowKey = 'mock-row-key';
        const mockSelectIndexes = {};

        it('should toggle', () => {
            handle.toggleSelect(mockSelectIndexes, mockRowKey);
            expect(mockSelectIndexes[mockRowKey]).toBeTruthy();

            handle.toggleSelect(mockSelectIndexes, mockRowKey, false);
            expect(mockSelectIndexes[mockRowKey]).toBeFalsy();
        });
    });

    describe('Method - Getters', () => {
        it('should return default option', () => {
            expect(handle.defOption).toEqual({
                isAll: true,
                rowsCtx: null,
                currState: {
                    areAllRowsSelected: false,
                    selectedRowKeyCtx: {},
                }
            });
        });

        it('should return default state', () => {
            expect(handle.defState).toEqual({
                areAllRowsSelected: false,
                selectedRowKeyCtx: {}
            });
        });
    });
});