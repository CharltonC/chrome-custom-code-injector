import React, { ReactElement } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { UtilHandle } from '../../../service/handle/util';
import { SortBtn } from '../../base/sort-btn';
import { IProps, TTbHeaderRows, TListHeaderRows } from './type';

export class GridHeader extends MemoComponent<IProps> {
    readonly BASE_CLS: string = 'datagrid__head';
    readonly cssCls = new UtilHandle().cssCls;

    render() {
        const TB: string = 'table';
        const isTb: boolean = (this.props.type ?? TB) === TB;
        return isTb ? this.renderTbHeader() : this.renderListHeader();
    }

    renderTbHeader(): ReactElement {
        const { BASE_CLS } = this;
        const { rows, sortBtnProps } = this.props;
        const { headers } = rows as TTbHeaderRows;

        return (
            <thead className={BASE_CLS}>{ headers.map((thCtxs, trIdx: number) => (
                <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }, thIdx: number) => (
                    <th
                        key={thIdx}
                        className={`${BASE_CLS}-cell`}
                        {...thProps}
                        >
                        <span>{title}</span>{ sortKey && sortBtnProps &&
                        <SortBtn {...sortBtnProps(sortKey)} />}
                    </th>))}
                </tr>))}
            </thead>
        );
    }

    renderListHeader(): ReactElement {
        const { BASE_CLS } = this;
        const { rows, sortBtnProps } = this.props;
        const { headers, rowTotal, colTotal, ...wrapperCssGrid } = rows as TListHeaderRows;
        const wrapperCssGridVar = this.getCssGridVar(wrapperCssGrid);

        return (
            <ul
                style={wrapperCssGridVar}
                className={BASE_CLS}
                >{ headers.map(({ title, sortKey, rowSpan, colSpan, ...cellCssGrid }, thIdx: number) => (
                <li
                    key={thIdx}
                    className={`${BASE_CLS}-cell`}
                    style={this.getCssGridVar(cellCssGrid)}
                    >
                    <span>{title}</span>{ sortKey && sortBtnProps &&
                    <SortBtn {...sortBtnProps(sortKey)} />}
                </li>))}
            </ul>
        );
    }

    getCssGridVar(cssGrid: Record<string, any>): Record<string, string> {
        const cssGridVar: Record<string, string> = {};
        Object
            .entries(cssGrid)
            .forEach(([key, val]: [string, any]) => {
                cssGridVar[`--${key}`] = `${val}`;
            });
        return cssGridVar;
    }
}