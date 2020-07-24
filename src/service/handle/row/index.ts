import {
    IOption, IRawRowsOption, IParsedRowsOption,
    TRowsExpdState, TRowsExpdStateEntry,
    IRowItemBaseCtx, TRowType, IErrMsg, TFn, ICtxRowsQuery, IRowItemCtx,
    TRowExpdCmpAttr, IRowExpdCmpAttrQuery
} from './type';

export class RowHandle {
    readonly errMsg: IErrMsg = {
        ROW_KEY_MISSING: 'Key in Row Config is missing',
        ROW_KEY_TYPE: 'Key in Row Config must be a string',
        PROP_DATA_TYPE: 'Data must be an array',
    };

    //// Core
    createOption(modOption: Partial<IOption>, existingOption?: IOption): IOption {
        const baseOption = existingOption ? existingOption : {
            data: [],
            rows: [],
            rowIdKey: 'id',
            showAll: false
        };
        return { ...baseOption, ...modOption };
    }

    createCtxRows<T = IRowItemCtx>(option: Partial<IOption> = {}): T[] {
        const { data, rows, rowIdKey, showAll }: IOption = this.createOption(option);

        // Skip if data has no rows OR config doesnt exist
        const _data: any[] = this.getValidatedData(data);
        if (!_data) return;

        return this.getCtxRows<T>({data, rows, rowLvl: 0, rowIdKey, parentPath: '', showAll});
    }

    /**
     *
     * Usage in React:
     * .getCtxRows({
     *      data: <dataArray>,
     *      rowLvl: 0,       // starting index for rows
     *      rowConfig: [    //
     *          [ (itemCtx) => <newStuffToReturn>? ]
     *          ['nestedDataLvl1Key', (itemCtx) => <newStuffToReturn>? ]
     *          ['nestedDataLvl2Key', (itemCtx) => <newStuffToReturn>? ]
     *      ]
     * })
     */
    getCtxRows<T = IRowItemCtx>(ctxRowsQuery: ICtxRowsQuery): T[] {
        const { data, rows, rowIdKey, rowLvl, parentPath, showAll, parentItemCtx }: ICtxRowsQuery = ctxRowsQuery;
        const { rowKey, transformFn }: IParsedRowsOption = this.parseRowConfig(rows[rowLvl], rowLvl);

        return data.map((item: any, idx: number) => {
            // Self
            const baseRowItemCtx: IRowItemBaseCtx = {
                idx,
                rowType: this.getRowType(idx),
                item,
                itemPath: this.getItemPath(idx, rowKey, parentPath),
                parentPath: parentPath,
                itemKey: rowKey,
                itemLvl: rowLvl,
            };
            const itemCtx: IRowItemCtx<T[]> = {
                ...baseRowItemCtx,
                itemId: typeof rowIdKey === 'function' ? rowIdKey(baseRowItemCtx) : item[rowIdKey],
                parentItemCtx,
                nestedItems: null,
                isExpdByDef: null
            };

            // Nested Items
            const nestedItems: T[] = this.getCtxNestedRows<T>({
                ...ctxRowsQuery,
                data: item,
                rowLvl: rowLvl + 1,
                parentPath: baseRowItemCtx.itemPath,
                parentItemCtx: itemCtx,
            });
            Object.assign(itemCtx, {
                nestedItems,
                isExpdByDef: !!nestedItems?.length && showAll
            })

            return transformFn ? transformFn(itemCtx) : itemCtx;
        });
    }

    getCtxNestedRows<T = IRowItemCtx>(ctxRowsQuery: ICtxRowsQuery): T[] {
        const { data, rows, rowLvl } = ctxRowsQuery;
        const nestedData: any[] = this.getValidatedData(data, rows[rowLvl]);
        return nestedData ? this.getCtxRows<T>({...ctxRowsQuery, data: nestedData}) : null;
    }

    //// Helper Methods
    parseRowConfig(config: IRawRowsOption, rowLvl: number): IParsedRowsOption {
        let [ itemOne, itemTwo ] = config;
        itemOne = itemOne ? itemOne : null;
        itemTwo = itemTwo ? itemTwo : null;

        const isTopLvl: boolean = rowLvl === 0;

        const rowKey = (isTopLvl ? '' : itemOne) as string;
        const transformFn = (isTopLvl ?
            (typeof itemOne === 'function' ? itemOne : null) :
            itemTwo ? itemTwo : null
        ) as TFn;

        return { rowKey, transformFn };
    }

    // Check if row config, row key, and data exists & has at least 1 item
    getValidatedData(target: any, config?: IRawRowsOption): any[] {
        //// When Target is an array, config is optional
        if (Array.isArray(target)) return !!target.length ? target : null;

        //// When Target is an object whose property is an array
        // If config doesnt exist
        const { ROW_KEY_MISSING, ROW_KEY_TYPE, PROP_DATA_TYPE } = this.errMsg;
        if (!config) return null;

        // If row key doesnt exist or not a string
        const [ rowKey ] = config;
        if (!rowKey) throw new Error(ROW_KEY_MISSING);
        if (typeof rowKey !== 'string') throw new Error(ROW_KEY_TYPE);

        let val: any[] = (rowKey as string)
            .split('/')
            .reduce((_target, key: string) => target[key], target);

        // If nested property found based on the row key is not an array
        const isAry: boolean = Array.isArray(val);
        if (val && !isAry) throw new Error(PROP_DATA_TYPE);

        return isAry && !!val.length ? val : null;
    }

    getItemPath(idx: number, rowKey: string, prefixCtx: string): string {
        const suffixCtx: string = rowKey ? [rowKey, idx].join(':') : `${idx}`;
        const rowCtx: string = prefixCtx ? [prefixCtx, suffixCtx].join('/') : suffixCtx;
        return rowCtx;
    }

    getRowType(rowIdx: number): TRowType {
        return rowIdx % 2 === 0 ? 'odd' : 'even';
    }

    isGteZeroInt(val: number): boolean {
       return Number.isInteger(val) && val >= 0;
    }

    //// Allow only One Expand per row level
    getRowCmpExpdAttr({itemCtx, isOpen, currExpdState, callback}: IRowExpdCmpAttrQuery): TRowExpdCmpAttr {
        const onToggle: TFn = this.getOnToggleHandler(itemCtx, currExpdState, callback);
        return {
            isOpen,
            onClick: () => onToggle()
        };
    }

    getOnToggleHandler(itemCtx: IRowItemCtx, currExpdState: TRowsExpdState, callback: TFn): TFn {
        const { itemId } = itemCtx;

        return () => {
            const currExpdStateCopy: TRowsExpdState  = { ...currExpdState };
            const isOpen: boolean = this.isRowOpen(currExpdStateCopy, itemId);
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

    getRelExpdState({itemId, itemLvl, parentItemCtx }: IRowItemCtx): TRowsExpdState {
        const relExpdState: TRowsExpdState= { [itemId]: itemLvl };
        let parentCtx: IRowItemCtx = parentItemCtx;
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