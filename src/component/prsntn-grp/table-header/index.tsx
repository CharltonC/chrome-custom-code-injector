import React, { memo, FC } from 'react';
import { SortBtn } from '../../prsntn/sort-btn';
import { IProps, thHandleType } from './type';

export const _TableHeader: FC<IProps> = ({ thRowsContext, sortBtnProps } : IProps) => {
    return (
        <thead className="kz-tableheader">{ thRowsContext.map((thCtxs: thHandleType.IThCtx[], trIdx: number) => (
            <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }: thHandleType.IThCtx, thIdx: number) => (
                <th key={thIdx} {...thProps}>
                    <span>{title}</span>{ sortKey && sortBtnProps &&
                    <SortBtn {...sortBtnProps(sortKey)} />}
                </th>))}
            </tr>))}
        </thead>
    );
};

export const TableHeader = memo(_TableHeader);