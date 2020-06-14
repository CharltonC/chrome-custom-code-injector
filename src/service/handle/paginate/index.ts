import { IState, IPageSlice, IPageQuery } from './type';

/**
 * Whenever one of these updates, we can use `getPgnState` to get the current paginate state
 */
export class PgnOption {
    list: any[] = [];
    pageIdx?: number = 0;
    increment?: number | number[] = 10;
    incrementIdx?: number = 0;
}

export class PgnHandle {
    /**
     * Usage:
     *      const list = ['a', 'b', 'c', 'd'];
     *      const pgnHandle = new PgnHandle();
     *
     *      const example = pgnHandle.getPgnState({
     *           list,
     *           pageIdx: 1,                 // optional starting page index
     *           increment: [100, 200, 300], // used for <select>'s <option> (default 10 per page)
     *           incrementIdx: 0,            // i.e. 100 per age
     *      });
     *
     *      const { startIdx, endIdx } = example;
     *      const listFor1stPage = list.slice(startIdx, endIdx);
     */
    getPgnState(pgnOption: PgnOption): IState {
        const { list, pageIdx, increment, incrementIdx } = Object.assign(new PgnOption(), pgnOption);

        // Skip if we only have 1 list item
        const lsLen: number = list.length;
        if (lsLen <= 1) return;

        // Skip if we have less than 2 pages
        const {noPerPage, isValid: isIncrementConfigValid }  = this.getNoPerPage(increment, incrementIdx);
        const noOfPages: number = this.getNoOfPages(lsLen, noPerPage);
        if (noOfPages <= 1) return;

        // Process as we have >=2 pages
        const firstPage: number = 0;
        const lastPage: number = noOfPages - 1;
        let prevPage: number;
        let nextPage: number;

        const hsUserReqCurrPage: boolean = this.hsPage({type: 'page', lastPage, targetPage: pageIdx});
        const currPage: number = hsUserReqCurrPage ? pageIdx : 0;                                           // fallback to 1st page if user request page doesnt exist
        prevPage = currPage - 1;
        nextPage = currPage + 1;
        const pageContext = { currPage, lastPage };

        // Check & Return the contextual pagination state based on the current page
        const hsFirst: boolean = this.hsPage({...pageContext, type: 'first', targetPage: firstPage});
        const hsPrev: boolean = this.hsPage({...pageContext, type: 'prev', targetPage: prevPage});
        const hsNext: boolean = this.hsPage({...pageContext, type: 'next', targetPage: nextPage});
        const hsLast: boolean = this.hsPage({...pageContext, type: 'last', targetPage: lastPage});             // we check again against if user request page exists
        const first: number = hsFirst ? 0 : null;
        const prev: number = hsPrev ? prevPage : null;
        const next: number = hsNext ? nextPage : null;
        const last: number = hsLast ? lastPage : null;
        const currSlice: IPageSlice = this.getPageSliceIdx(list, noPerPage, currPage);
        const error = { ...isIncrementConfigValid, pageIdx: hsUserReqCurrPage};
        return { first, prev, next, last, currPage, ...currSlice, noPerPage, noOfPages, error };
    }

    getNoPerPage(incrm: number | number[], incrmIdx: number) {
        const isIncrementArrayValid: boolean = Array.isArray(incrm) && !!incrm.length;
        const isValid: boolean = isIncrementArrayValid && this.isDefined(incrm[incrmIdx]);
        return {
            noPerPage: isValid ? incrm[incrmIdx] : incrm as number,
            isValid: {
                incrementArray: isIncrementArrayValid,
                incrementIdx: isValid
            }
        };
    }

    getNoOfPages(lsLen: number, noPerPage: number): number {
        const noOfPage: number = (lsLen > noPerPage) ? lsLen/noPerPage : 1;
        return Math.ceil(noOfPage);
    }

    getPageSliceIdx(list: any[], noPerPage: number, pageIdx: number): IPageSlice {
        let startIdx: number = pageIdx * noPerPage;
        let endIdx: number = startIdx + noPerPage;
        startIdx = this.isDefined(list[startIdx]) ? startIdx : undefined;   // `undefined` is used as `null` cant be used as empty value in ES6
        endIdx = this.isDefined(list[endIdx]) ? startIdx : undefined;
        return { startIdx, endIdx };
    }

    hsPage({type, currPage, lastPage, targetPage}: IPageQuery): boolean {
        if (!this.isGteZero(lastPage)) return false;
        currPage = this.isGteZero(currPage) ? currPage : 0;

        switch(type) {
            case 'prev':
                // we dont need `targetPage < currPage` since we already know `targetPage = currPage - 1;`
                return targetPage >= 0;

            case 'next':
                // we dont need `targetPage > currPage` since we already know `targetPage = currPage + 1;`
                return targetPage <= lastPage;

            case 'first':
                // we dont need `targetPage > currPage` since we already know `targetPage = 0`
                return currPage !== 0 && targetPage < currPage;

            case 'last':
                return targetPage > currPage;

            case 'page':
                // i.e. any prev or next
                return this.isGteZero(targetPage) && targetPage !== currPage && targetPage <= lastPage;

            default:
                return false;
        }
    }

    //// Helper Function
    isDefined(val: any): boolean {
        return typeof val !== 'undefined';
    }

    isGteZero(vals: any | any[]): boolean {
        return Array.isArray(vals) ?
            vals.every((val: any) => (Number.isInteger(val) && val >= 0) ) :
            Number.isInteger(vals) && vals >= 0;
    }

}