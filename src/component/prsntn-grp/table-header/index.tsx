import React, { memo, FC } from 'react';
import { SortBtn } from '../../prsntn/sort-btn';
import { IProps, thHandleType } from './type';

export const _TableHeader: FC<IProps> = ({ thRowsContext, getSortBtnProps } : IProps) => {
    return (
        <thead className="kz-tableheader">{ thRowsContext.map((thCtxs: thHandleType.IThCtx[], trIdx: number) => (
            <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }: thHandleType.IThCtx, thIdx: number) => (
                <th key={thIdx} {...thProps}>
                    <span>{title}</span>{ sortKey && getSortBtnProps &&
                    <SortBtn {...getSortBtnProps(sortKey)} />}
                </th>))}
            </tr>))}
        </thead>
    );
};

export const TableHeader = memo(_TableHeader);