import * as thHandleType from '../../../service/handle/header-group/type';
import * as sortBtnType from '../../prsntn/sort-btn/type';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    thRowsContext: thHandleType.ICtxTbHeader[][];
    sortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export { thHandleType as thHandleType };