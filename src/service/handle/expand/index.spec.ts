    // describe('Methods for Feature of only Allowing One Expand/Open row per level at one time', () => {
    //     describe('Method - getRowCmpExpdAttr: Get the generic attributes related to the row component', () => {
    //         it('should return the attributes', () => {
    //             const mockCallback: jest.Mock = jest.fn();
    //             const mockOnToggle: jest.Mock = jest.fn();
    //             const mockCmpAttrQuery: any = {
    //                 itemCtx: { itemId: 'a' },
    //                 isOpen: true,
    //                 currExpdState: {},
    //                 callback: mockCallback
    //             };
    //             spy.getOnToggleHandler.mockReturnValue(mockOnToggle);

    //             const { isOpen, onClick } = handle.getRowCmpExpdAttr(mockCmpAttrQuery);
    //             onClick();

    //             expect(isOpen).toBe(mockCmpAttrQuery.isOpen);
    //             expect(mockOnToggle).toHaveBeenCalled();
    //         });
    //     });

    //     describe('Method - getOnToggleHandler: Get the Event Handler for Row Cmp for toggling the expand state', () => {
    //         const mockExpdState: TRowsExpdState = {'lorem': 0};
    //         const mockItemCtx = {} as IRowItemCtx;
    //         const mockCallback: jest.Mock = jest.fn();
    //         let onToggleHandler: TFn;

    //         beforeEach(() => {
    //             onToggleHandler = handle.getOnToggleHandler(mockItemCtx, mockExpdState, mockCallback);
    //             spy.rmvRowInExpdState.mockImplementation(() => {});
    //             spy.getRelExpdState.mockReturnValue({'rel': 1});
    //             spy.getFilteredCurrExpdState.mockReturnValue({'filter': 2});
    //         });

    //         it('should handle open scenario', () => {
    //             spy.isRowOpen.mockReturnValue(true);
    //             onToggleHandler();

    //             expect(spy.rmvRowInExpdState).toHaveBeenCalled();
    //             expect(spy.getRelExpdState).not.toHaveBeenCalled();
    //             expect(spy.getFilteredCurrExpdState).not.toHaveBeenCalled();
    //             expect(mockCallback).toHaveBeenCalledWith({rowsExpdState: mockExpdState});
    //         });

    //         it('should handle clsoe scenario', () => {
    //             spy.isRowOpen.mockReturnValue(false);
    //             onToggleHandler();

    //             expect(spy.rmvRowInExpdState).not.toHaveBeenCalled();
    //             expect(spy.getRelExpdState).toHaveBeenCalled();
    //             expect(spy.getFilteredCurrExpdState).toHaveBeenCalled();
    //             expect(mockCallback).toHaveBeenCalledWith({ rowsExpdState: { rel: 1, filter: 2 } });
    //         });
    //     });

    //     describe('Method - getRelExpdState: Get the related expand state for items in the same hierarchy (e.g. parent, grandparent)', () => {
    //         const mockRowParentItemCtx = {
    //             itemId: 'parent',
    //             itemLvl: 0,
    //             parentItemCtx: null
    //         }
    //         const mockRowItemCtx = {
    //             itemId: 'child',
    //             itemLvl: 1,
    //             parentItemCtx: null
    //         } as IRowItemCtx;

    //         it('should return the state when item has parent context', () => {
    //             expect(handle.getRelExpdState(mockRowItemCtx)).toEqual({
    //                 [mockRowItemCtx.itemId]: mockRowItemCtx.itemLvl
    //             })
    //         });

    //         it('should return the state when item has not parent context', () => {
    //             expect(handle.getRelExpdState({
    //                 ...mockRowItemCtx,
    //                 parentItemCtx: mockRowParentItemCtx as IRowItemCtx
    //             })).toEqual({
    //                 [mockRowItemCtx.itemId]: mockRowItemCtx.itemLvl,
    //                 [mockRowParentItemCtx.itemId]: mockRowParentItemCtx.itemLvl,
    //             })
    //         });
    //     });

    //     describe('Method - getFilteredCurrExpdState: Get the filtered expand state by removing the impacted open rows at the same level from expand state', () => {
    //         const mockCurrExpdState: TRowsExpdState = { 'lorem': 0, 'sum': 1 };
    //         const mockMatchRelExpState: TRowsExpdState = { 'x': 0 };
    //         const mockUnMatchRelExpState: TRowsExpdState = { 'x': 3 };

    //         it('should return the filtered state', () => {
    //             expect(handle.getFilteredCurrExpdState(mockCurrExpdState, mockMatchRelExpState)).toEqual({'sum': 1});
    //             expect(handle.getFilteredCurrExpdState(mockCurrExpdState, mockUnMatchRelExpState)).toEqual(mockCurrExpdState);
    //         });
    //     });

    //     describe('Method - rmvRowInExpdState: Remove the opened row from the expand state', () => {
    //         const mockOpenItemId: string = 'lorem';
    //         const mockClosedItemId: string = 'sum';
    //         const mockExpdState: TRowsExpdState = { [mockOpenItemId]: 1 };

    //         it('should return falsy when the row is not opened or in the expand state', () => {
    //             expect(handle.rmvRowInExpdState(mockExpdState, mockClosedItemId)).toBeFalsy();
    //         });

    //         it('should return the updated expand state with the open row removed', () => {
    //             expect(handle.rmvRowInExpdState(mockExpdState, mockOpenItemId)).toEqual({});
    //         });
    //     });

    //     describe('Method - isRowOpen: Check if a row is open by checking in the expand state', () => {
    //         const mockOpenItemId: string = 'lorem';
    //         const mockClosedItemId: string = 'sum';
    //         const mockExpdState: TRowsExpdState = { [mockOpenItemId]: 0 };

    //         it('should return true if open', () => {
    //             expect(handle.isRowOpen(mockExpdState, mockOpenItemId)).toBe(true);
    //         });

    //         it('should return false if not open', () => {
    //             expect(handle.isRowOpen(mockExpdState, mockClosedItemId)).toBe(false);
    //         });

    //         it('should return false if expand state doesnt exist', () => {
    //             expect(handle.isRowOpen(null, mockOpenItemId)).toBe(false);
    //         });
    //     });
    // });