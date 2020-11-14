import * as headerGrpHandleType from '../../../service/handle/header-group/type';
import * as sortBtnType from '../../base/btn-sort/type';
import { ReactElement } from 'react';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    type?: 'table' | 'list';
    data: Record<string, any>[];
    rows: TTbHeaderRows | TListHeaderRows;
    sortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export type TListHeaderRows = headerGrpHandleType.ICtxListHeader;
export type TTbHeaderRows = headerGrpHandleType.ICtxTbHeader<string | ReactElement>;
