import {
    IOption, IState,
    IExpdBtnAttr, IExpdBtnAttrQuery,
    TExpdStateEntry, TItemCtx
} from './type';

export class ExpdHandle {
    //// Generic
    createOption(modOption: Partial<IOption>, currOption?: IOption): IOption {
        const baseOption = currOption ? currOption : { showAll: false, onePerLevel: false };
        return { ...baseOption, ...modOption };
    }

    createState(): IState {
        return {};
    }

    getExpdBtnAttr(expdBtnAttrQuery: IExpdBtnAttrQuery): IExpdBtnAttr {
        const { onePerLevel, showAll } = this.createOption(expdBtnAttrQuery.option ?? {});
        if (onePerLevel) return this.getBtnAttrForOneExpd(expdBtnAttrQuery);
        return showAll ?
                this.getBtnAttrForShowAll(expdBtnAttrQuery) :
                this.getBtnAttrForHideAll(expdBtnAttrQuery);
    }

    /**
      * Remove expand/open item from current expand/open state object
      */
    rmvRowInExpdState(expdState: IState, itemId: string): IState {
        const hasKey: boolean = itemId in expdState;
        if (!hasKey) return;

        expdState[itemId] = null;
        delete expdState[itemId];
        return expdState;
    }

    isRowOpen(expdState: IState, itemId: string, reverse: boolean = false): boolean {
        const isOpen: boolean = itemId in (expdState ?? {});
        return reverse ? !isOpen : isOpen;
    }

    //// For Initial Show All
    /**
     * Open/Close rule (Reversed)
     * - if `expdState[itemId]` exists        --> Closed
     * - if `expdState[itemId]` doesnt exist  --> Open (so initial state can be `{}` w/o setup)
     */
    getBtnAttrForShowAll({ itemCtx, expdState, callback }: IExpdBtnAttrQuery): IExpdBtnAttr {
        const { itemId, itemLvl } = itemCtx;
        const isOpen: boolean = this.isRowOpen(expdState, itemId, true);

        return {
            isOpen,
            onClick: () => {
                const modExpdState: IState  = { ...expdState };

                if (isOpen) {
                    modExpdState[itemId] = itemLvl;

                } else {
                    this.rmvRowInExpdState(modExpdState, itemId);
                }

                callback?.({ expdState: { ...modExpdState } });
            }
        };
    }

    //// For Initial Hide All
    /**
     * Open/Close rule (Typical)
     * - If `expdState[itemId]` exists          --> Open
     * - If `expdState[itemId]` doesnt exist    --> Close (so initial state can be `{}` w/o setup)
     */
    getBtnAttrForHideAll({ itemCtx, expdState, callback }: IExpdBtnAttrQuery): IExpdBtnAttr {
        const { itemId, itemLvl } = itemCtx;
        const isOpen: boolean = this.isRowOpen(expdState, itemId);

        return {
            isOpen,
            onClick: () => {
                const modExpdState: IState  = { ...expdState };

                if (isOpen) {
                    this.rmvRowInExpdState(modExpdState, itemId);

                } else {
                    modExpdState[itemId] = itemLvl;
                }

                callback?.({ expdState: { ...modExpdState } });
            }
        };
    }

    //// For One Expand Per Level (Initial Hide All)
    /**
     * Open/Close rule (Typical)
     * - If `expdState[itemId]` exists          --> Open
     * - If `expdState[itemId]` doesnt exist    --> Close (so initial state can be `{}` w/o setup)
     */
    getBtnAttrForOneExpd({ itemCtx, expdState, callback }: IExpdBtnAttrQuery): IExpdBtnAttr {
        const { itemId } = itemCtx;
        const isOpen: boolean = this.isRowOpen(expdState, itemId);

        return {
            isOpen,
            onClick: () => {
                const currExpdStateCopy: IState  = { ...expdState };
                let modExpdState: IState;

                if (isOpen) {
                    // Remove the item from the expand/open state
                    this.rmvRowInExpdState(currExpdStateCopy, itemId);
                    modExpdState = { ...currExpdStateCopy };

                } else {
                    // 1. Create a partial expand state by finding related IDs within the same hierarchy only
                    // 2. Remove any impacted id (that is in conflict with relExpdState) from current expand state
                    const relExpdState: IState = this.getRelExpdState(itemCtx);
                    const filteredCurrExpdState: IState = this.getFilteredCurrExpdState(currExpdStateCopy, relExpdState);
                    modExpdState = { ...filteredCurrExpdState, ...relExpdState };
                }

                callback?.({ expdState: modExpdState });
            }
        };
    }

    getRelExpdState({ itemId, itemLvl, parentItemCtx }: TItemCtx): IState {
        const relExpdState: IState= { [itemId]: itemLvl };
        let parentCtx: TItemCtx = parentItemCtx;
        while (parentCtx) {
            relExpdState[parentCtx.itemId] = parentCtx.itemLvl;
            parentCtx = parentCtx?.parentItemCtx ?? null;
        }
        return relExpdState;
    }

    getFilteredCurrExpdState(expdState: IState, relExpdState: IState): IState  {
        const filteredCurrExpdState: IState = { ...expdState } ;
        const currIdMaps: TExpdStateEntry[] = Object.entries(filteredCurrExpdState);
        Object
            .entries(relExpdState)
            .forEach(([relId, rowLvl]: TExpdStateEntry) => {
                // Check if impacted item is in current expand state by checking row level
                // - if row level matches (same), it is impacted as we can only allow ONE Expand per level
                currIdMaps.forEach(([currId, currRowLvl]: TExpdStateEntry) => {
                    if (rowLvl !== currRowLvl) return;
                    this.rmvRowInExpdState(filteredCurrExpdState, currId);
                });
            });
        return filteredCurrExpdState;
    }
}