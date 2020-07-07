import React, { ReactElement } from "react";

import { PgnHandle } from '../../../service/handle/paginate';
import { ClpsHandle } from "../../../service/handle/collapse";
import { SortHandle } from "../../../service/handle/sort";

import { Dropdown } from '../dropdown';
import { inclStaticIcon } from '../../static/icon';
import {
    TFn, TBtnProps, TSelectEvt,

    // Pagination
    IPgnState, IPgnProps, IPgnPropsCtx, TPgnCallback,
    pgnHandleType, PgnOption, dropdownType,

    // Expand
    // TODO: rename
    clpsHandleType, TNestState, IClpsProps,

    ISortState,
    ISortOption,
    sortBtnType,

    // Sort
} from './type';


export class PaginateHelper extends PgnHandle {
    readonly CLS_PREFIX: string = 'kz-paginate';
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
        modOption.increment = increment ? this.parseNoPerPage(increment) : increment;

        const option: PgnOption = Object.assign(this.getDefOption(), modOption);
        const status: pgnHandleType.IPgnStatus = this.getPgnStatus(data, option);
        return { option, status };
    }

    // typical callback example: `((pgnState: IPgnState) => this.setState(...this.state, {pgnState})).bind(this)`
    createProps(data: any[], pgnState: IPgnState, callback?: TPgnCallback): IPgnProps {
        const { option, status } = pgnState;
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

export class ExpandHelper extends ClpsHandle {
    createRowProps({nestState, showOnePerLvl, callback}, itemCtx: clpsHandleType.IItemCtx, ): IClpsProps {
        const { itemPath, isDefNestedOpen } = itemCtx;

        // Only Set the state for each Item during Initialization, if not use the existing one
        const isInClpsState: boolean = typeof nestState[itemPath] !== 'undefined';
        if (!isInClpsState) this.addRowState(nestState, itemCtx);

        const isNestedOpen: boolean = isInClpsState ? nestState[itemPath] : isDefNestedOpen;
        const onExpdChanged: TFn = () => {
            // Find the items that are at the same level and if they are open (true), close them (set them to false)
            const impactedItemsState: TNestState = showOnePerLvl && !isNestedOpen ? this.createImpactedRowsState(nestState, itemCtx) : {};
            const itemState: TNestState = { [itemCtx.itemPath]: !isNestedOpen };

            // callback example: ((nestState) => this.setState({...this.state, {nestState}})).bind(this)
            if (!callback) return;
            const modNestState = {
                ...nestState,
                ...impactedItemsState,
                ...itemState
            };
            callback(modNestState);
        }

        return { isNestedOpen, onCollapseChanged: onExpdChanged.bind(this) };
    }

    addRowState(nestState: TNestState, { itemPath, isDefNestedOpen }: clpsHandleType.IItemCtx): void {
        nestState[itemPath] = isDefNestedOpen;
    }

    createImpactedRowsState(nestState: TNestState, { itemLvl, itemKey, parentPath }: clpsHandleType.IItemCtx): TNestState {
        const itemPaths: string[] = Object.getOwnPropertyNames(nestState);
        const isRootLvlItem: boolean = itemLvl === 0;
        const relCtx: string = isRootLvlItem ? '' : `${parentPath}/${itemKey}:`;
        const relCtxPattern: RegExp = new RegExp(relCtx + '\\d+$');

        const impactedItemPaths: string[] = itemPaths.filter((ctx: string) => {
            return isRootLvlItem ?
                Number.isInteger(Number(ctx)) :
                relCtxPattern.test(ctx);
        });

        return impactedItemPaths.reduce((impactedState: TNestState, ctx: string) => {
            const isImpactedItemOpen: boolean = nestState[ctx];
            return isImpactedItemOpen ? { ...impactedState, [ctx]: false } : impactedState;
        }, {});
    }
}

export class SortHelper extends SortHandle {
    createState(data: any[], sortOption: ISortOption): ISortState {
        const { key, isAsc } = sortOption;
        return {
            option: { ...sortOption },
            data: this.sortByObjKey(data, key, isAsc)
        };
    }

    createBtnProps({data, option, callback}, sortKey: string): sortBtnType.IProps {
        const { key, isAsc: isCurrAsc } = option;

        const isAsc: boolean = key === sortKey ? isCurrAsc : null;

        const onClick = () => {
            const isSameTh: boolean = sortKey === key;
            const modOption = {
                key: isSameTh ? key : sortKey,
                isAsc: isSameTh ? !isAsc : true
            };

            // Callback example: `( (sortState) => this.setState({...this.state, sortState}) ).bind(this)`
            if (!callback) return;
            const sortState = this.createState(data, modOption);
            callback(sortState);
        };

        return { isAsc, onClick: onClick.bind(this) };
    }
}