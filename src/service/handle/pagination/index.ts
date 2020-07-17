import { IUiHandle } from '../../../asset/ts/type/ui-handle';
import {
    IState, IOption,
    IPageNavQuery,
    IPageCtx, IPageSlice, IPageRange, IRelPage, IRelPageCtx, IRecordCtx, ISpreadCtx, TSpreadCtx,
    ICmpAttrQuery, ICmpAttr, ICmpBtnAttr, ICmpSelectAttr, ISelectEvt, TPageList,
    TFn
} from './type';

/**
 * Usage:
 *      const list = ['a', 'b', 'c', 'd'];
 *
 *      const example = pgnHandle.createState(list, {
 *           page: 1,                       // optional starting page index
 *           increment: [100, 200, 300],    // used for <select>'s <option> (default 10 per page, i.e. [10])
 *           incrementIdx: 0,               // i.e. 100 per age
 *      });
 *
 *      const { startIdx, endIdx } = example;
 *      const listFor1stPage = list.slice(startIdx, endIdx);
 */
export class PgnHandle implements IUiHandle {
    //// Option
    /**
     * Merge the updated option with existing option (either custom or default)
     * e.g. existingOption = this.state.sortOption
     */
    createOption(modOption: Partial<IOption>, existingOption?: IOption): IOption {
        const baseOption = existingOption ? existingOption : this.getDefOption();
        return { ...baseOption, ...modOption };
    }

    getDefOption(): IOption {
        return {
            page: 0,
            increment: [10],
            incrementIdx: 0,
            maxSpread: 3
        };
    }

    //// Full State
    createState(list: any[], pgnOption: Partial<IOption>): IState {
        // Merge def. option with User's option
        const defOption: IOption = this.getDefOption();
        const { increment: [defIncrmVal] } = defOption;
        const { page, increment, incrementIdx, maxSpread } = Object.assign(defOption, pgnOption);
        let perPage: number = this.getNoPerPage(increment, incrementIdx, defIncrmVal);

        // Skip if we only have 1 list item OR less than 2 pages
        const totalRecord: number = list.length;
        const defState: IState = this.getDefState(totalRecord, perPage);
        if (totalRecord <= 1) return defState;
        const totalPage: number = this.getTotalPage(totalRecord, perPage);
        if (totalPage <= 1) return defState;

        // Proceed as we have >=2 pages
        const { curr, pageNo }: IPageCtx = this.getCurrPage(page, totalPage - 1);
        const currSlice: IPageSlice = this.getPageSliceIdx(list, perPage, curr);
        const { startIdx, endIdx } = currSlice;
        const recordCtx = this.getRecordCtx(totalRecord, startIdx, endIdx);
        const spreadCtx: ISpreadCtx = this.getSpreadCtx(pageNo, totalPage, maxSpread);
        let relPage: IRelPage = this.getRelPage(totalPage, curr);
        const relPageCtx: IRelPageCtx = this.getRelPageCtx({ curr, last: relPage.last }, relPage);
        relPage = this.parseRelPage(relPage, relPageCtx);

        return { curr, ...relPage, ...currSlice, pageNo, perPage, totalPage, ...recordCtx, ...spreadCtx };
    }

    getDefState(totalRecord: number, perPage: number): IState {
        const startIdx: number = 0;
        const recordCtx: IRecordCtx = this.getRecordCtx(totalRecord, startIdx);
        return {
            ...recordCtx,
            perPage,
            totalPage: 1,
            startIdx,
            pageNo: 1
        } as IState;
    }

