import React, { memo } from "react";
import { IProps } from "./type";

export const _SortBtn: React.FC<IProps> = ({isAsc, ...btnProps}: IProps) => {
    const btnBaseCls: string = 'kz-sort-btn';
    const isActive: boolean = typeof isAsc !== 'undefined' && isAsc !== null;
    const btnClsSuffix: string = isActive ? ` ${btnBaseCls}--${isAsc ? 'a' : 'd'}sc` : '';
    const btnCls: string = btnBaseCls + btnClsSuffix;
    return <button className={btnCls} {...btnProps} />;
};

export const SortBtn = memo(_SortBtn);