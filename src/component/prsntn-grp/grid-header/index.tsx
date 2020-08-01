import React from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { SortBtn } from '../../prsntn/sort-btn';
import { IProps, THeadContext, TThSpanProps, TLiSpanProps } from './type';

export class GridHeader extends MemoComponent<IProps> {
    readonly BASE_CLS: string = 'kz-datagrid__head';

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { BASE_CLS } = this;
        const { table: isTb, rowsContext, sortBtnProps } = this.props;
        const HeadTag = isTb ? 'thead' : 'ul';
        const RowTag = isTb ? 'tr' : 'li';
        const CellTag = isTb ? 'th' : 'div';

        return (
            <HeadTag className={BASE_CLS}>{ rowsContext.map((thCtxs: THeadContext[], trIdx: number) => (
                <RowTag
                    key={trIdx}
                    className={`${BASE_CLS}-row`}
                    >{ thCtxs.map( ({ title, sortKey, ...thProps }: THeadContext, thIdx: number) => (
                    <CellTag
                        key={thIdx}
                        className={`${BASE_CLS}-cell`}
                        {...this.parseSpanProps(thProps, isTb)}
                        >
                        <span>{title}</span>{ sortKey && sortBtnProps &&
                        <SortBtn {...sortBtnProps(sortKey)} />}
                    </CellTag>))}
                </RowTag>))}
            </HeadTag>
        );
    }

    parseSpanProps(props: TThSpanProps, isTb: boolean): TThSpanProps | TLiSpanProps {
        if (!props) return {} as any;
        if (isTb) return props;

        const { colSpan, rowSpan } = props;
        return {
            'data-colspan': colSpan,
            'data-rowspan': rowSpan
        } as TLiSpanProps;
    }
}