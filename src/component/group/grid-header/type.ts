import * as headerGrpHandleType from '../../../service/handle/header-group/type';
import * as sortBtnType from '../../base/btn-sort/type';
import { ReactElement } from 'react';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    type?: 'table' | 'list';
    data: Record<string, any>[];
    rows: TTbHeaderRows | TListHeaderRows;
    sortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export type TListHeaderRows = headerGrpHandleType.ICtxListHeader<TTitle>;
export type TTbHeaderRows = headerGrpHandleType.ICtxTbHeader<TTitle>;
export type TTitle = string | ReactElement | ((...args: any[]) => ReactElement);
