import React, { ReactElement } from "react";

import { PgnHandle } from '../../../service/handle/paginate';
import { ClpsHandle } from "../../../service/handle/collapse";
import { SortHandle } from "../../../service/handle/sort";

import { Dropdown } from '../dropdown';
import { inclStaticIcon } from '../../static/icon';
import {
    TFn, TBtnProps, TSelectEvt,

    // Pagination
    IPgnState, IPgnProps, IPgnPropsCtx, TPgnCallback,
    pgnHandleType, PgnOption, dropdownType,

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

export class SortHelper extends SortHandle {
    createState(data: any[], sortOption: ISortOption): ISortState {
        const { key, isAsc } = sortOption;
        return {
            option: { ...sortOption },
            data: this.sortByObjKey(data, key, isAsc)
        };
    }

    createBtnProps({data, option, callback}, sortKey: string): sortBtnType.IProps {
        const { key, isAsc: isCurrAsc } = option;

        const isAsc: boolean = key === sortKey ? isCurrAsc : null;

        const onClick = () => {
            const isSameTh: boolean = sortKey === key;
            const modOption = {
                key: isSameTh ? key : sortKey,
                isAsc: isSameTh ? !isAsc : true
            };

            // Callback example: `( (sortState) => this.setState({...this.state, sortState}) ).bind(this)`
            // TODO: move data out as part of callback passed
            if (!callback) return;
            const sortState = this.createState(data, modOption);
            callback(sortState);
        };

        return { isAsc, onClick: onClick.bind(this) };
    }
}