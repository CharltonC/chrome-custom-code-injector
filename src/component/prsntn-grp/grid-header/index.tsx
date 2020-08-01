import React, { ReactElement } from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { SortBtn } from '../../prsntn/sort-btn';
import { IProps, headerGrpHandleType } from './type';

export class GridHeader extends MemoComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { props } = this;
        const isTb: boolean = props.type !== 'list';
        return this.renderTbHeader(props);
        // return isTb ? this.renderTbHeader(props) ? this.renderListHeader(props);
    }

    renderTbHeader({ rowsContext, sortBtnProps } : IProps): ReactElement {
        return (
            <thead className="kz-datagrid__head">{ rowsContext.map((thCtxs: headerGrpHandleType.IState[], trIdx: number) => (
                <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }: headerGrpHandleType.IState, thIdx: number) => (
                    <th key={thIdx} {...thProps}>
                        <span>{title}</span>{ sortKey && sortBtnProps &&
                        <SortBtn {...sortBtnProps(sortKey)} />}
                    </th>))}
                </tr>))}
            </thead>
        );
    }

    // renderListHeader({ rowsContext, sortBtnProps } : IProps): ReactElement {

    // }
}