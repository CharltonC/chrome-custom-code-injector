import {
    IOption,
    ICtxTbHeader, IBaseCtxTbHeader, ITbHeaderCache,
    ISpanCtxListHeader, IBaseCtxListHeader, IListHeaderCache, ISubHeaderCtx,
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
    getCtxListHeaders(option: IOption[]) {
        const cache: IListHeaderCache = { colTotal: 0, rowTotal: 0 };
        const baseCtxHeaders: IBaseCtxListHeader[] = this.getBaseCtxListHeaders(option, cache);

        const { rowTotal } = cache;
        const spanCtxListHeaders: ISpanCtxListHeader[] = this.getSpanCtxListHeaders(baseCtxHeaders, rowTotal);
        const ctxListHeaders = this.fillListHeaders(spanCtxListHeaders, [...Array(rowTotal)].map(() => []));
        return ctxListHeaders;
    }

    getBaseCtxListHeaders(option: IOption[], cache: IListHeaderCache, rowLvl: number = 1): IBaseCtxListHeader[] {
        // Record total no. of rows at each level
        cache.rowTotal = Math.max(cache.rowTotal, rowLvl);

        return option.map(({ subHeader: subHeaders, ...rest }: IOption) => {
            let subHeader: IBaseCtxListHeader[];
            let ownColTotal: number;

            // Find out how many sub columns it contains if there is subheader
            if (subHeaders) {
                const { colTotal: currColTotal } = cache;
                subHeader = this.getBaseCtxListHeaders(subHeaders, cache, rowLvl + 1);
                ownColTotal = cache.colTotal - currColTotal;

            // if there is not subheader, it means only 1 column by itself
            } else {
                cache.colTotal++;
            }

            return { ...rest, ownColTotal, subHeader };
        });
    }

    getSpanCtxListHeaders(baseCtxHeaders: IBaseCtxListHeader[], rowTotal: number): ISpanCtxListHeader[] {
        return baseCtxHeaders.map(({ subHeader, ownColTotal, ...rest }: IBaseCtxListHeader) => {
            return {
                ...rest,
                colSpan: ownColTotal ? ownColTotal : 1,
                rowSpan: ownColTotal ? 1 : rowTotal,
                subHeader: subHeader ? this.getSpanCtxListHeaders(subHeader, rowTotal - 1) : subHeader
            };
        });
    }

    fillListHeaders(spanCtxHeaders: ISpanCtxListHeader[], rows: any[][], subHeaderCtx?: ISubHeaderCtx) {
        const { rowLvl, parentPos }  = subHeaderCtx ?? { rowLvl: 0, parentPos: 0 };
        let insertPos: number = parentPos;      // Insert Position to be used for the head cell

        spanCtxHeaders.forEach(({ subHeader, rowSpan, colSpan, ...rest }: ISpanCtxListHeader) => {
            if (subHeader) {
                // Fill out this current row for itself (Horizontal Cells)
                [...Array(colSpan)].forEach((span, idx: number) => {
                    rows[rowLvl][insertPos + idx] = idx === 0 ?
                        { ...rest } :
                        { ...rest, title: '' };
                });

                // Fill the next remaining rows for its sub headers (Horizontal Cells for the Next Rows)
                this.fillListHeaders(subHeader, rows, {
                    rowLvl: rowLvl + 1,
                    parentPos: insertPos
                });

            } else {
                // Fill out the same positin from the current to next remaining rows (Vertical Cells)
                const remainRowsTotal: number = rows.length - rowLvl;
                [...Array(remainRowsTotal)].forEach((item, idx: number) => {
                    // starting from the current row level `rowLvl`
                    rows[rowLvl + idx][insertPos] = idx === 0 ?
                        { ...rest } :
                        { ...rest, title: '' } ;
                });
            }

            // Update the insert index for the next header afterwards
            insertPos = insertPos + (colSpan ?? 0);
        });

        return rows;
    }
}