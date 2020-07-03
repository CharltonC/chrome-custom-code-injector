import {
    IThConfig,
    IThColCtx,
    IThColCtxCache,
    IThCtx,
} from './type';

export class ThHandle {
    readonly defThInfoCache: IThColCtxCache = { slots: [], colTotal: 0 };

    createThCtx(thConfig: IThConfig[]): IThCtx[][] {
        const colCtx = this.createThColCtx(thConfig) as IThColCtx[][];
        return this.createThSpanCtx(colCtx);
    }

    createThColCtx(thConfig: IThConfig[], rowLvlIdx: number = 0, cache?: IThColCtxCache): IThColCtx[][] | IThColCtx[] {
        cache = cache ? cache : Object.assign({}, this.defThInfoCache);
        const colCtx: IThColCtx[] = thConfig.map(({ title, sortKey, subHeader }: IThConfig) => {
            // Get the curr. value so that we can later get diff. in total no. of columns
            const currColTotal: number = cache.colTotal;

            // Get the Sub Row Info if there is sub headers & Update cache
            const subRowLvlIdx: number = rowLvlIdx + 1;
            const subRowCtx = subHeader ? this.createThColCtx(subHeader, subRowLvlIdx, cache) as IThColCtx[] : null;
            this.setThColCtxCache(cache, subRowLvlIdx, subRowCtx);

            // After Cache is updated
            const ownColTotal: number = subHeader ? (cache.colTotal - currColTotal) : null;
            return { title, sortKey, ownColTotal };
        });

        const isTopLvl: boolean = rowLvlIdx === 0;
        if(isTopLvl) this.setThColCtxCache(cache, rowLvlIdx, colCtx);

        return isTopLvl ? cache.slots : colCtx;
    }

    setThColCtxCache(cache: IThColCtxCache, rowLvlIdx: number, colCtx?: IThColCtx[]): void {
        const { slots } = cache;
        const isTopLvl: boolean = rowLvlIdx === 0;

        if (!colCtx) {
            cache.colTotal++;

        // If its root level and col context is provided
        } else if (isTopLvl) {
            slots[rowLvlIdx] = colCtx;

        // If its not root level and col context is provided
        } else {
            const currRowInfo = slots[rowLvlIdx];
            slots[rowLvlIdx] = currRowInfo ? currRowInfo.concat(colCtx) : colCtx;
        }
    }

    createThSpanCtx(colCtx: IThColCtx[][]): IThCtx[][] {
        let rowTotal: number = colCtx.length;

        return colCtx.map((row: IThColCtx[], rowLvlIdx: number) => {
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
}