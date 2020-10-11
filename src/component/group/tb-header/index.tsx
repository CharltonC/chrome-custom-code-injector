import React, { memo } from 'react';
import { Checkbox } from '../../base/checkbox';
import { SortBtn } from '../../base/sort-btn';

export const TbHeader: React.FC<any> = memo(({ rows, sortBtnProps }) => {
    return (
        <thead className="datagrid__head">{ rows.headers.map((thCtxs, trIdx: number) => (
            <tr key={trIdx}>{ thCtxs.map( ({ title, sortKey, ...thProps }, thIdx: number) => (
                <th
                    key={thIdx}
                    className="datagrid__head-cell"
                    {...thProps}
                    >
                    { thIdx === 0 && <Checkbox id="check-all" /> }
                    <span>{title}</span>{ sortKey && sortBtnProps &&
                    <SortBtn {...sortBtnProps(sortKey)} />}
                </th>))}
            </tr>))}
        </thead>
    );
});