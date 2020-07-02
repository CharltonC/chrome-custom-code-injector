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

    createThColCtx(thConfig: IThConfig[], rowLvlIdx: number = 0, cache: IThColCtxCache = this.defThInfoCache): IThColCtx[][] | IThColCtx[] {
        const colCtx: IThColCtx[] = thConfig.map(({ title, subHeader }: IThConfig) => {
            // Get the curr. value so that we can later get diff. in total no. of columns
            const currColTotal: number = cache.colTotal;

            // Get the Sub Row Info if there is sub headers & Update cache
            const subRowLvlIdx: number = rowLvlIdx + 1;
            const subRowInfo = subHeader ? this.createThColCtx(subHeader, subRowLvlIdx, cache) as IThColCtx[] : null;
            this.setThColCtxCache(cache, subRowLvlIdx, subRowInfo);

            // After Cache is updated
            const ownColTotal: number = subHeader ? (cache.colTotal - currColTotal) : null;
            return { title, ownColTotal };
        });

        const isTopLvl: boolean = rowLvlIdx === 0;
        if(isTopLvl) this.setThColCtxCache(cache, rowLvlIdx, colCtx);

        return isTopLvl ? cache.slots : colCtx;
    }

    setThColCtxCache(cache: IThColCtxCache, rowLvlIdx: number, colCtx: IThColCtx[]): void {
        const { slots } = cache;
        const isTopLvl: boolean = rowLvlIdx === 0;

        if (isTopLvl && colCtx) {
            slots[rowLvlIdx] = colCtx;

        } else if (!isTopLvl && colCtx) {
            const currRowInfo = slots[rowLvlIdx];
            slots[rowLvlIdx] = currRowInfo ? currRowInfo.concat(colCtx) : [].concat(colCtx);

        } else if (!colCtx) {
            cache.colTotal++;
        }
    }

    createThSpanCtx(colCtx: IThColCtx[][]): IThCtx[][] {
        let rowTotal: number = colCtx.length;

        return colCtx.map((row: IThColCtx[], rowLvlIdx: number) => {
            const is1stRowLvl: boolean = rowLvlIdx === 0;
            if (!is1stRowLvl) rowTotal--;

            return row.map((th: IThColCtx) => {
                const { title, ownColTotal } = th;
                return {
                    title,
                    rowSpan: ownColTotal ? 1 : rowTotal,
                    colSpan: ownColTotal ? ownColTotal : 1
                };
            });
        });
    }
}