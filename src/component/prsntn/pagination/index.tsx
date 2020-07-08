import React, { ReactElement, Component, memo } from "react";

import { Dropdown } from '../dropdown';
import { inclStaticIcon } from '../../static/icon';

import { IProps, TSelectEvt, TEvtHandler } from './type';

const ltArrowElem: ReactElement = inclStaticIcon('arrow-lt');
const rtArrowElem: ReactElement = inclStaticIcon('arrow-rt');

export class _Pagination extends Component<IProps> {
    readonly CLS_PREFIX: string = 'kz-paginate';

    render() {
        const { CLS_PREFIX } = this;
        const {
            // Text
            startRecord, endRecord, totalRecord,

            // Buttons
            first, prev, next, last,

            // Page Select
            pageList, pageSelectIdx,

            // Per Page Select
            increment, incrementIdx,

            // Callback for Buttons & Selects
            onPgnChange
        } = this.props;

        const pageSelectProps = this.createPageSelectProps(pageList, pageSelectIdx, onPgnChange);
        const perPageSelectProps = this.createPerPageSelectProps(increment, incrementIdx, onPgnChange);
        const firstBtnProps = this.createBtnProps('first', first, onPgnChange);
        const prevBtnProps = this.createBtnProps('prev', prev, onPgnChange);
        const nextBtnProps = this.createBtnProps('next', next, onPgnChange);
        const lastBtnProps = this.createBtnProps('last', last, onPgnChange);

        return (
            <div className={CLS_PREFIX}>
                <p>Showing {startRecord} - {endRecord} of {totalRecord}</p>
                <Dropdown {...pageSelectProps} />
                <Dropdown {...perPageSelectProps} />
                <button {...firstBtnProps} />
                <button {...prevBtnProps} />
                <button {...nextBtnProps} />
                <button {...lastBtnProps} />
            </div>
        );
    }

    createBtnProps(name: string, pageIdx: number, onPgnChange: TEvtHandler) {
        const CLS_SUFFIX: string = `btn-${name}`;

        let children: ReactElement | ReactElement[];
        switch(name) {
            case 'first':
                children = [ltArrowElem, ltArrowElem];
                break;
            case 'prev':
                children = ltArrowElem;
                break;
            case 'next':
                children = rtArrowElem;
                break;
            case 'last':
                children = [rtArrowElem, rtArrowElem];
                break;
        }

        return {
            key: CLS_SUFFIX,
            type: 'button',
            className: `${this.CLS_PREFIX}__${CLS_SUFFIX}`,
            disabled: !Number.isInteger(pageIdx),
            children,
            onClick: () => onPgnChange({page: pageIdx})
        } as any;
    }

    createPageSelectProps(pageList: number[], pageSelectIdx: number, onPgnChange: TEvtHandler) {
        const CLS_SUFFIX: string = 'select-page';

        return {
            key: CLS_SUFFIX,
            className: `${this.CLS_PREFIX}__${CLS_SUFFIX}`,
            border: true,
            disabled: pageList.length <= 1,
            selectIdx: pageSelectIdx,
            list: pageList,
            listTxtTransform: (pageIdx: number) => `Page ${pageIdx+1}`,
            onSelect: ({target}: TSelectEvt) => onPgnChange({page: pageList[parseInt(target.value, 10)]}),
        };
    }

    createPerPageSelectProps(increment: number[], incrementIdx: number, onPgnChange: TEvtHandler) {
        const CLS_SUFFIX: string = 'select-perpage';

        return {
            key: CLS_SUFFIX,
            className: `${this.CLS_PREFIX}__${CLS_SUFFIX}`,
            border: true,
            value: incrementIdx,
            list: increment,
            listTxtTransform: (perPage: number) => `${perPage} Per Page`,
            onSelect: ({target}: TSelectEvt) => onPgnChange({
                incrementIdx: parseInt(target.value, 10),
                page: 0
            })
        };
    }
}

export const Pagination = memo(_Pagination);