    //// Partial State
    getRecordCtx(totalRecord: number, startIdx: number, endIdx?: number): IRecordCtx {
        const hsRecord: boolean = totalRecord >= 1;
        return {
            startRecord: (hsRecord && Number.isInteger(startIdx)) ? startIdx + 1 : 0,
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
        const noOfPage: number = (lsLen > perPage) ? lsLen / perPage : 1;
        return Math.ceil(noOfPage);
    }

    getCurrPage(page: number, lastPage: number): IPageCtx {
        const curr: number = (page >= 0 && page <= lastPage) ? page : 0;
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
            const pageQuery: IPageNavQuery = { type, target: relPage[type] };
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

    /**
     * Get the page number for the left/right spread in relation to current page
     * - When remain < maxSpread, show `maxSpread` no. of pages
     * - When remain > maxSpread, show dots (either on left/right) + `maxSpread` no. of pages
     * - when remain < 1, no spread is available
     *
     * @param maxSpread: max no. of pages for each side of the spread
     */
    getSpreadCtx(currPageNo: number, totalPage: number, maxSpread: number = 3): ISpreadCtx {
        // 1 is added to `spreadRange` in case there is '...' for either 1st/last item
        const spreadRange: any[] = [...Array(maxSpread + 1)];
        const firstPage: number = 1;
        const DOTS = '...';

        const rtTotalRemain: number = totalPage - currPageNo;
        const ltTotalRemain: number = currPageNo - firstPage;
        const hsRtSpread: boolean = rtTotalRemain > 1 && rtTotalRemain < totalPage;
        const hsLtSpread: boolean = ltTotalRemain > 1 && ltTotalRemain < totalPage;

        const rtSpread: TSpreadCtx = hsRtSpread ?
            spreadRange.reduce((container: TSpreadCtx, item, idx: number) => {
                const pageNo: number = currPageNo + idx + 1;

                // We exclude the 1st page or last page since its already available in the Pagination state
                const isInRange: boolean = pageNo > 1 && pageNo < totalPage;

                // Check if there is any pages between "last" page number in this loop and the actual last page
                // - e.g. last page in the loop is: 8 | actual last page is: 10,
                // so we have page 9 in between, which we can use '...' to represent
                const hsGtOnePageTilLastPage: boolean = idx === maxSpread && (totalPage - pageNo) >= 1;

                if (isInRange) container.push(hsGtOnePageTilLastPage ? DOTS : pageNo);
                return container;
            }, []) :
            null;

        const ltSpread: TSpreadCtx = hsLtSpread ?
            spreadRange.reduce((container: TSpreadCtx, item, idx: number) => {
                const pageNo: number = currPageNo - idx - 1;
                const isInRange: boolean = pageNo > 1 && pageNo < totalPage;
                const hsGtOnePageTilFirstPage: boolean = idx === maxSpread && (currPageNo - pageNo) >= 1;
                if (isInRange) container.unshift(hsGtOnePageTilFirstPage ? DOTS : pageNo);
                return container;
            }, []) :
            null;

        return { ltSpread, rtSpread, maxSpread };
    }

    /**
     * Forumla for calculating corresponding page index for left/right spread '...' based on the
     * context of current page and the maxSpread (no. of pages between current and target page)
     *
     * e.g. maxSpread = 3
     * ------------------------------------------------------------
     * Current Page          | Spread/Target Page    | Spread Type
     * No.      | Index      | No.      | Index      |
     * ------------------------------------------------------------
     * 1          0            4          3            Right Spread
     * 10         9            6          5            Left Spread
     */
    getPageIdxForSpread(currPageIdx: number, maxSpread: number, isLtSpread: boolean): number {
        return isLtSpread ?
            (currPageIdx - maxSpread - 1) :
            (currPageIdx + maxSpread + 1) ;
    }

    //// Helper Methods
    canNavToPage({ curr, last }: IPageRange, { type, target }: IPageNavQuery): boolean {
        if (!this.isGteZero([curr, last])) return false;

        switch (type) {
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
            vals.every((val: any) => (Number.isInteger(val) && val >= 0)) :
            Number.isInteger(vals) && vals >= 0;
    }

    //// Generic UI Component Related
    /**
     * Create Generic Attributes that can be passed/mapped to Attributes/Inputs/Props of Static HTML or Angular/React/Vue/etc Components
     *
     * - Usage Example for React:
     * const callback = (modState => this.setState({...this.state, ...modState})).bind(this);
     * createGenericCmpProps({option, state, data, callback});
     */
    createGenericCmpAttr({ data, option, state, callback }: ICmpAttrQuery): ICmpAttr {
        const { first, prev, next, last, ltSpread, rtSpread } = state;
        const onEvt: TFn = this.getGenericCmpEvtHandler(data, option, callback);

        return {
            // Attr. for First/Prev/Next/Last as Button
            firstBtnAttr: this.getTextBtnAttr(onEvt, ['first', first]),
            prevBtnAttr: this.getTextBtnAttr(onEvt, ['prev', prev]),
            nextBtnAttr: this.getTextBtnAttr(onEvt, ['next', next]),
            lastBtnAttr: this.getTextBtnAttr(onEvt, ['last', last]),

            // Attr. for Spread as Button
            ltSpreadBtnsAttr: ltSpread ?
                ltSpread.map((page: number) => this.getSpreadBtnAttr(onEvt, state, [page, true])) :
                null,
            rtSpreadBtnsAttr: rtSpread ?
                rtSpread.map((page: number) => this.getSpreadBtnAttr(onEvt, state, [page, false])) :
                null,

            // Attr. for Page Select and Per Page Select
            perPageSelectAttr: this.getPerPageSelectAttr(onEvt, option),
            pageSelectAttr: this.getPageSelectAttr(onEvt, state),
        };
    }

    getTextBtnAttr(onEvt: TFn, [title, pageIdx]: [string, number]): ICmpBtnAttr {
        return {
            title,
            isDisabled: !Number.isInteger(pageIdx),
            onEvt: () => onEvt({
                page: pageIdx
            })
        };
    }

    getSpreadBtnAttr(onEvt: TFn, state: IState, [page, isLtSpread]: [any, boolean]): ICmpBtnAttr {
        const { curr, maxSpread } = state;

        // If the page is not a number, then its likely dots '...' so page is jumped by an interval of `maxSpread`
        // - e.g. maxSpread = 3, currPageNo = 6
        // then the page is jumped to 2 (eqv. to page index of 3)
        const isNum: boolean = typeof page === 'number';
        // const pageIdx = isNum ? page - 1 : curr;
        const targetPageIdx: number = isLtSpread ?
            (isNum ? curr - 1 : this.getPageIdxForSpread(curr, maxSpread, true) ):
            (isNum ? curr + 1 : this.getPageIdxForSpread(curr, maxSpread, false));

        return {
            title: isNum ? page : (isLtSpread ? 'left-spread' : 'right-spread'),
            isSpread: !isNum,
            onEvt: () => onEvt({
                page: targetPageIdx
            })
        };
    }

    getPageSelectAttr(onEvt: TFn, state: IState): ICmpSelectAttr {
        const { pageNo, totalPage, ltSpread, rtSpread } = state;

        const isLteOnePage: boolean = totalPage <= 1;

        // Options (inclusive of all pages here)
        const leftOptions: TPageList = (isLteOnePage || pageNo === 1) ?
            [ 1 ] :
            [ 1, ...(ltSpread ? ltSpread : []), pageNo ];

        const rightOptions: TPageList = (isLteOnePage || pageNo === totalPage) ?
            [] :
            [ ...(rtSpread ? rtSpread : []), totalPage ];

        const options: TPageList = [ ...leftOptions, ...rightOptions ];
        const selectedOptionIdx: number = leftOptions.length - 1;

        return {
            title: 'page select',
            isDisabled: isLteOnePage,
            options,
            selectedOptionValue: pageNo,
            selectedOptionIdx,
            onEvt: ({ target }: ISelectEvt) => {
                const targetPageIdx: number = this.getTargetPageIdxByPos(
                    state,
                    options,
                    [ parseInt(target.value, 10), selectedOptionIdx ]
                );
                onEvt({ page: targetPageIdx });
            }
        };
    }

    getPerPageSelectAttr(onEvt: TFn, option: IOption): ICmpSelectAttr {
        const { increment, incrementIdx } = option;
        return {
            title: 'per page select',
            isDisabled: increment.length <= 1,
            options: increment,
            selectedOptionValue: increment[incrementIdx],
            selectedOptionIdx: incrementIdx,
            onEvt: ({ target }: ISelectEvt) => onEvt({
                page: 0,
                incrementIdx: parseInt(target.value, 10)
            })
        };
    }

    getGenericCmpEvtHandler(data: any[], option: IOption, callback?: TFn): TFn {
        return ((modOption: Partial<IOption>): void => {
            const pgnOption: IOption = this.createOption(modOption, option);
            const pgnState: IState = this.createState(data, pgnOption);
            if (callback) callback({ pgnOption, pgnState });
        }).bind(this);
    }

    getTargetPageIdxByPos(state: IState, pages: TPageList, [currPos, activePos]: [number, number]): number {
        const { curr, maxSpread } = state;
        const page: string | number = pages[currPos];
        const targetPageIdx: number = typeof page === 'number' ?
            page - 1 :
            this.getPageIdxForSpread(curr, maxSpread, currPos < activePos);
        return targetPageIdx;
    }
}