import {
    TRowsExpdState, TRowsExpdStateEntry,
    TRowExpdCmpAttr, IRowExpdCmpAttrQuery,
    TItemCtx, TFn
} from './type';

export class ExpdHandle {
    getRowCmpExpdAttr({itemCtx, currExpdState, callback}: IRowExpdCmpAttrQuery): TRowExpdCmpAttr {
        const isOpen: boolean = this.isRowOpen(currExpdState, itemCtx.itemId);
        const onToggle: TFn = this.getOnToggleHandler({itemCtx, currExpdState, callback}, isOpen);
        return {
            isOpen,
            onClick: () => onToggle()
        };
    }

    // TODO: Param object
    getOnToggleHandler({itemCtx, currExpdState, callback}: IRowExpdCmpAttrQuery, isOpen: boolean): TFn {
        const { itemId } = itemCtx;

        return () => {
            const currExpdStateCopy: TRowsExpdState  = { ...currExpdState };
            let modExpdState: TRowsExpdState;

            if (isOpen) {
                // Remove the item from the expand/open state
                this.rmvRowInExpdState(currExpdStateCopy, itemId);
                modExpdState = { ...currExpdStateCopy };

            } else {
                // 1. Create a partial expand state by finding related IDs within the same hierarchy only
                // 2. Remove any impacted id (that is in conflict with relExpdState) from current expand state
                const relExpdState: TRowsExpdState = this.getRelExpdState(itemCtx);
                const filteredCurrExpdState: TRowsExpdState = this.getFilteredCurrExpdState(currExpdStateCopy, relExpdState);
                modExpdState = { ...filteredCurrExpdState, ...relExpdState };
            }

            callback?.({ rowsExpdState: modExpdState });
        };
    }

    getRelExpdState({itemId, itemLvl, parentItemCtx }: TItemCtx): TRowsExpdState {
        const relExpdState: TRowsExpdState= { [itemId]: itemLvl };
        let parentCtx: TItemCtx = parentItemCtx;
        while (parentCtx) {
            relExpdState[parentCtx.itemId] = parentCtx.itemLvl;
            parentCtx = parentCtx?.parentItemCtx ?? null;
        }
        return relExpdState;
    }

    getFilteredCurrExpdState(currExpdState: TRowsExpdState, relExpdState: TRowsExpdState): TRowsExpdState  {
        const filteredCurrExpdState: TRowsExpdState = { ...currExpdState } ;
        const currIdMaps: TRowsExpdStateEntry[] = Object.entries(filteredCurrExpdState);
        Object
            .entries(relExpdState)
            .forEach(([relId, rowLvl]: TRowsExpdStateEntry) => {
                // Check if impacted item is in current expand state by checking row level
                // - if row level matches (same), it is impacted as we can only allow ONE Expand per level
                currIdMaps.forEach(([currId, currRowLvl]: TRowsExpdStateEntry) => {
                    if (rowLvl !== currRowLvl) return;
                    this.rmvRowInExpdState(filteredCurrExpdState, currId);
                });
            });
        return filteredCurrExpdState;
    }

    /**
     * For removing expand/open item from current expand/open state object
     */
    rmvRowInExpdState(expdState: TRowsExpdState, itemId: string): TRowsExpdState {
        const hasKey: boolean = itemId in expdState;
        if (!hasKey) return;

        expdState[itemId] = null;
        delete expdState[itemId];
        return expdState;
    }

    isRowOpen(expdState: TRowsExpdState, itemId: string): boolean {
        return itemId in (expdState ?? {});
    }
}