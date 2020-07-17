import {
    IOption, TState,
    TRowsThColCtx, TRowThColCtx,
    IThColCtx, IThColCtxCache,
} from './type';

export class ThHandle {
    createState(option: IOption[]): TState {
        const rowsThColCtx = this.createRowThColCtx(option) as TRowsThColCtx;
        return this.createRowThSpanCtx(rowsThColCtx);
    }

    createRowThColCtx(option: IOption[], rowLvlIdx: number = 0, cache?: IThColCtxCache): TRowsThColCtx | TRowThColCtx {
        cache = cache ? cache : this.getDefThColCtxCache();
        const rowThColCtx: TRowThColCtx = option.map(({ title, sortKey, subHeader }: IOption) => {
            // Get the curr. value so that we can later get diff. in total no. of columns
            const currColTotal: number = cache.colTotal;

            // Get the Sub Row Info if there is sub headers & Update cache
            const subRowLvlIdx: number = rowLvlIdx + 1;
            const subRowCtx = subHeader ? this.createRowThColCtx(subHeader, subRowLvlIdx, cache) as TRowThColCtx : null;
            this.setThColCtxCache(cache, subRowLvlIdx, subRowCtx);

            // After Cache is updated
            const ownColTotal: number = subHeader ? (cache.colTotal - currColTotal) : null;
            return { title, sortKey, ownColTotal };
        });

        const isTopLvl: boolean = rowLvlIdx === 0;
        if(isTopLvl) this.setThColCtxCache(cache, rowLvlIdx, rowThColCtx);

        return isTopLvl ? cache.slots : rowThColCtx;
    }

    createRowThSpanCtx(rowsThColCtx: TRowsThColCtx): TState {
        let rowTotal: number = rowsThColCtx.length;

        return rowsThColCtx.map((row: TRowThColCtx, rowLvlIdx: number) => {
            const is1stRowLvl: boolean = rowLvlIdx === 0;
            if (!is1stRowLvl) rowTotal--;

            return row.map((thColCtx: IThColCtx) => {
                const { ownColTotal, ...thCtx } = thColCtx;
                return {
                    ...thCtx,
                    rowSpan: ownColTotal ? 1 : rowTotal,
                    colSpan: ownColTotal ? ownColTotal : 1
                };
            });
        });
    }

    setThColCtxCache(cache: IThColCtxCache, rowLvlIdx: number, rowThColCtx?: TRowThColCtx): void {
        const { slots } = cache;
        const isTopLvl: boolean = rowLvlIdx === 0;

        if (!rowThColCtx) {
            cache.colTotal++;

        // If its root level and col context is provided
        } else if (isTopLvl) {
            slots[rowLvlIdx] = rowThColCtx;

        // If its not root level and col context is provided
        } else {
            const currRowInfo = slots[rowLvlIdx];
            slots[rowLvlIdx] = currRowInfo ? currRowInfo.concat(rowThColCtx) : rowThColCtx;
        }
    }

    getDefThColCtxCache(): IThColCtxCache {
        return {
            slots: [],
            colTotal: 0
        };
    }
}