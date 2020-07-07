import React, { ReactElement, Component, memo } from "react";

import { Dropdown } from '../dropdown';
import { inclStaticIcon } from '../../static/icon';

import { IProps, TSelectEvt } from './type';

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
            onPgnChanged
        } = this.props;

        return (
            <div className={CLS_PREFIX}>
                <p>Showing {startRecord} - {endRecord} of {totalRecord}</p>
                <Dropdown
                    className={`${CLS_PREFIX}__select-page`}
                    border={true}
                    disabled={pageList.length <= 1}
                    selectIdx={pageSelectIdx}
                    list={pageList}
                    listTxtTransform={(pageIdx: number) => `Page ${pageIdx+1}`}
                    onSelect={({target}: TSelectEvt) => onPgnChanged({page: pageList[parseInt(target.value, 10)]})
                    }
                    />
                <Dropdown
                    className={`${CLS_PREFIX}__select-perpage`}
                    border={true}
                    value={incrementIdx}
                    list={increment}
                    listTxtTransform={(perPage: number) => `${perPage} Per Page`}
                    onSelect={({target}: TSelectEvt) => onPgnChanged({
                        incrementIdx: parseInt(target.value, 10),
                        page: 0
                    })}
                    />
                <button
                    type="button"
                    className={`${CLS_PREFIX}__btn-first`}
                    disabled={!Number.isInteger(first)}
                    onClick={() => onPgnChanged({page: first})}
                    >
                    {[ltArrowElem, ltArrowElem]}
                </button>
                <button
                    type="button"
                    className={`${CLS_PREFIX}__btn-prev`}
                    disabled={!Number.isInteger(prev)}
                    onClick={() => onPgnChanged({page: prev})}
                    >
                    {ltArrowElem}
                </button>
                <button
                    type="button"
                    className={`${CLS_PREFIX}__btn-next`}
                    disabled={!Number.isInteger(next)}
                    onClick={() => onPgnChanged({page: next})}
                    >
                    {rtArrowElem}
                </button>
                <button
                    type="button"
                    className={`${CLS_PREFIX}__btn-last`}
                    disabled={!Number.isInteger(last)}
                    onClick={() => onPgnChanged({page: last})}
                    >
                    {[rtArrowElem, rtArrowElem]}
                </button>
            </div>
        );
    }


}

export const Pagination = memo(_Pagination);