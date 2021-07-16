import React, { memo } from "react";
import { IProps } from "./type";

export const _SortBtn: React.FC<IProps> = ({isAsc, ...btnProps}: IProps) => {
    const isActive = typeof isAsc !== 'undefined' && isAsc !== null;
    const BASE_CLS = 'sort-btn';
    const BTN_CLS_SFX = isActive ? ` ${BASE_CLS}--${isAsc ? 'a' : 'd'}sc` : '';
    const ROOT_CLS = BASE_CLS + BTN_CLS_SFX;
    return <button className={ROOT_CLS} {...btnProps} />;
};

export const SortBtn = memo(_SortBtn);