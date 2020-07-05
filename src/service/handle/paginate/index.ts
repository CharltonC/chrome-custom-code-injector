import { IPgnStatus, IPageCtx, IPageSlice, IPageNavQuery, IPageRange, IRelPage, IRelPageCtx, IRecordCtx } from './type';

/**
 * Whenever one of these updates, we can use `getPgnStatus` to get the current paginate state
 */
export class PgnOption {
    page?: number = 0;
    increment?: number[] = [10];
    incrementIdx?: number = 0;
}

/**
 * Usage:
 *      const list = ['a', 'b', 'c', 'd'];
 *      const pgnHandle = new PgnHandle();
 *
 *      const example = pgnHandle.getPgnStatus(list, {
 *           page: 1,                       // optional starting page index
 *           increment: [100, 200, 300],    // used for <select>'s <option> (default 10 per page, i.e. [10])
 *           incrementIdx: 0,               // i.e. 100 per age
 *      });
 *
 *      const { startIdx, endIdx } = example;
 *      const listFor1stPage = list.slice(startIdx, endIdx);
 */
export class PgnHandle {
    getPgnStatus(list: any[], pgnOption: PgnOption): IPgnStatus {
        // Merge def. option with User's option
        const defOption: PgnOption = this.getDefOption();
        const {increment: [defIncrmVal]} = defOption;
        const { page, increment, incrementIdx } = Object.assign(defOption, pgnOption);
        let perPage: number = this.getNoPerPage(increment, incrementIdx, defIncrmVal);

        // Skip if we only have 1 list item OR less than 2 pages
        const totalRecord: number = list.length;
        const defState: IPgnStatus = this.getDefPgnStatus(totalRecord, perPage);
        if (totalRecord <= 1) return defState;
        const totalPage: number = this.getTotalPage(totalRecord, perPage);
        if (totalPage <= 1) return defState;

        // Proceed as we have >=2 pages
        const { curr, pageNo }: IPageCtx = this.getCurrPage(page, totalPage - 1);
        const currSlice: IPageSlice = this.getPageSliceIdx(list, perPage, curr);
        const { startIdx, endIdx } = currSlice;
        const recordCtx = this.getRecordCtx(totalRecord, startIdx, endIdx);
        let relPage: IRelPage = this.getRelPage(totalPage, curr);
        const relPageCtx: IRelPageCtx = this.getRelPageCtx({curr, last: relPage.last}, relPage);
        relPage = this.parseRelPage(relPage, relPageCtx);
        return { curr, ...relPage, ...currSlice, pageNo, perPage, totalPage, ...recordCtx };
    }

    getDefOption(): PgnOption {
        return new PgnOption();
    }

    getDefPgnStatus(totalRecord: number, perPage: number): IPgnStatus {
        const startIdx: number = 0;
        const recordCtx: IRecordCtx = this.getRecordCtx(totalRecord, startIdx);
        return {
            ...recordCtx,
            perPage,
            totalPage: 1,
            startIdx,
            pageNo: 1
        } as IPgnStatus;
    }

    getRecordCtx(totalRecord: number, startIdx: number, endIdx?: number): IRecordCtx {
        const hsRecord: boolean = totalRecord >= 1;
        return {
            startRecord: (hsRecord && Number.isInteger(startIdx)) ? startIdx+1 : 0,
            endRecord: (hsRecord && Number.isInteger(endIdx)) ? endIdx : totalRecord,
            totalRecord
        };
    }

    getNoPerPage(incrms: number[], incrmIdx: number, fallbackVal: number): number {
        const hsIncrms: boolean = !!incrms.length;
        if (!hsIncrms) return fallbackVal;

        const incrm: number = incrms[incrmIdx];
        const isValidIncrm: boolean = Number.isInteger(incrm) && incrm > 0;
        const perPage: number = isValidIncrm ? incrms[incrmIdx] : fallbackVal;
        return perPage;
    }

    parseNoPerPage(incrms: number[]): number[] {
        return incrms.filter((incrm: number) => {
            return Number.isInteger(incrm) && incrm > 0;
        });
    }

    getTotalPage(lsLen: number, perPage: number): number {
        const noOfPage: number = (lsLen > perPage) ? lsLen/perPage : 1;
        return Math.ceil(noOfPage);
    }

    getCurrPage(page: number, lastPage: number): IPageCtx {
        const curr: number = (page >= 0 && page <= lastPage )? page : 0;
        const pageNo: number = curr + 1;
        return { curr, pageNo };
    }

    getRelPage(totalPage: number, currPage: number): IRelPage {
        return {
            first: 0,
            prev: currPage - 1,
            next: currPage + 1,
            last: totalPage - 1
        };
    }

    getRelPageCtx(pageRange: IPageRange, relPage: IRelPage): IRelPageCtx {
        const relPageKeys = Object.getOwnPropertyNames(relPage) as (keyof IRelPage)[];
        return relPageKeys.reduce((relPageCtx, type: string) => {
            const pageQuery: IPageNavQuery = {type, target: relPage[type]};
            relPageCtx[type] = this.canNavToPage(pageRange, pageQuery);
            return relPageCtx;
        }, {}) as IRelPageCtx;
    }

    parseRelPage(relPage: IRelPage, relPageCtx: IRelPageCtx): IRelPage {
        const relPageKeys = Object.getOwnPropertyNames(relPage) as (keyof IRelPage)[];
        relPageKeys.forEach((pageType: keyof IRelPage) => {
            const page: number = relPage[pageType];
            relPage[pageType] = relPageCtx[pageType] ? page : null;
        });
        return relPage;
    }

    getPageSliceIdx(list: any[], perPage: number, page: number): IPageSlice {
        let startIdx: number = page * perPage;     // inclusive index
        let endIdx: number = startIdx + perPage;      // exclusive index
        startIdx = this.isDefined(list[startIdx]) ? startIdx : undefined;   // `undefined` is used as `null` cant be used as empty value in ES6
        endIdx = this.isDefined(list[endIdx]) ? endIdx : undefined;
        return { startIdx, endIdx };
    }

    canNavToPage({curr, last}: IPageRange, {type, target}: IPageNavQuery): boolean {
        if (!this.isGteZero([curr, last])) return false;

        switch(type) {
            case 'prev':
                // we dont need `target < curr` since we already know `target = curr - 1;`
                return target >= 0;
            case 'next':
                // we dont need `target > curr` since we already know `target = curr + 1;`
                return target <= last;
            case 'first':
                // we dont need `target > curr` since we already know `target = 0`
                return curr !== 0 && target < curr;
            case 'last':
                return target > curr;
            case 'page':
                // i.e. any prev or next
                return this.isGteZero(target) && target !== curr && target <= last;
            default:
                return false;
        }
    }

    isDefined(val?: any): boolean {
        return typeof val !== 'undefined';
    }

    isGteZero(vals: any | any[]): boolean {
        return Array.isArray(vals) ?
            vals.every((val: any) => (Number.isInteger(val) && val >= 0) ) :
            Number.isInteger(vals) && vals >= 0;
    }
}