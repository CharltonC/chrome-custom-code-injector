import React, { ReactElement } from "react";
import { PgnHandle } from '../../../service/handle/paginate';
import { Dropdown } from '../dropdown';
import { inclStaticIcon } from '../../static/icon';
import {
    TFn, TBtnProps, TSelectEvt,
    IPgnState, IPgnProps, IPgnPropsCtx, TPgnCallback,
    pgnHandleType, PgnOption, dropdownType
} from './type';

export class PaginateHelper {
    readonly CLS_PREFIX: string = 'kz-paginate';
    readonly pgnHandle = new PgnHandle();
    readonly ltArrowElem: ReactElement = inclStaticIcon('arrow-lt');
    readonly rtArrowElem: ReactElement = inclStaticIcon('arrow-rt');

    createDefComponent(status: pgnHandleType.IPgnStatus, pgnProps: IPgnProps): ReactElement {
        // TODO: allow self compose from props
        const { startRecord, endRecord, totalRecord } = status;
        const { CLS_PREFIX, ltArrowElem, rtArrowElem } = this;
        const {
            firstBtnProps,
            prevBtnProps,
            nextBtnProps,
            lastBtnProps,
            perPageSelectProps,
            pageSelectProps
        } = pgnProps

        return <div className={CLS_PREFIX}>
            <p>Showing {startRecord} - {endRecord} of {totalRecord}</p>
            <Dropdown {...pageSelectProps} />
            <Dropdown {...perPageSelectProps} />
            <button {...firstBtnProps}>{[ltArrowElem, ltArrowElem]}</button>
            <button {...prevBtnProps}>{ltArrowElem}</button>
            <button {...nextBtnProps}>{rtArrowElem}</button>
            <button {...lastBtnProps}>{[rtArrowElem, rtArrowElem]}</button>
        </div>;
    }

    createState(data: any[], modOption: PgnOption): IPgnState {
        // Only display valid increments for <option> value
        const { increment } = modOption;
        modOption.increment = increment ? this.pgnHandle.parseNoPerPage(increment) : increment;

        const option: PgnOption = Object.assign(this.pgnHandle.getDefOption(), modOption);
        const status: pgnHandleType.IPgnStatus = this.pgnHandle.getPgnStatus(data, option);
        return { option, status };
    }

    // typical callback example: `((pgnState: IPgnState) => this.setState(...this.state, {pgnState})).bind(this)`
    createProps(data: any[], option: PgnOption, status: pgnHandleType.IPgnStatus, callback?: TPgnCallback): IPgnProps {
        const { first, prev, next, last } = status;
        const propsCtx = { data, option, callback };

        return {
            firstBtnProps: this.createBtnProps(propsCtx, 'first', first),
            prevBtnProps: this.createBtnProps(propsCtx, 'prev', prev),
            nextBtnProps: this.createBtnProps(propsCtx, 'next', next),
            lastBtnProps: this.createBtnProps(propsCtx, 'last', last),
            perPageSelectProps: this.createPerPageSelectProps(propsCtx, option),
            pageSelectProps: this.createPageSelectProps(propsCtx, status)
        };
    }

    createBtnProps(commonCtx: IPgnPropsCtx, id: string, pageIdx: number): TBtnProps {
        const onClick: TFn = () => {
            const option: Partial<PgnOption> = {page: pageIdx};
            this.onPgnChanged(commonCtx, option);
        };

        return {
            className: `${this.CLS_PREFIX}__btn-${id}`,
            type: 'button',
            disabled: !Number.isInteger(pageIdx),
            onClick: onClick.bind(this)
        };
    }

    createPerPageSelectProps(commonCtx: IPgnPropsCtx, {increment, incrementIdx}: PgnOption): dropdownType.IProps {
        const onSelect: TFn = ({target}: TSelectEvt) => {
            const incrmIdx: number = parseInt(target.value, 10);
            const option: Partial<PgnOption> = {incrementIdx: incrmIdx, page: 0};
            this.onPgnChanged(commonCtx, option);
        };

        return {
            className: `${this.CLS_PREFIX}__select-perpage`,
            value: incrementIdx,
            border: true,
            list: increment,
            listTxtTransform: (perPage: number) => `${perPage} Per Page`,
            onSelect: onSelect.bind(this)
        };
    }

    // TODO: cleanup
    createPageSelectProps(commonCtx: IPgnPropsCtx, {totalPage, pageNo}: pgnHandleType.IPgnStatus): dropdownType.IProps {
        let pageList: number[] = [];
        let selectIdx: number = 0;
        for (let p: number = 1; p <= totalPage; p++) {
            const pageIdx = p - 1;
            pageList.push(pageIdx);
            selectIdx = p === pageNo ? pageIdx : selectIdx;
        }

        const onSelect: TFn = ({target}: TSelectEvt) => {
            const pageIdx: number = parseInt(target.value, 10);
            const option: Partial<PgnOption> = {page: pageList[pageIdx]};
            this.onPgnChanged(commonCtx, option);
        };

        return {
            className: `${this.CLS_PREFIX}__select-page`,
            border: true,
            disabled: pageList.length <= 1,
            selectIdx: selectIdx,
            list: pageList,
            listTxtTransform: (pageIdx: number) => `Page ${pageIdx+1}`,
            onSelect: onSelect.bind(this)
        };
    }

    onPgnChanged({data, option, callback}: IPgnPropsCtx, modOption: Partial<PgnOption>): void {
        const state: IPgnState = this.createState(data, {...option, ...modOption});
        if (callback) callback(state);
    }
}