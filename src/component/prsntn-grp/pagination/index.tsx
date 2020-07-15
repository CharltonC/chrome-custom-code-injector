import React, { ReactElement, memo } from "react";

import { Dropdown } from '../../prsntn/dropdown';
import { inclStaticIcon } from '../../static/icon';

import { IProps } from './type';

export const _Pagination = (props: IProps) => {
    const CLS_PREFIX: string = 'kz-paginate';
    const ltArrowElem: ReactElement = inclStaticIcon('arrow-lt');
    const rtArrowElem: ReactElement = inclStaticIcon('arrow-rt');

    const {
        startRecord,
        endRecord,
        totalRecord,
        pageNo,
        totalPage,
        first: firstPage,
        firstBtnAttr: first,
        prevBtnAttr: prev,
        nextBtnAttr: next,
        lastBtnAttr: last,
        ltSpreadBtnsAttr: ltSpread,
        rtSpreadBtnsAttr: rtSpread,
        perPageSelectAttr: perPage,
        pageSelectAttr: page
    } = props;

    return (
        <div className={CLS_PREFIX}>
            <p>Showing {startRecord} - {endRecord} of {totalRecord}</p>
            <Dropdown
                border={true}
                list={perPage.options}
                listTxtTransform={(p) => `${p} Per Page`}
                selectIdx={perPage.selectedOptionIdx}
                onSelect={perPage.onEvt}
                />
            <Dropdown
                border={true}
                disabled={page.isDisabled}
                list={page.options}
                listTxtTransform={(p) => Number.isInteger(p) ? `Page ${p}` : `${p}`}
                selectIdx={page.selectedOptionIdx}
                onSelect={page.onEvt}
                />
            <button
                className={`${CLS_PREFIX}__btn-first`}
                type="button"
                disabled={first.isDisabled}
                onClick={first.onEvt}
                >
                {ltArrowElem}{ltArrowElem}
            </button>
            <button
                className={`${CLS_PREFIX}__btn-prev`}
                type="button"
                disabled={prev.isDisabled}
                onClick={prev.onEvt}
                >
                {ltArrowElem}
            </button>
            <button
                className={`${CLS_PREFIX}__btn-next`}
                type="button"
                disabled={next.isDisabled}
                onClick={next.onEvt}
                >
                {rtArrowElem}
            </button>
            <button
                className={`${CLS_PREFIX}__btn-last`}
                type="button"
                disabled={last.isDisabled}
                onClick={last.onEvt}
                >
                {rtArrowElem}{rtArrowElem}
            </button>
            <section>
                {!first.isDisabled &&
                <button
                    className={`${CLS_PREFIX}__btn-first`}
                    type="button"
                    onClick={first.onEvt}
                    >
                    1
                </button>}
                {ltSpread?.map(({title, onEvt}, idx) => (
                    <button
                        key={`lt-spread-${idx}`}
                        type="button"
                        onClick={onEvt}
                        >
                        {typeof title === 'number' ? title : '...'}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={true}
                    >
                    {pageNo}
                    </button>
                {rtSpread?.map(({title, onEvt}, idx) => (
                    <button
                    key={`rt-spread-${idx}`}
                        type="button"
                        onClick={onEvt}
                        >
                        {typeof title === 'number' ? title : '...'}
                    </button>
                ))}
                {!last.isDisabled &&
                <button
                    className={`${CLS_PREFIX}__btn-last`}
                    type="button"
                    onClick={last.onEvt}
                    >
                    {totalPage}
                    </button>
                }
            </section>
        </div>
    );
};

export const Pagination = memo(_Pagination);