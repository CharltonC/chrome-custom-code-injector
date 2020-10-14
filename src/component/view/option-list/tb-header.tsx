import React, { memo } from 'react';
import { Checkbox } from '../../base/checkbox';
import { IconBtn } from '../../base/icon-btn';
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
                    {/* TODO: pass ext state */}
                    { thIdx === 0 && <Checkbox id="check-all" /> }
                    {/* TODO: only show when all selected abv */}
                    { thIdx === 10 && <IconBtn icon="delete" theme="gray" /> }
                    <span>{title}</span>{ sortKey && sortBtnProps &&
                    <SortBtn {...sortBtnProps(sortKey)} />}
                </th>))}
            </tr>))}
        </thead>
    );
});