import {
    IThOption,
    IThInfo,
    IThInfoCache,
    IThProps,
} from './type';

export class ThHandle {
    readonly defThInfoCache: IThInfoCache = { slots: [], colSum: 0 };

    getThProps(headers: IThOption[]): IThProps[][] {
        const thInfo = this.createThInfo(headers) as IThInfo[][];
        return this.createThProps(thInfo);
    }

    createThInfo(headers: IThOption[], rowLvlIdx: number = 0, cache: IThInfoCache = this.defThInfoCache): IThInfo[][] | IThInfo[] {
        const rowInfo: IThInfo[] = headers.map(({ title, subHeader }: IThOption) => {
            // Get the curr. value so that we can later get diff. in total no. of columns
            const currColSum: number = cache.colSum;

            // Get the Sub Row Info if there is sub headers & Update cache
            const subRowLvlIdx: number = rowLvlIdx + 1;
            const subRowInfo = subHeader ? this.createThInfo(subHeader, subRowLvlIdx, cache) as IThInfo[] : null;
            this.updateThInfoCache(cache, subRowLvlIdx, subRowInfo);

            // After Cache is updated
            const ownColSum: number = subHeader ? (cache.colSum - currColSum) : null;
            return { title, ownColSum };
        });

        const isTopLvl: boolean = rowLvlIdx === 0;
        if(isTopLvl) this.updateThInfoCache(cache, rowLvlIdx, rowInfo);

        return isTopLvl ? cache.slots : rowInfo;
    }

    updateThInfoCache(cache: IThInfoCache, rowLvlIdx: number, rowInfo: IThInfo[]): void {
        const { slots } = cache;
        const isTopLvl: boolean = rowLvlIdx === 0;

        if (isTopLvl && rowInfo) {
            slots[rowLvlIdx] = rowInfo;

        } else if (!isTopLvl && rowInfo) {
            const currRowInfo = slots[rowLvlIdx];
            slots[rowLvlIdx] = currRowInfo ? currRowInfo.concat(rowInfo) : [].concat(rowInfo);

        } else if (!rowInfo) {
            cache.colSum++;
        }
    }

    createThProps(headerRowInfo: IThInfo[][]): IThProps[][] {
        let rowSum: number = headerRowInfo.length;

        return headerRowInfo.map((row: IThInfo[], rowLvlIdx: number) => {
            const is1stRowLvl: boolean = rowLvlIdx === 0;
            if (!is1stRowLvl) rowSum--;

            return row.map((th: IThInfo) => {
                const { title, ownColSum } = th;
                return {
                    title,
                    rowSpan: ownColSum ? 1 : rowSum,
                    colSpan: ownColSum ? ownColSum : 1
                };
            });
        });
    }
}