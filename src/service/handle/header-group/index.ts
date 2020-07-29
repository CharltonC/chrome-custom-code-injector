import {
    IOption,
    ICtxTbHeader, IBaseCtxTbHeader, ITbHeaderCache,
    ICtxListHeader, IBaseCtxListHeader, IListHeaderCache,
} from './type';

export class HeaderGrpHandle {
    //// Table Header
    getCtxTbHeaders(option: IOption[]): ICtxTbHeader[][] {
        const rowsThColCtx = this.getBaseCtxTbHeaders(option) as IBaseCtxTbHeader[][];
        return this.getSpanCtxTbHeaders(rowsThColCtx);
    }

    getBaseCtxTbHeaders(option: IOption[], rowLvlIdx: number = 0, cache?: ITbHeaderCache): IBaseCtxTbHeader[][] | IBaseCtxTbHeader[] {
        cache = cache ? cache : this.getDefTbHeaderCache();
        const rowThColCtx: IBaseCtxTbHeader[] = option.map(({ title, sortKey, subHeader }: IOption) => {
            // Get the curr. value so that we can later get diff. in total no. of columns
            const currColTotal: number = cache.colTotal;

            // Get the Sub Row Info if there is sub headers & Update cache
            const subRowLvlIdx: number = rowLvlIdx + 1;
            const subRowCtx = subHeader ? this.getBaseCtxTbHeaders(subHeader, subRowLvlIdx, cache) as IBaseCtxTbHeader[] : null;
            this.setTbHeaderCache(cache, subRowLvlIdx, subRowCtx);

            // After Cache is updated
            const ownColTotal: number = subHeader ? (cache.colTotal - currColTotal) : null;
            return { title, sortKey, ownColTotal };
        });

        const isTopLvl: boolean = rowLvlIdx === 0;
        if(isTopLvl) this.setTbHeaderCache(cache, rowLvlIdx, rowThColCtx);

        return isTopLvl ? cache.slots : rowThColCtx;
    }

    getSpanCtxTbHeaders(rowsThColCtx: IBaseCtxTbHeader[][]): ICtxTbHeader[][] {
        let rowTotal: number = rowsThColCtx.length;

        return rowsThColCtx.map((row: IBaseCtxTbHeader[], rowLvlIdx: number) => {
            const is1stRowLvl: boolean = rowLvlIdx === 0;
            if (!is1stRowLvl) rowTotal--;

            return row.map((thColCtx: IBaseCtxTbHeader) => {
                const { ownColTotal, ...thCtx } = thColCtx;
                return {
                    ...thCtx,
                    rowSpan: ownColTotal ? 1 : rowTotal,
                    colSpan: ownColTotal ? ownColTotal : 1
                };
            });
        });
    }

    setTbHeaderCache(cache: ITbHeaderCache, rowLvlIdx: number, rowThColCtx?: IBaseCtxTbHeader[]): void {
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

    getDefTbHeaderCache(): ITbHeaderCache {
        return {
            slots: [],
            colTotal: 0
        };
    }

    //// List Header
    getCtxListHeaders(option: IOption[]): ICtxListHeader[] {
        const cache: IListHeaderCache = {
            colTotal: 0,
            rowTotal: option.length ? 1 : 0
        };
        const baseCtxHeaders: IBaseCtxListHeader[] = this.getBaseCtxListHeaders(option, 0, cache);
        return this.getSpanCtxListHeaders(baseCtxHeaders, cache.rowTotal);
    }

    getBaseCtxListHeaders(option: IOption[], rowLvlIdx: number, cache: IListHeaderCache): IBaseCtxListHeader[] {
        return option.map(({ subHeader, ...remains }) => {
            // Get the curr. value so that we can later get diff. in total no. of columns
            const currColTotal = cache.colTotal;

            // Get the Sub Row Info if there is sub headers & Update cache
            const subRowLvlIdx = rowLvlIdx + 1;
            const subRowCtx = subHeader ? this.getBaseCtxListHeaders(subHeader, subRowLvlIdx, cache) : null;
            this.setListHeaderCache(cache, !!subHeader);

            // After Cache is updated
            const ownColTotal = subHeader ? (cache.colTotal - currColTotal) : null;
            return {
                ...remains,
                ownColTotal,
                subHeader: subRowCtx
            };
        });
    }

    getSpanCtxListHeaders(baseCtxHeaders: IBaseCtxListHeader[], rowTotal: number): ICtxListHeader[] {
        return baseCtxHeaders.map(({ subHeader, ownColTotal, ...remains }: IBaseCtxListHeader) => {
            return {
                ...remains,
                colSpan: ownColTotal ? ownColTotal : 1,
                rowSpan: ownColTotal ? 1 : rowTotal,
                subHeader: subHeader ? this.getSpanCtxListHeaders(subHeader, rowTotal - 1) : subHeader
            };
        });
    }

    setListHeaderCache(cache: IListHeaderCache, hsSubHeader: boolean): void {
        const { rowTotal, colTotal } = cache;
        cache.rowTotal = hsSubHeader ? rowTotal + 1 : rowTotal;
        cache.colTotal = hsSubHeader ? colTotal : (colTotal + 1);
    }
}