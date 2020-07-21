import * as thHandleType from '../../../service/handle/table-header/type';
import * as sortBtnType from '../../prsntn/sort-btn/type';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    thRowsContext: thHandleType.TRowsThCtx;
    getSortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export { thHandleType as thHandleType };