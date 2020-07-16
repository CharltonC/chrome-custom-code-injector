import React, { ReactElement, memo, Component } from "react";

import { Dropdown } from '../../prsntn/dropdown';
import { inclStaticIcon } from '../../static/icon';

import {
    IProps, IBtnProps, ISelectProps,
    pgnHandleType
 } from './type';

const CLS_PREFIX: string = 'kz-paginate';
const ltArrowElem: ReactElement = inclStaticIcon('arrow-lt');
const rtArrowElem: ReactElement = inclStaticIcon('arrow-rt');

export class _Pagination extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            startRecord, endRecord, totalRecord,
            firstBtnAttr, prevBtnAttr, nextBtnAttr, lastBtnAttr,
            pageSelectAttr, perPageSelectAttr,
        } = this.props;

        const perPageSelectProps: ISelectProps = this.getMappedSelectProps(perPageSelectAttr, true);
        const pageSelectProps: ISelectProps = this.getMappedSelectProps(pageSelectAttr, false);
        const firstBtnProps: IBtnProps = this.getMappedBtnProps(firstBtnAttr, 'first');
        const prevBtnProps: IBtnProps = this.getMappedBtnProps(prevBtnAttr, 'prev');
        const nextBtnProps: IBtnProps = this.getMappedBtnProps(nextBtnAttr, 'next');
        const lastBtnProps: IBtnProps = this.getMappedBtnProps(lastBtnAttr, 'last');

        return (
            <div className={CLS_PREFIX}>
                <p className={`${CLS_PREFIX}__record`}>Showing {startRecord} - {endRecord} of {totalRecord}</p>
                <Dropdown {...perPageSelectProps} />
                <button {...firstBtnProps}>{ltArrowElem}{ltArrowElem}</button>
                <button {...prevBtnProps}>{ltArrowElem}</button>
                <Dropdown {...pageSelectProps} />
                <button {...nextBtnProps}>{rtArrowElem}</button>
                <button {...lastBtnProps}>{rtArrowElem}{rtArrowElem}</button>
            </div>
        );
    }

    getOptionTextPipe(isPerPage: boolean): (val: any) => string {
        return isPerPage ?
            (text: string | number) => `${text} Per Page` :
            (text: string | number) => Number.isInteger(text as number) ? `Page ${text}` : `${text}`;
    }

    getMappedBtnProps(btnAttr: pgnHandleType.ICmpBtnAttr, btnName: string): IBtnProps {
        return {
            type: 'button',
            className:`${CLS_PREFIX}__btn ${CLS_PREFIX}__btn--${btnName}`,
            disabled: btnAttr.isDisabled,
            onClick: btnAttr.onEvt
        }
    }

    getMappedSelectProps(selectAttr: pgnHandleType.ICmpSelectAttr, isPerPage: boolean): ISelectProps {
        return {
            wrapperCls: `${CLS_PREFIX}__select ${CLS_PREFIX}__select--${isPerPage ? 'perpage' : 'page'}`,
            border: true,
            disabled: selectAttr.isDisabled,
            list: selectAttr.options,
            listTxtTransform: this.getOptionTextPipe(isPerPage),
            selectIdx: selectAttr.selectedOptionIdx,
            onSelect: selectAttr.onEvt,
        };
    }
}

export const Pagination = memo(_Pagination);