import * as headerGrpHandleType from '../../../service/handle/header-group/type';
import * as sortBtnType from '../../prsntn/sort-btn/type';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    type?: 'table' | 'list';
    rows: TTbHeaderRows | TListHeaderRows;
    sortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export type TTbHeaderRows = headerGrpHandleType.ICtxTbHeader;
export type TListHeaderRows = headerGrpHandleType.ICtxListHeader;