import { IState, ISliceIdx, ISliceScope, ISliceValidity, IPerPageConfig } from './type';



/**
 * Whenever one of these updates, we can use `getPgnState` to get the current paginate state
 */
class PgnOption {
    list: any[] = [];
    pageIdx?: number = 0;
    perPage?: IPerPageConfig = {
        incrm: 10,
        currIncrmIdx: 0
    };
}


class PgnHandle {
    getPgnState(pgnOption: PgnOption): IState {
        let isAvail: boolean = false;
        const { list, pageIdx, perPage } = Object.assign(new PgnOption(), pgnOption);
        const { incrm, currIncrmIdx } = perPage;

        const lsLen: number = list.length;
        if (lsLen <= 1) return;                // Only <=1 list items

        const noPerPage: number = this.getNoPerPage(incrm, currIncrmIdx);
        const noOfPages: number = this.getNoOfPages(lsLen, noPerPage);
        if (noOfPages === 1) return;           // Only 1 page

        const lastIdx: number = lsLen - 1;

        const currSliceArg: ISliceScope = {list, noPerPage, lastIdx};
        const currSliceIdx: ISliceIdx = this.getPageSliceIdx(currSliceArg, pageIdx);
        const currPage: number = currSliceIdx ? pageIdx : 0;
        const curr: ISliceIdx = currSliceIdx ? currSliceIdx : this.getPageSliceIdx(currSliceArg, 0);

        // TODO: Move condition to validation
        // TODO: firstPage, first
        const lastPage: number = noOfPages - 1;
        const last: ISliceIdx = (lastPage >= 0 && lastPage > currPage) ? this.getPageSliceIdx(currSliceArg, lastPage) : null;
        const prevPage: number = currPage - 1;
        const prev: ISliceIdx = (prevPage >= 0 && prevPage < currPage) ? this.getPageSliceIdx(currSliceArg, prevPage) : null;
        const nextPage: number = currPage + 1;
        const next: ISliceIdx = (nextPage <= lastPage && nextPage > currPage) ? this.getPageSliceIdx(currSliceArg, nextPage) : null;

        return {
            slice: { curr, prev, next, last },
            currPage,
            noPerPage,
            noOfPages,
        };
    }

    getValidity(sliceIdx: ISliceIdx, noOfPage: number): ISliceValidity {
        return {
            pageIdx: !!sliceIdx,
            noOfPage: noOfPage > 0,
        };
    }

    getNoPerPage(incrm: number | number[], currIncrmIdx: number): number {
        return (typeof incrm !== 'number' && !!incrm[currIncrmIdx]) ?
            incrm[currIncrmIdx] :
            incrm as number;
    }

    getNoOfPages(lsLen: number, noPerPage: number): number {
        const noOfPage: number = (lsLen > noPerPage) ? lsLen/noPerPage : 1;
        return Math.ceil(noOfPage);
    }

    //// Start/End indexes for getting a Slice Copy later on
    parseSliceIdx(list: any[], startIndex: number, endIndex: number): ISliceIdx {
        const startIdx: number = list[startIndex] ? startIndex : undefined;
        const endIdx: number = list[endIndex] ? endIndex : undefined;     // `undefined` is used as `null` cant be used as empty value in ES6
        // TODO: Move to common validation
        const isInvalid: boolean = typeof startIdx === 'undefined' && typeof endIdx === 'undefined'
        return isInvalid ? null : { startIdx, endIdx };
    }

    getPageSliceIdx({list, noPerPage, lastIdx}: ISliceScope, pageIdx: number): ISliceIdx {
        const startIdx: number = pageIdx * noPerPage;
        const endIdx: number = startIdx + noPerPage;
        return this.parseSliceIdx(list, startIdx, endIdx);
    }
}