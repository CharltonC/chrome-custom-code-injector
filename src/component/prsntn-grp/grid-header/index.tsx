import React, { memo, FC } from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { SortBtn } from '../../prsntn/sort-btn';
import { IProps, headerGrpHandleType } from './type';

export const _GridHeader: FC<IProps> = ({ thRowsContext, sortBtnProps } : IProps) => {
    return (
        <thead className="kz-datagrid__head">{ thRowsContext.map((thCtxs: headerGrpHandleType.IState[], trIdx: number) => (
            <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }: headerGrpHandleType.IState, thIdx: number) => (
                <th key={thIdx} {...thProps}>
                    <span>{title}</span>{ sortKey && sortBtnProps &&
                    <SortBtn {...sortBtnProps(sortKey)} />}
                </th>))}
            </tr>))}
        </thead>
    );
};

export const GridHeader = memo(_GridHeader);