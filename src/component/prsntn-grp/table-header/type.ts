import * as headerGrpHandleType from '../../../service/ui-handle/header-group/type';
import * as sortBtnType from '../../prsntn/sort-btn/type';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    thRowsContext: headerGrpHandleType.IState[][];
    sortBtnProps?: (sortKey: string) => sortBtnType.IProps;
}

export { headerGrpHandleType as headerGrpHandleType };