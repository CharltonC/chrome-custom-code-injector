import {
    IOption,
    IState,
    IHeader, IBaseCtxTbHeader, ITbHeaderCache,
    ISpanCtxListHeader, IBaseCtxListHeaders, IBaseCtxListHeader, IBaseListHeaderCache,
} from './type';

export class HeaderGrpHandle {
    getCtxHeaders(option: IOption[], isTb: boolean): IState {
        return isTb ? this.getCtxTbHeaders(option) : this.getCtxListHeaders(option);
    }

    //// Table Header
    getCtxTbHeaders(option: IOption[]): IState {
        const { slots, ...rest } = this.getBaseCtxTbHeaders(option) as ITbHeaderCache;
        const headers: IHeader[][]  = this.getSpanCtxTbHeaders(slots);
        return { ...rest, headers };
    }

    getBaseCtxTbHeaders(option: IOption[], rowLvlIdx: number = 0, cache?: ITbHeaderCache): ITbHeaderCache | IBaseCtxTbHeader[] {
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

        return isTopLvl ?
            {
                ...cache,
                rowTotal: cache.slots.length
            } :
            rowThColCtx;
    }

    getSpanCtxTbHeaders(rowsThColCtx: IBaseCtxTbHeader[][]): IHeader[][] {
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
            colTotal: 0,
            rowTotal: 0
        };
    }

    //// List Header
    getCtxListHeaders(option: IOption[]): IState {
        const { baseCtxHeaders, rowTotal, colTotal } = this.getBaseCtxListHeaders(option);
        const spanCtxListHeaders: ISpanCtxListHeader[] = this.getSpanCtxListHeaders(baseCtxHeaders, rowTotal);
        const headers: IHeader[] = this.getFlattenListHeaders(spanCtxListHeaders);
        return { colTotal, rowTotal, headers };
    }

    getBaseCtxListHeaders(option: IOption[], rowLvl?: number, cache?: IBaseListHeaderCache): IBaseCtxListHeaders {
        cache = cache ?? { colTotal: 0, rowTotal: 0 };
        rowLvl = rowLvl ?? 1;       // must be literal value instead of cached

        // Record total no. of rows at each level
        cache.rowTotal = Math.max(cache.rowTotal, rowLvl);

        const baseCtxHeaders: IBaseCtxListHeader[] = option.map(({ subHeader: subHeaders, ...rest }: IOption) => {
            let subHeader: IBaseCtxListHeader[];
            let ownColTotal: number;

            // Find out how many sub columns it contains if there is subheader
            if (subHeaders) {
                const { colTotal: currColTotal } = cache;
                ({ baseCtxHeaders: subHeader } = this.getBaseCtxListHeaders(subHeaders, rowLvl + 1, cache));
                ownColTotal = cache.colTotal - currColTotal;

            // if there is not subheader, it means only 1 column by itself
            } else {
                cache.colTotal++;
            }

            return { ...rest, ownColTotal, subHeader };
        });

        return { ...cache, baseCtxHeaders };
    }

    getSpanCtxListHeaders(baseCtxHeaders: IBaseCtxListHeader[], rowTotal: number): ISpanCtxListHeader[] {
        return baseCtxHeaders.map(({ subHeader, ownColTotal, ...rest }: IBaseCtxListHeader) => {
            const props = subHeader ? { subHeader: this.getSpanCtxListHeaders(subHeader, rowTotal - 1) }: {};
            return {
                ...rest,
                colSpan: ownColTotal ? ownColTotal : 1,
                rowSpan: ownColTotal ? 1 : rowTotal,
                ...props
            };
        });
    }

    getFlattenListHeaders(spanCtxHeaders: ISpanCtxListHeader[]): IHeader[] {
        return spanCtxHeaders.reduce((headers, { subHeader, ...rest }: ISpanCtxListHeader) => {
            headers.push(rest);
            if (subHeader) {
                headers = [ ...headers, ...this.getFlattenListHeaders(subHeader) ];
            }
            return headers;
        }, []);
    }
}