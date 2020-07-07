import { ClpsHandle } from "../../../service/handle/collapse";
import { SortHandle } from "../../../service/handle/sort";
import {
    TFn,

    // Expand
    // TODO: rename
    clpsHandleType, TNestState, IClpsProps,

    ISortState,
    ISortOption,
    sortBtnType,

    // Sort
} from './type';

export class ExpandHelper extends ClpsHandle {
    createRowProps({nestState, showOnePerLvl, callback}, itemCtx: clpsHandleType.IItemCtx, ): IClpsProps {
        const { itemPath, isDefNestedOpen } = itemCtx;

        // Only Set the state for each Item during Initialization, if not use the existing one
        const isInClpsState: boolean = typeof nestState[itemPath] !== 'undefined';
        if (!isInClpsState) this.addRowState(nestState, itemCtx);

        const isNestedOpen: boolean = isInClpsState ? nestState[itemPath] : isDefNestedOpen;
        const onExpdChanged: TFn = () => {
            // Find the items that are at the same level and if they are open (true), close them (set them to false)
            const impactedItemsState: TNestState = showOnePerLvl && !isNestedOpen ? this.createImpactedRowsState(nestState, itemCtx) : {};
            const itemState: TNestState = { [itemCtx.itemPath]: !isNestedOpen };

            // callback example: ((nestState) => this.setState({...this.state, {nestState}})).bind(this)
            if (!callback) return;
            const modNestState = {
                ...nestState,
                ...impactedItemsState,
                ...itemState
            };
            callback(modNestState);
        }

        return { isNestedOpen, onCollapseChanged: onExpdChanged.bind(this) };
    }

    addRowState(nestState: TNestState, { itemPath, isDefNestedOpen }: clpsHandleType.IItemCtx): void {
        nestState[itemPath] = isDefNestedOpen;
    }

    createImpactedRowsState(nestState: TNestState, { itemLvl, itemKey, parentPath }: clpsHandleType.IItemCtx): TNestState {
        const itemPaths: string[] = Object.getOwnPropertyNames(nestState);
        const isRootLvlItem: boolean = itemLvl === 0;
        const relCtx: string = isRootLvlItem ? '' : `${parentPath}/${itemKey}:`;
        const relCtxPattern: RegExp = new RegExp(relCtx + '\\d+$');

        const impactedItemPaths: string[] = itemPaths.filter((ctx: string) => {
            return isRootLvlItem ?
                Number.isInteger(Number(ctx)) :
                relCtxPattern.test(ctx);
        });

        return impactedItemPaths.reduce((impactedState: TNestState, ctx: string) => {
            const isImpactedItemOpen: boolean = nestState[ctx];
            return isImpactedItemOpen ? { ...impactedState, [ctx]: false } : impactedState;
        }, {});
    }
}