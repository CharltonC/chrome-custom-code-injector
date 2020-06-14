import { IState, ISlice, IPerPageConfig } from './type';

/**
 * Whenever one of these updates, we can use `getPgnState` to get the current paginate state
 */
export class PgnOption {
    list: any[] = [];
    pageIdx?: number = 0;
    perPage?: IPerPageConfig = {
        increment: 10,
        incrementIdx: 0
    };
}

export class PgnHandle {
    getPgnState(pgnOption: PgnOption): IState {
        const { list, pageIdx, perPage } = Object.assign(new PgnOption(), pgnOption);
        const { increment, incrementIdx } = perPage;

        // Skip if we only have 1 list item
        const lsLen: number = list.length;
        if (lsLen <= 1) return;

        // Skip if we have less than 2 pages
        const {noPerPage, isValid: isIncrementConfigValid }  = this.getNoPerPage(increment, incrementIdx);
        const noOfPages: number = this.getNoOfPages(lsLen, noPerPage);
        if (noOfPages <= 1) return;

        // Process as we have >=2 pages & Compose the paginate state
        let lastPage: number = noOfPages - 1;
        const hsUserReqCurrPage: boolean = this.hsPage(pageIdx, lastPage, 0);
        const currPage: number = hsUserReqCurrPage ? pageIdx : 0;                               // fallback to 1st page if user request page doesnt exist
        const hsPrev: boolean = this.hsPage('prev', lastPage, currPage);
        const hsNext: boolean = this.hsPage('next', lastPage, currPage);
        const hsFirst: boolean = this.hsPage('first', lastPage, currPage);
        const hsLast: boolean = hsUserReqCurrPage && this.hsPage('last', lastPage, currPage);   // we check again against if user request page exists
        const currSlice: ISlice = this.getPageSliceIdx(list, noPerPage, currPage);

        const firstPage: number = hsFirst ? 0 : null;
        const prevPage: number = hsPrev ? currPage - 1 : null;
        const nextPage: number = hsNext ? currPage + 1 : null;
        lastPage = hsLast ? lastPage : null;
        const error = { ...isIncrementConfigValid, pageIdx: hsUserReqCurrPage};

        return { firstPage, prevPage, nextPage, lastPage, currPage, currSlice, noPerPage, noOfPages, error };
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

    //// Start/End indexes for getting a Slice Copy to render later on
    getPageSliceIdx(list: any[], noPerPage: number, pageIdx: number): ISlice {
        let startIdx: number = pageIdx * noPerPage;
        let endIdx: number = startIdx + noPerPage;
        startIdx = this.isDefined(list[startIdx]) ? startIdx : undefined;   // `undefined` is used as `null` cant be used as empty value in ES6
        endIdx = this.isDefined(list[endIdx]) ? startIdx : undefined;
        return { startIdx, endIdx };
    }

    hsPage(pageType: string | number, lastPage: number, currPage: number = 0): boolean {
        let targetPage: number;

        if (!this.isGteZero([lastPage, currPage])) return false;

        switch(pageType) {
            case 'prev':
                // we dont need `targetPage < currPage` since we already minus 1
                targetPage = currPage - 1;
                return targetPage >= 0;

            case 'next':
                // we dont need `targetPage > currPage` since we already add 1
                targetPage = currPage + 1;
                return targetPage <= lastPage;

            case 'first':
                targetPage = 0;
                return currPage !== 0 && targetPage < currPage;

            case 'last':
                return lastPage > currPage;

            default:
                // i.e. any prev or next
                return this.isGteZero(pageType) && pageType !== currPage && pageType <= lastPage;
        }
    }

    //// Helper Function
    private isDefined(val: any): boolean {
        return typeof val !== 'undefined';
    }

    private isGteZero(vals: any | any[]): boolean {
        return Array.isArray(vals) ?
            vals.every((val: any) => (Number.isInteger(val) && val >= 0) ) :
            Number.isInteger(vals) && vals >= 0;
    }

}