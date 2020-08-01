import * as headerGrpHandleType from '../../../service/ui-handle/header-group/type';
import * as sortBtnType from '../../prsntn/sort-btn/type';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    table?: boolean;
    rowsContext: headerGrpHandleType.IState[][];
    sortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export type THeadContext = headerGrpHandleType.IState;

export type TThSpanProps = Pick<THeadContext, 'colSpan' | 'rowSpan'>;

export type TLiSpanProps = {
    'data-colspan'?: number;
    'data-rowspan'?: number;
};