import React from "react";
import { MemoComponent } from '../../../extendable/memo-component';
import { Dropdown } from '../../../base/select-dropdown';
import { inclStaticIcon } from '../../../static/icon';

import {
    IProps, IBtnProps, ISelectProps,
    TPgnHandle
 } from './type';

const CLS_PREFIX = 'paginate';
const $ltArrow = inclStaticIcon('arrow-lt');
const $rtArrow = inclStaticIcon('arrow-rt');

export class DataGridPagination extends MemoComponent<IProps> {
    render() {
        const {
            startRecord, endRecord, totalRecord,
            firstBtnAttr, prevBtnAttr, nextBtnAttr, lastBtnAttr,
            pageSelectAttr, perPageSelectAttr,
        } = this.props;

        // Since <Dropdown> component callback arg has slightly diff. structure than result from `getMappedSelectProps`
        // hence require an extra layer
        // - `onSelect` from `getMappedSelectProps`: (event) => ..
        // - `onSelector` from <Dropdown>: ({ evt, ... }) => ...
        const perPageSelectProps = this.getMappedSelectProps(perPageSelectAttr, true);
        const pageSelectProps = this.getMappedSelectProps(pageSelectAttr, false);

        const firstBtnProps = this.getMappedBtnProps(firstBtnAttr, 'first');
        const prevBtnProps = this.getMappedBtnProps(prevBtnAttr, 'prev');
        const nextBtnProps = this.getMappedBtnProps(nextBtnAttr, 'next');
        const lastBtnProps = this.getMappedBtnProps(lastBtnAttr, 'last');

        return (
            <div className={CLS_PREFIX}>
                <p className={`${CLS_PREFIX}__record`}>Showing {startRecord} - {endRecord} of {totalRecord}</p>
                <Dropdown {...perPageSelectProps} />
                <button {...firstBtnProps}>{$ltArrow}{$ltArrow}</button>
                <button {...prevBtnProps}>{$ltArrow}</button>
                <Dropdown {...pageSelectProps} />
                <button {...nextBtnProps}>{$rtArrow}</button>
                <button {...lastBtnProps}>{$rtArrow}{$rtArrow}</button>
            </div>
        );
    }

    getOptionTextPipe(isPerPage: boolean): (val: any) => string {
        return isPerPage ?
            (text: string | number) => `${text} Per Page` :
            (text: string | number) => Number.isInteger(text as number) ? `Page ${text}` : `${text}`;
    }

    getMappedBtnProps(btnAttr: TPgnHandle.ICmpBtnAttr, btnName: string): IBtnProps {
        const { disabled, onClick } = btnAttr;
        return {
            type: 'button',
            className:`${CLS_PREFIX}__btn ${CLS_PREFIX}__btn--${btnName}`,
            disabled,
            onClick
        }
    }

    getMappedSelectProps(selectAttr: TPgnHandle.ICmpSelectAttr, isPerPage: boolean): ISelectProps {
        const { disabled, options, selectedOptionIdx, onSelect, } = selectAttr;
        return {
            clsSuffix: isPerPage ? 'perpage' : 'page',
            border: true,
            disabled,
            list: options,
            listTxtTransform: this.getOptionTextPipe(isPerPage),
            selectIdx: selectedOptionIdx,
            onSelect: ({ evt }) => onSelect(evt)
        };
    }
}