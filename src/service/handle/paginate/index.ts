import { IPageState, IPageSlice, IPageNavQuery, IPageRange, IRelPage, IRelPageCtx } from './type';

/**
 * Whenever one of these updates, we can use `getPgnState` to get the current paginate state
 */
export class PgnOption {
    list: any[] = [];
    page?: number = 0;
    increment?: number[] = [10];
    incrementIdx?: number = 0;
}

/**
 * Usage:
 *      const list = ['a', 'b', 'c', 'd'];
 *      const pgnHandle = new PgnHandle();
 *
 *      const example = pgnHandle.getPgnState({
 *           list,
 *           page: 1,                       // optional starting page index
 *           increment: [100, 200, 300],    // used for <select>'s <option> (default 10 per page, i.e. [10])
 *           incrementIdx: 0,               // i.e. 100 per age
 *      });
 *
 *      const { startIdx, endIdx } = example;
 *      const listFor1stPage = list.slice(startIdx, endIdx);
 */
export class PgnHandle {
    getPgnState(pgnOption: PgnOption): IPageState {
        // Merge def. option with User's option
        const defPgnOption: PgnOption = new PgnOption();
        const {increment: [defIncrmVal]} = defPgnOption;
        const { list, page, increment, incrementIdx } = Object.assign(defPgnOption, pgnOption);

        // Skip if following conditions:
        // - if we only have 1 list item
        const lsLen: number = list.length;
        if (lsLen <= 1) return;

        // - if we have less than 2 pages
        let perPage: number = this.getNoPerPage(increment, incrementIdx, defIncrmVal);
        const totalPage: number = this.getTotalPage(lsLen, perPage);
        if (totalPage <= 1) return;

        // Proceed as we have >=2 pages
        const curr: number = this.getCurrPage(page, totalPage - 1);
        const currSlice: IPageSlice = this.getPageSliceIdx(list, perPage, curr);
        let relPage: IRelPage = this.getRelPage(totalPage, curr);
        const relPageCtx: IRelPageCtx = this.getRelPageCtx({curr, last: relPage.last}, relPage);
        relPage = this.parseRelPage(relPage, relPageCtx);

        return { curr, ...relPage, ...currSlice, perPage, totalPage };
    }

    getNoPerPage(incrm: number[], incrmIdx: number, fallbackVal: number): number {
        const isValidIncrm: boolean = !!incrm.length;
        const isValidIncrmIdx: boolean = isValidIncrm && this.isDefined(incrm[incrmIdx]);
        const perPage: number = isValidIncrmIdx ? incrm[incrmIdx] : fallbackVal;
        return perPage;
    }

    getTotalPage(lsLen: number, perPage: number): number {
        const noOfPage: number = (lsLen > perPage) ? lsLen/perPage : 1;
        return Math.ceil(noOfPage);
    }

    getCurrPage(page: number, lastPage: number): number {
        return (page >= 0 && page <= lastPage )? page : 0;
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