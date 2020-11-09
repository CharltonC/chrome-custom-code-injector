import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { IOption, IState, TItemCtx, IExpdBtnAttrQuery } from './type';
import { RowExpdHandle } from '.';

describe('Expand Handle', () => {
    const mockItemCtx = { itemId: 'lorem', itemLvl: 1 };
    const mockExpState = { [mockItemCtx.itemId]: mockItemCtx.itemLvl };
    let handle: RowExpdHandle;
    let spy: TMethodSpy<RowExpdHandle>;
    let mockCallback: jest.Mock;
    let mockExpdBtnAttrQuery: any;

    beforeEach(() => {
        handle = new RowExpdHandle();
        spy = TestUtil.spyMethods(handle);

        mockCallback = jest.fn();
        mockExpdBtnAttrQuery = {
            expdState: {},
            itemCtx: mockItemCtx,
            callback: mockCallback
        };
    });

    describe('Generic', () => {
        describe('Method - getExpdBtnAttr - Get Generic Attributes of Expand Button to be used in a Button Component', () => {
            const mockExpdBtnAttrQuery = {} as IExpdBtnAttrQuery;

            beforeEach(() => {
                spy.getBtnAttrForOneExpd.mockReturnValue('one-expd');
                spy.getBtnAttrForShowAll.mockReturnValue('show-all');
                spy.getBtnAttrForHideAll.mockReturnValue('hide-all');
            });

            it('should return attributes when expand mode is one expand per level', () => {
                spy.createOption.mockReturnValue({ onePerLevel: true });
                expect(handle.getExpdBtnAttr(mockExpdBtnAttrQuery)).toEqual('one-expd');
            });

            it('should return attributes when expand mode is show all', () => {
                spy.createOption.mockReturnValue({ showAll: true });
                expect(handle.getExpdBtnAttr(mockExpdBtnAttrQuery)).toEqual('show-all');
            });

            it('should return attributes when expand mode is hide all', () => {
                spy.createOption.mockReturnValue({ showAll: false });
                expect(handle.getExpdBtnAttr(mockExpdBtnAttrQuery)).toEqual('hide-all');
            });
        });

        describe('Method - createOption - Merge provided option with either existing or default option', () => {
            const mockOption: Partial<IOption> = { showAll: true };
            const mockExistOption = { onePerLevel: true } as IOption;

            it('should return an option merged with default option when existing option is not provided', () => {
                expect(handle.createOption(mockOption)).toEqual({
                    onePerLevel: false,
                    ...mockOption
                });

            });

            it('should return an option merged with existing option when it is provided', () => {
                expect(handle.createOption(mockOption, mockExistOption)).toEqual({
                    ...mockExistOption,
                    ...mockOption
                });
            });
        });

        describe('Method - createState - Create a initial expand state', () => {
            it('should return state', () => {
                expect(handle.createState()).toEqual({});
            });
        });


        describe('Method - rmvRowInExpdState: Remove the opened row from the expand state', () => {
            const mockOpenItemId: string = 'lorem';
            const mockClosedItemId: string = 'sum';
            const mockExpdState: IState = { [mockOpenItemId]: 1 };

            it('should return falsy when the row is not opened or in the expand state', () => {
                expect(handle.rmvRowInExpdState(mockExpdState, mockClosedItemId)).toBeFalsy();
            });

            it('should return the updated expand state with the open row removed', () => {
                expect(handle.rmvRowInExpdState(mockExpdState, mockOpenItemId)).toEqual({});
            });
        });

        describe('Method - isRowOpen: Check if a row is open by checking in the expand state', () => {
            const mockOpenItemId: string = 'lorem';
            const mockClosedItemId: string = 'sum';
            const mockExpdState: IState = { [mockOpenItemId]: 0 };

            it('should return true if open', () => {
                expect(handle.isRowOpen(mockExpdState, mockOpenItemId)).toBe(true);
            });

            it('should return false if open with reverse option on', () => {
                expect(handle.isRowOpen(mockExpdState, mockOpenItemId, true)).toBe(false);
            });

            it('should return false if not open', () => {
                expect(handle.isRowOpen(mockExpdState, mockClosedItemId)).toBe(false);
            });

            it('should return false if expand state doesnt exist', () => {
                expect(handle.isRowOpen(null, mockOpenItemId)).toBe(false);
            });
        });
    });

    describe('Expand Button Attributes for Expand Mode - One Expand Per Level', () => {
        describe('Method - getBtnAttrForOneExpd: Get the Expand button attributes', () => {
            beforeEach(() => {
                spy.rmvRowInExpdState.mockImplementation(() => {});
                spy.getRelExpdState.mockReturnValue({rel: 1});
                spy.getFilteredCurrExpdState.mockReturnValue({filter: 2});
            });

            it('should return attributes for open state', () => {
                spy.isRowOpen.mockReturnValue(true);
                const { isOpen, onClick } = handle.getBtnAttrForOneExpd(mockExpdBtnAttrQuery);
                onClick();

                expect(isOpen).toBe(true);
                expect(mockCallback).toHaveBeenCalledWith({expdState: {}});
                expect(spy.rmvRowInExpdState).toHaveBeenCalled();
            });

            it('should return attributes for closed state', () => {
                spy.isRowOpen.mockReturnValue(false);
                const { isOpen, onClick } = handle.getBtnAttrForOneExpd(mockExpdBtnAttrQuery);
                onClick();

                expect(isOpen).toBe(false);
                expect(mockCallback).toHaveBeenCalledWith({ expdState: { rel: 1, filter: 2 } });
                expect(spy.getRelExpdState).toHaveBeenCalled();
                expect(spy.getFilteredCurrExpdState).toHaveBeenCalled();
            });
        });

        describe('Method - getRelExpdState: Get the related expand state for items in the same hierarchy (e.g. parent, grandparent)', () => {
            const mockRowParentItemCtx = {
                itemId: 'parent',
                itemLvl: 0,
                parentItemCtx: null
            }
            const mockRowItemCtx = {
                itemId: 'child',
                itemLvl: 1,
                parentItemCtx: null
            } as TItemCtx;

            it('should return the state when item has parent context', () => {
                expect(handle.getRelExpdState(mockRowItemCtx)).toEqual({
                    [mockRowItemCtx.itemId]: mockRowItemCtx.itemLvl
                })
            });

            it('should return the state when item has not parent context', () => {
                expect(handle.getRelExpdState({
                    ...mockRowItemCtx,
                    parentItemCtx: mockRowParentItemCtx as TItemCtx
                })).toEqual({
                    [mockRowItemCtx.itemId]: mockRowItemCtx.itemLvl,
                    [mockRowParentItemCtx.itemId]: mockRowParentItemCtx.itemLvl,
                })
            });
        });

        describe('Method - getFilteredCurrExpdState: Get the filtered expand state by removing the impacted open rows at the same level from expand state', () => {
            const mockCurrExpdState: IState = { 'lorem': 0, 'sum': 1 };
            const mockMatchRelExpState: IState = { 'x': 0 };
            const mockUnMatchRelExpState: IState = { 'x': 3 };

            it('should return the filtered state', () => {
                expect(handle.getFilteredCurrExpdState(mockCurrExpdState, mockMatchRelExpState)).toEqual({ 'sum': 1 });
                expect(handle.getFilteredCurrExpdState(mockCurrExpdState, mockUnMatchRelExpState)).toEqual(mockCurrExpdState);
            });
        });
    });

    describe('Expand Button Attributes for Expand Mode - Show All ', () => {
        it('should return attributes for Open state', () => {
            spy.isRowOpen.mockReturnValue(true);

            const { isOpen, onClick } = handle.getBtnAttrForShowAll({
                ...mockExpdBtnAttrQuery,
                itemCtx: mockItemCtx
            });
            onClick();

            expect(isOpen).toBe(true);
            expect(mockCallback).toHaveBeenCalledWith({ expdState: mockExpState });
        });

        it('should return attributes for Close state', () => {
            spy.isRowOpen.mockReturnValue(false);
            const { isOpen, onClick } = handle.getBtnAttrForShowAll({
                ...mockExpdBtnAttrQuery,
                itemCtx: mockItemCtx,
                expdState: mockExpState
            });
            onClick();

            expect(isOpen).toBe(false);
            expect(mockCallback).toHaveBeenCalledWith({ expdState: {} });
        });
    });

    describe('Expand Button Attributes for Expand Mode - Hide All ', () => {
        it('should return attributes for Open state', () => {
            spy.isRowOpen.mockReturnValue(true);
            const { isOpen, onClick } = handle.getBtnAttrForHideAll({
                ...mockExpdBtnAttrQuery,
                itemCtx: mockItemCtx,
                expdState: mockExpState
            });
            onClick();

            expect(isOpen).toBe(true);
            expect(mockCallback).toHaveBeenCalledWith({ expdState: {} });
        });

        it('should return attributes for Close state', () => {
            spy.isRowOpen.mockReturnValue(false);
            const { isOpen, onClick } = handle.getBtnAttrForHideAll({
                ...mockExpdBtnAttrQuery,
                itemCtx: mockItemCtx
            });
            onClick();

            expect(isOpen).toBe(false);
            expect(mockCallback).toHaveBeenCalledWith({ expdState: mockExpState });
        });
    });
});