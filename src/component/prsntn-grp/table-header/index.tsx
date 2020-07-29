import React, { memo, FC } from 'react';
import { SortBtn } from '../../prsntn/sort-btn';
import { IProps, headerGrpHandleType } from './type';

export const _TableHeader: FC<IProps> = ({ thRowsContext, sortBtnProps } : IProps) => {
    return (
        <thead className="kz-datagrid__head">{ thRowsContext.map((thCtxs: headerGrpHandleType.ICtxTbHeader[], trIdx: number) => (
            <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }: headerGrpHandleType.ICtxTbHeader, thIdx: number) => (
                <th key={thIdx} {...thProps}>
                    <span>{title}</span>{ sortKey && sortBtnProps &&
                    <SortBtn {...sortBtnProps(sortKey)} />}
                </th>))}
            </tr>))}
        </thead>
    );
};

export const TableHeader = memo(_TableHeader);